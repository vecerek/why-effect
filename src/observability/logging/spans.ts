/* source: https://effect.website/docs/guides/observability/logging */
import { Effect } from "effect"

const program = Effect.gen(function* () {
  yield* Effect.sleep("1 seconds")
  yield* Effect.log("The job is finished!")
}).pipe(Effect.withLogSpan("myspan"))

Effect.runPromise(program)
/*
Output:
... level=INFO fiber=#0 message="The job is finished!" myspan=1005ms
*/
