import { Config, Console, Effect, Layer } from "effect"

class MyDependency extends Effect.Tag("MyDependency")<
  MyDependency,
  {
    readonly doSomething: () => string
  }
>() {}

const myDependencyLayer = Layer.effect(
  MyDependency,
  Effect.gen(function* () {
    const something = yield* Config.string("SOMETHING")
    return { doSomething: () => something }
  })
)

const program = Effect.gen(function* () {
  const result = yield* MyDependency.doSomething()

  yield* Console.log(result)
}).pipe(Effect.provide(myDependencyLayer))

Effect.runPromise(program).then(console.log, console.error)
