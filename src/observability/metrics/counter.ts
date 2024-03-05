/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Metric, Effect, Console } from "effect"

const taskCount = Metric.counter("task_count").pipe(Metric.withConstantInput(1))
const showMetric = Metric.value(taskCount).pipe(Effect.tap(Console.log))

const program = Effect.gen(function* () {
  const [a, b] = yield* Effect.all([
    Effect.succeed(1).pipe(Effect.delay("100 millis"), taskCount),
    Effect.succeed(2).pipe(Effect.delay("200 millis"), taskCount),
  ])

  yield* showMetric

  return a + b
})

Effect.runPromise(program).then(console.log)
/* Output:
CounterState {
  count: 2,
  ...
}
3
*/
