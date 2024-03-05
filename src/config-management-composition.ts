import { Config, Console, Effect, pipe } from "effect";

const runtimeEnvironment = pipe(
  "RUNTIME_ENVIRONMENT",
  Config.literal("development", "staging", "production")
);

const port = Config.number("PORT");

const program = pipe(
  { port, runtimeEnvironment },
  Config.all,
  Effect.flatMap((config) =>
    Console.log(
      `The runtime env is: ${config.runtimeEnvironment},\nThe port is: ${config.port}`
    )
  )
);

Effect.runPromise(program).then(console.log, console.error);
