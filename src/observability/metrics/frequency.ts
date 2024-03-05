/* source: https://effect.website/docs/guides/observability/telemetry/metrics */
import { Metric, Random, Effect } from "effect"

const errorFrequency = Metric.frequency("error_frequency")

const program = Effect.gen(function* () {
  yield* Random.nextIntBetween(1, 10).pipe(
    Effect.map((n) => `Error-${n}`),
    errorFrequency,
    Effect.repeatN(99)
  )

  const frequencyState = yield* Metric.value(errorFrequency)
  console.log("%o", frequencyState)

  return frequencyState
})

Effect.runPromise(program)
/*
Output:
FrequencyState {
  occurrences: Map(9) {
    'Error-7' => 13,
    'Error-9' => 14,
    'Error-1' => 14,
    'Error-2' => 9,
    'Error-8' => 14,
    'Error-3' => 13,
    'Error-5' => 7,
    'Error-4' => 6,
    'Error-6' => 10
  },
  ...
}
*/
