import { Effect, Data } from "effect"

class DivisionByZeroError extends Data.Error<{}> {}

const div = (a: number, b: number) => {
  if (b === 0) {
    return Effect.fail(new DivisionByZeroError())
  }

  return Effect.succeed(a / b)
}

// @ts-expect-error Type 'DivisionByZeroError' is not assignable to type 'never'
const program: Effect.Effect<number, never, never> = div(5, 0)

Effect.runSync(program)
