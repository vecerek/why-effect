import { Config, Context, Effect, Layer, pipe } from "effect";

export class MyDependency extends Context.Tag("MyDependency")<
  MyDependency,
  {
    readonly doSomething: () => string;
  }
>() {}

export const myDependencyLayer = Layer.effect(
  MyDependency,
  pipe(
    Config.string("SOMETHING"),
    Effect.map((something) => ({ doSomething: () => something }))
  )
);

export const program = MyDependency.pipe(
  Effect.map(({ doSomething }) => doSomething())
);
