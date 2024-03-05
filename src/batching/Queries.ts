/* source: https://effect.website/docs/guides/batching-caching */
import { Effect } from "effect";
import * as Model from "./Model.js";
import * as RequestModel from "./RequestModel.js";
import * as Resolvers from "./Resolvers.js";

export const getTodos = Effect.request(
  RequestModel.GetTodos({}),
  Resolvers.GetTodosResolver
);

export const getUserById = (id: number) =>
  Effect.request(
    RequestModel.GetUserById({ id }),
    Resolvers.GetUserByIdResolver
  );

export const sendEmail = (address: string, text: string) =>
  Effect.request(
    RequestModel.SendEmail({ address, text }),
    Resolvers.SendEmailResolver
  );

export const sendEmailToUser = (id: number, message: string) =>
  getUserById(id).pipe(
    Effect.flatten,
    Effect.flatMap((user) => sendEmail(user.email, message))
  );

export const notifyOwner = (todo: Model.Todo) =>
  getUserById(todo.ownerId).pipe(
    Effect.flatten,
    Effect.flatMap((user) =>
      sendEmailToUser(
        user.id,
        `hey ${user.name} you got a todo: ${todo.message}`
      )
    )
  );
