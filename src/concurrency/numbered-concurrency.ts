import { Console, Duration, Effect } from "effect"

const task = Effect.delay("400 millis")(Effect.succeed(42))

const program = Effect.gen(function* () {
  const [duration, result] = yield* Effect.all([task, task, task, task], {
    concurrency: 2,
  }).pipe(Effect.timed)

  yield* Console.log(`Took: ${Duration.toMillis(duration)}ms`)

  return result
})

Effect.runPromise(program).then(console.log, console.error)
/* Output:
Took: 809.230625ms
[ 42, 42, 42, 42 ]
*/
