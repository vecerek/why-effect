/* source: https://effect.website/docs/guides/batching-caching */
import { Array, Effect, RequestResolver, pipe, Request } from "effect"
import * as API from "./API.js"
import * as RequestModel from "./RequestModel.js"

// we assume we cannot batch GetTodos, we create a normal resolver
export const GetTodosResolver = RequestResolver.fromEffect(
  (_: RequestModel.GetTodos) => API.getTodos
)

// we assume we can batch GetUserById, we create a batched resolver
export const GetUserByIdResolver = RequestResolver.makeBatched(
  (requests: RequestModel.GetUserById[]) =>
    Effect.gen(function* () {
      const users = yield* API.getUserByIds(requests.map(({ id }) => id))

      yield* Effect.forEach(requests, (request) =>
        Request.completeEffect(
          request,
          Array.findFirst(users, (user) => user.id === request.id).pipe(
            Effect.succeed
          )
        )
      )
    }).pipe(
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
)

// we assume we can batch SendEmail, we create a batched resolver
export const SendEmailResolver = RequestResolver.makeBatched(
  (requests: RequestModel.SendEmail[]) =>
    Effect.gen(function* () {
      yield* API.sendEmails(
        requests.map(({ address, text }) => ({ address, text }))
      )
      yield* Effect.forEach(requests, (request) =>
        Request.completeEffect(request, Effect.void)
      )
    }).pipe(
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
)
