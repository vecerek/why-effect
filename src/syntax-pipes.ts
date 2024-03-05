import { Data, Effect, Random, pipe } from "effect"

class FooError extends Data.TaggedError("FooError")<{}> {}
class BarError extends Data.TaggedError("BarError")<{}> {}

const flakyFoo = pipe(
  Random.next,
  Effect.flatMap((n1) =>
    n1 > 0.5 ? Effect.succeed("yay!") : Effect.fail(new FooError())
  )
)

const flakyBar = pipe(
  Random.next,
  Effect.flatMap((n2) =>
    n2 > 0.5 ? Effect.succeed("yay!") : Effect.fail(new BarError())
  )
)

export const program = pipe(
  Effect.all([flakyFoo, flakyBar]),
  Effect.map(([foo, bar]) => foo + bar)
)

Effect.runPromise(program).then(console.log, console.error)
