import { Console, Duration, Effect, pipe } from "effect";

const task = Effect.delay("400 millis")(Effect.succeed(42));

const program = pipe(
  Effect.all([task, task, task, task], { concurrency: 2 }),
  Effect.timed,
  Effect.tap(([duration]) =>
    Console.log(`Took: ${Duration.toMillis(duration)}ms`)
  ),
  Effect.map(([_, res]) => res)
);

Effect.runPromise(program).then(console.log, console.error);
/* Output:
Took: 811.551875ms
[ 42, 42, 42, 42 ]
*/
