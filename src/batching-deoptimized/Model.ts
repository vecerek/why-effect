/* source: https://effect.website/docs/guides/batching-caching */
import { Schema } from "@effect/schema"
import { Data } from "effect"

const BaseUser = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  email: Schema.String,
})
export const User = Schema.transform(
  BaseUser,
  Schema.Struct({
    _tag: Schema.Literal("User"),
    ...BaseUser.fields,
  }),
  {
    decode: (user) => ({ ...user, _tag: "User" as const }),
    encode: ({ _tag, ...user }) => user,
  }
)

export interface User extends Schema.Schema.Type<typeof User> {}
export class GetUserError extends Data.TaggedError("GetUserError") {}

const BaseTodo = Schema.Struct({
  id: Schema.Number,
  message: Schema.String,
  ownerId: Schema.Number,
})
export const Todo = Schema.transform(
  BaseTodo,
  Schema.Struct({
    _tag: Schema.Literal("Todo"),
    ...BaseTodo.fields,
  }),
  {
    decode: (todo) => ({ ...todo, _tag: "Todo" as const }),
    encode: ({ _tag, ...user }) => user,
  }
)
export interface Todo extends Schema.Schema.Type<typeof Todo> {}

export class GetTodosError extends Data.TaggedError("GetTodosError") {}
export class SendEmailError extends Data.TaggedError("SendEmailError") {}
