/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Metric, Random, Effect } from "effect"

const responseTimeSummary = Metric.summary({
  name: "response_time_summary",
  maxAge: "1 days",
  maxSize: 100,
  error: 0.03,
  quantiles: [0.1, 0.5, 0.9],
})

const program = Effect.gen(function* () {
  yield* Random.nextIntBetween(1, 120).pipe(
    responseTimeSummary,
    Effect.repeatN(99)
  )

  const summaryState = yield* Metric.value(responseTimeSummary)
  console.log("%o", summaryState)

  return summaryState
})

Effect.runPromise(program)
/*
Output:
SummaryState {
  error: 0.03,
  quantiles: [
    [ 0.1, { _id: 'Option', _tag: 'Some', value: 6 }, [length]: 2 ],
    [ 0.5, { _id: 'Option', _tag: 'Some', value: 65 }, [length]: 2 ],
    [ 0.9, { _id: 'Option', _tag: 'Some', value: 108 }, [length]: 2 ],
    [length]: 3
  ],
  count: 100,
  min: 2,
  max: 117,
  sum: 6159,
  ...
}
*/
