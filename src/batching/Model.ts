/* source: https://effect.website/docs/guides/batching-caching */
import { Schema } from "@effect/schema";
import { Data } from "effect";

const BaseUser = Schema.struct({
  id: Schema.number,
  name: Schema.string,
  email: Schema.string,
});
export const User = BaseUser.pipe(
  Schema.transform(
    BaseUser.pipe(
      Schema.extend(Schema.struct({ _tag: Schema.literal("User") }))
    ),
    (user) => ({ ...user, _tag: "User" as const }),
    ({ _tag, ...user }) => user
  )
);

export interface User extends Schema.Schema.To<typeof User> {}
export class GetUserError extends Data.TaggedError("GetUserError") {}

const BaseTodo = Schema.struct({
  id: Schema.number,
  message: Schema.string,
  ownerId: Schema.number,
});
export const Todo = BaseTodo.pipe(
  Schema.transform(
    BaseTodo.pipe(
      Schema.extend(Schema.struct({ _tag: Schema.literal("Todo") }))
    ),
    (todo) => ({ ...todo, _tag: "Todo" as const }),
    ({ _tag, ...user }) => user
  )
);
export interface Todo extends Schema.Schema.To<typeof Todo> {}

export class GetTodosError extends Data.TaggedError("GetTodosError") {}
export class SendEmailError extends Data.TaggedError("SendEmailError") {}
