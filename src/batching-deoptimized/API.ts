/* source: https://effect.website/docs/guides/batching-caching */
import { ParseError } from "@effect/schema/ParseResult"
import { Schema } from "@effect/schema"
import { Array, Console, Effect, Option, pipe } from "effect"
import * as fs from "node:fs"
import { fileURLToPath } from "url"
import * as path from "node:path"
import * as Model from "./Model.js"
import { FileSystem, Path } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const todosSchema = Schema.parseJson(Schema.Array(Model.Todo))
const parseTodos = Schema.decodeUnknown(todosSchema)

export const getTodos = Effect.gen(function* () {
  yield* Console.log("Fetching todos...")

  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path

  const db = path.join(import.meta.dirname, "db", "todos.json")
  const data = yield* fs
    .readFileString(db, "utf8")
    .pipe(Effect.mapError(() => new Model.GetTodosError()))

  return yield* parseTodos(data)
}).pipe(Effect.provide(NodeContext.layer))

const usersSchema = Schema.parseJson(Schema.Array(Model.User))
const parseUsers = Schema.decodeUnknown(usersSchema)

export const getUserById = (id: number) =>
  Effect.gen(function* () {
    yield* Console.log(`Fetching user ${id}...`)

    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const db = path.join(import.meta.dirname, "db", "users.json")
    const data = yield* fs
      .readFileString(db, "utf8")
      .pipe(Effect.mapError(() => new Model.GetUserError()))
    const users = yield* parseUsers(data)

    return Array.findFirst(users, (user) => user.id === id)
  }).pipe(Effect.provide(NodeContext.layer))

export const sendEmail = (address: string, text: string) =>
  Effect.gen(function* () {
    yield* Console.log(`Sending email to: ${address}`)

    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path

    const db = path.join(import.meta.dirname, "db", "emails.csv")
    const data = `${address},${text}\n`

    yield* fs
      .writeFileString(db, data, { flag: "a" })
      .pipe(Effect.mapError(() => new Model.SendEmailError()))
  }).pipe(Effect.provide(NodeContext.layer))

export const sendEmailToUser = (id: number, message: string) =>
  Effect.gen(function* () {
    const user = yield* Effect.flatten(getUserById(id))

    yield* sendEmail(user.email, message)
  })

export const notifyOwner = (todo: Model.Todo) =>
  Effect.gen(function* () {
    const user = yield* Effect.flatten(getUserById(todo.ownerId))

    yield* sendEmailToUser(user.id, `hey ${user.name} you got a todo!`)
  })
