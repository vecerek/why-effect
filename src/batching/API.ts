/* source: https://effect.website/docs/guides/batching-caching */
import { FileSystem, Path } from "@effect/platform"
import { Schema } from "@effect/schema"
import { Array, Console, Effect } from "effect"
import * as Model from "./Model.js"
import { NodeContext } from "@effect/platform-node"

const __dirname = import.meta.dirname

const todosSchema = Schema.parseJson(Schema.Array(Model.Todo))
const parseTodos = Schema.decodeUnknown(todosSchema)

export const getTodos = Effect.gen(function* () {
  yield* Console.log("Fetching todos...")

  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path

  const db = path.join(__dirname, "db", "todos.json")
  const data = yield* fs
    .readFileString(db, "utf8")
    .pipe(Effect.mapError(() => new Model.GetTodosError()))

  return yield* parseTodos(data)
}).pipe(Effect.provide(NodeContext.layer))

const usersSchema = Schema.parseJson(Schema.Array(Model.User))
const parseUsers = Schema.decodeUnknown(usersSchema)

export const getUserByIds = (ids: number[]) =>
  Effect.gen(function* () {
    yield* Console.log(`Fetching users ${ids.join(",")}...`)

    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const db = path.join(__dirname, "db", "users.json")
    const data = yield* fs
      .readFileString(db, "utf8")
      .pipe(Effect.mapError(() => new Model.GetUserError()))

    const users = yield* parseUsers(data)

    return Array.filter(users, (user) => ids.includes(user.id))
  }).pipe(Effect.provide(NodeContext.layer))

export const sendEmails = (emails: { address: string text: string }[]) =>
  Effect.gen(function* () {
    yield* Console.log(`Sending ${emails.length} emails`)

    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const db = path.join(__dirname, "db", "emails.csv")
    const data = emails
      .map(({ address, text }) => `${address},${text}`)
      .join("\n")

    yield* fs
      .writeFileString(db, data, { flag: "a" })
      .pipe(Effect.mapError(() => new Model.SendEmailError()))
  }).pipe(Effect.provide(NodeContext.layer))
