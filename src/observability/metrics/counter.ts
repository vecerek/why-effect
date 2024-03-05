/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Metric, Effect, Console, pipe } from "effect";

const taskCount = pipe(
  Metric.counter("task_count"),
  Metric.withConstantInput(1)
);
const showMetric = pipe(Metric.value(taskCount), Effect.flatMap(Console.log));

const program = pipe(
  Effect.all([
    Effect.succeed(1).pipe(Effect.delay("100 millis"), taskCount),
    Effect.succeed(2).pipe(Effect.delay("200 millis"), taskCount),
  ]),
  Effect.map(([a, b]) => a + b),
  Effect.tap(() => showMetric)
);

Effect.runPromise(program).then(console.log);
/* Output:
CounterState {
  count: 2,
  ...
}
3
*/
