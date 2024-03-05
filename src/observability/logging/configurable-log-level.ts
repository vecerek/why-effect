/* source: https://effect.website/docs/guides/observability/logging */
import { Effect, Config, Logger, Layer } from "effect";

const LogLevelLive = Config.logLevel("LOG_LEVEL").pipe(
  Effect.map((level) => Logger.minimumLogLevel(level)),
  Layer.unwrapEffect
);

const program = Effect.logError("ERROR!").pipe(
  Effect.flatMap(() => Effect.logWarning("WARNING!")),
  Effect.flatMap(() => Effect.logInfo("INFO!")),
  Effect.flatMap(() => Effect.logDebug("DEBUG!")),
  Effect.provide(LogLevelLive)
);

Effect.runPromise(program);
