/* source: https://effect.website/docs/guides/batching-caching */
import { Effect } from "effect"
import * as Model from "./Model.js"
import * as RequestModel from "./RequestModel.js"
import * as Resolvers from "./Resolvers.js"

export const getTodos = Effect.request(
  RequestModel.GetTodos({}),
  Resolvers.GetTodosResolver
)

export const getUserById = (id: number) =>
  Effect.request(
    RequestModel.GetUserById({ id }),
    Resolvers.GetUserByIdResolver
  )

export const sendEmail = (address: string, text: string) =>
  Effect.request(
    RequestModel.SendEmail({ address, text }),
    Resolvers.SendEmailResolver
  )

export const sendEmailToUser = (id: number, message: string) =>
  Effect.gen(function* () {
    const user = yield* Effect.flatten(getUserById(id))

    yield* sendEmail(user.email, message)
  })

export const notifyOwner = (todo: Model.Todo) =>
  Effect.gen(function* () {
    const user = yield* Effect.flatten(getUserById(todo.ownerId))

    yield* sendEmailToUser(
      user.id,
      `hey ${user.name} you got a todo: ${todo.message}`
    )
  })
