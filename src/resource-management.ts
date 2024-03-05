import { Effect, Console } from "effect"
import { acquire, Connection, release } from "./resource.js"

const use = (conn: Connection) =>
  Effect.gen(function* () {
    const res = yield* conn.execute
    yield* Console.log(`Result is ${res}`)
    return res
  })

const program = Effect.acquireUseRelease(acquire, use, release)

Effect.runPromise(program)
