import { Config, Console, Context, Effect, Layer, pipe } from "effect";

class MyDependency extends Context.Tag("MyDependency")<
  MyDependency,
  {
    readonly doSomething: () => string;
  }
>() {}

const myDependencyLayer = Layer.effect(
  MyDependency,
  pipe(
    Config.string("SOMETHING"),
    Effect.map((something) => ({ doSomething: () => something }))
  )
);

const program = MyDependency.pipe(
  Effect.map(({ doSomething }) => doSomething()),
  Effect.flatMap(Console.log),
  Effect.provide(myDependencyLayer)
);

Effect.runPromise(program).then(console.log, console.error);
