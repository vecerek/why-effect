import { Schema } from "@effect/schema"
import { Config, Console, Effect } from "effect"

const ids = Schema.String.pipe(
  Schema.compose(Schema.split(",")),
  Schema.compose(Schema.NonEmptyArray(Schema.ULID), { strict: false })
)
const parseIds = Schema.decode(ids, { errors: "all" })

const program = Effect.gen(function* () {
  const rawIds = yield* Config.string("IDX")
  const parsedIds = yield* parseIds(rawIds)

  yield* Effect.forEach(parsedIds, (id, index) =>
    Console.log(`Input[${index}]: ${id}`)
  )
})

Effect.runPromise(program).then(console.log, console.error)
