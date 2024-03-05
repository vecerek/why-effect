/* source: https://effect.website/docs/guides/observability/logging */
import { Effect, Config, Logger, Layer } from "effect"

const LogLevelLive = Effect.gen(function* () {
  const level = yield* Config.logLevel("LOG_LEVEL")

  return Logger.minimumLogLevel(level)
}).pipe(Layer.unwrapEffect)

const program = Effect.gen(function* () {
  yield* Effect.logError("ERROR!")
  yield* Effect.logWarning("WARNING!")
  yield* Effect.logInfo("INFO!")
  yield* Effect.logDebug("DEBUG!")
}).pipe(Effect.provide(LogLevelLive))

Effect.runPromise(program)
