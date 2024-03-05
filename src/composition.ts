import { Effect, Data, Layer } from "effect"

class ErrorA extends Data.TaggedError("ErrorA") {}
class A extends Effect.Tag("A")<A, { a: Effect.Effect<number, ErrorA> }>() {
  static live = Layer.succeed(this, { a: Effect.succeed(42) })
}

class ErrorB extends Data.TaggedError("ErrorB") {}
class B extends Effect.Tag("B")<
  B,
  { b: (_: number) => Effect.Effect<string, ErrorB> }
>() {
  static live = Layer.succeed(this, { b: (n) => Effect.succeed(String(n)) })
}

// Effect.Effect<string, ErrorA | ErrorB, A | B>
const program = Effect.gen(function* () {
  const a = yield* A.a
  const b = yield* B.b(a)

  return b
})

Effect.runSync(
  program.pipe(
    Effect.provide(A.live),
    // Effect.Effect<string, ErrorA | ErrorB, B>
    Effect.provide(B.live)
    // Effect.Effect<string, ErrorA | ErrorB, never>
  )
)
