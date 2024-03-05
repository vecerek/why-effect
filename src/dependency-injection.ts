import { Config, Effect, Layer } from "effect"
import { constant } from "effect/Function"

export class MyDependency extends Effect.Tag("MyDependency")<
  MyDependency,
  {
    readonly doSomething: () => string
  }
>() {}

export const myDependencyLayer = Layer.effect(
  MyDependency,
  Effect.gen(function* () {
    const something = yield* Config.string("SOMETHING")

    return { doSomething: constant(something) }
  })
)

export const program = MyDependency.doSomething()
