/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Metric, Effect, Random, Console } from "effect"

const temperature = Metric.gauge("temperature")
const showMetric = Metric.value(temperature).pipe(Effect.flatMap(Console.log))

const getTemperature = Random.nextIntBetween(-10, 10).pipe(
  Effect.tap((n) => Console.log(`variation: ${n}`))
)

const program = Effect.gen(function* () {
  const series: Array<number> = []
  series.push(yield* temperature(getTemperature))
  series.push(yield* temperature(getTemperature))
  series.push(yield* temperature(getTemperature))
  yield* showMetric

  return series
})

Effect.runPromise(program).then(console.log)
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
