/* source: https://effect.website/docs/guides/batching-caching */
import { Effect, RequestResolver, pipe, Request, ReadonlyArray } from "effect";
import * as API from "./API.js";
import * as RequestModel from "./RequestModel.js";

// we assume we cannot batch GetTodos, we create a normal resolver
export const GetTodosResolver = RequestResolver.fromEffect(
  (_: RequestModel.GetTodos) => API.getTodos
);

// we assume we can batch GetUserById, we create a batched resolver
export const GetUserByIdResolver = RequestResolver.makeBatched(
  (requests: RequestModel.GetUserById[]) =>
    API.getUserByIds(requests.map(({ id }) => id)).pipe(
      Effect.flatMap((users) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(
            request,
            pipe(
              ReadonlyArray.findFirst(users, (user) => user.id === request.id),
              Effect.succeed
            )
          )
        )
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
);

// we assume we can batch SendEmail, we create a batched resolver
export const SendEmailResolver = RequestResolver.makeBatched(
  (requests: RequestModel.SendEmail[]) =>
    pipe(
      API.sendEmails(requests.map(({ address, text }) => ({ address, text }))),
      Effect.flatMap(() =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.unit)
        )
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
);
