/* source: https://effect.website/docs/guides/observability/logging */
import { Effect } from "effect"

const program = Effect.gen(function* () {
  yield* Effect.logInfo("start")
  yield* Effect.sleep("2 seconds")
  yield* Effect.logDebug("in between")
  yield* Effect.sleep("1 seconds")
  yield* Effect.logInfo("done")
})

Effect.runPromise(program)
/*
Output:
... level=INFO message=start
... level=INFO message=done <-- 3 seconds later
*/
