import { PlatformConfigProvider } from "@effect/platform"
import { NodeContext } from "@effect/platform-node"
import { Config, Console, Effect } from "effect"

const loadConfig = Effect.gen(function* () {
  const secret = yield* Config.secret("MY_SECRET").pipe(
    Config.nested("secrets")
  )

  yield* Console.log(`The secret is not leaked: ${secret}`)
})

const program = loadConfig.pipe(
  Effect.provide(
    PlatformConfigProvider.layerFileTreeAdd({
      rootDirectory: `${import.meta.dirname}/fixtures`,
    })
  ),
  Effect.provide(NodeContext.layer)
)

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
The secret is not leaked: Secret(<redacted>)
*/
