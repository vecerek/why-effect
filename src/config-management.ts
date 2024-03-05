import { Config, Console, Effect } from "effect"

const program = Effect.gen(function* () {
  const env = yield* Config.literal(
    "development",
    "staging",
    "production"
  )("RUNTIME_ENVIRONMENT")

  yield* Console.log(`The runtime env is: ${env}`)
})

Effect.runPromise(program).then(console.log, console.error)
/* Output:
(FiberFailure) (Missing data at RUNTIME_ENVIRONMENT: "Expected RUNTIME_ENVIRONMENT to exist in the process context")
*/
