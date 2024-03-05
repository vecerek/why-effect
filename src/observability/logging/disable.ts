/* source: https://effect.website/docs/guides/observability/logging */
import { Effect, Logger, LogLevel, pipe } from "effect";

const program = pipe(
  Effect.log("Executing task..."),
  Effect.flatMap(() => Effect.sleep("100 millis")),
  Effect.flatMap(() => Effect.log("task done")),
  Logger.withMinimumLogLevel(LogLevel.None)
);

Effect.runPromise(program);
/*
Output:
*/
