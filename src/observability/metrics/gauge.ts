/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Metric, Effect, Random, Console, pipe } from "effect";

const temperature = Metric.gauge("temperature");
const showMetric = Metric.value(temperature).pipe(Effect.flatMap(Console.log));

const getTemperature = pipe(
  Random.nextIntBetween(-10, 10),
  Effect.tap((n) => Console.log(`variation: ${n}`))
);

const program = Effect.gen(function* (_) {
  const series: Array<number> = [];
  series.push(yield* _(temperature(getTemperature)));
  series.push(yield* _(temperature(getTemperature)));
  series.push(yield* _(temperature(getTemperature)));
  yield* _(showMetric);

  return series;
});

Effect.runPromise(program).then(console.log);
/* Output:
variation: -1
variation: 4
variation: 7
GaugeState {
  value: 7,
  ...
}
[ -1, 4, 7 ]
*/
