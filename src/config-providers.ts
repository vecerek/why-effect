import { Config, ConfigProvider, Console, Effect, Layer, pipe } from "effect";
import { fromFileSystem } from "./config-provider/file-system.js";

const program = pipe(
  "RUNTIME_ENVIRONMENT",
  Config.literal("development", "staging", "production"),
  Effect.flatMap((env) => Console.log(`The runtime env is: ${env}`)),
  Effect.provide(
    Layer.setConfigProvider(
      pipe(
        ConfigProvider.fromEnv(),
        ConfigProvider.orElse(() =>
          fromFileSystem({ rootPath: "/Users/avecerek" })
        )
      )
    )
  )
);

Effect.runPromise(program).then(console.log, console.error);
