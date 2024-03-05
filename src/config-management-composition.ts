import { Config, Console, Effect, pipe } from "effect"

const runtimeEnvironment = pipe(
  "RUNTIME_ENVIRONMENT",
  Config.literal("development", "staging", "production")
)

const port = Config.number("PORT")

const program = Effect.gen(function* () {
  const config = yield* Config.all({ port, runtimeEnvironment })

  yield* Console.log(
    `The runtime env is: ${config.runtimeEnvironment}\nThe port is: ${config.port}`
  )
})

Effect.runPromise(program).then(console.log, console.error)
/* Output:
(FiberFailure) (Missing data at PORT: "Expected PORT to exist in the process context") and (Missing data at RUNTIME_ENVIRONMENT: "Expected RUNTIME_ENVIRONMENT to exist in the process context")
*/
