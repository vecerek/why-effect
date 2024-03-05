/* source: https://effect.website/docs/guides/observability/logging */
import { Effect, Logger, LogLevel } from "effect"

const program = Effect.gen(function* () {
  yield* Effect.log("Executing task...")
  yield* Effect.sleep("100 millis")
  yield* Effect.log("task done")
}).pipe(Logger.withMinimumLogLevel(LogLevel.None))

Effect.runPromise(program)
/*
Output:
*/
