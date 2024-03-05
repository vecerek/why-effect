/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Effect, Metric, MetricBoundaries, Random } from "effect"

const latencyHistogram = Metric.histogram(
  "request_latency",
  MetricBoundaries.linear({ start: 0, width: 10, count: 11 })
)

const program = Effect.gen(function* () {
  yield* Random.nextIntBetween(1, 120).pipe(
    latencyHistogram,
    Effect.repeatN(99)
  )

  const histogramState = yield* Metric.value(latencyHistogram)
  console.log("%o", histogramState)

  return histogramState
})

Effect.runPromise(program)
/*
Output:
HistogramState {
  buckets: [
    [ 0, 0, [length]: 2 ],
    [ 10, 4, [length]: 2 ],
    [ 20, 8, [length]: 2 ],
    [ 30, 13, [length]: 2 ],
    [ 40, 24, [length]: 2 ],
    [ 50, 36, [length]: 2 ],
    [ 60, 45, [length]: 2 ],
    [ 70, 54, [length]: 2 ],
    [ 80, 61, [length]: 2 ],
    [ 90, 69, [length]: 2 ],
    [ Infinity, 100, [length]: 2 ],
    [length]: 11
  ],
  count: 100,
  min: 1,
  max: 119,
  sum: 6628,
  ...
}
*/
