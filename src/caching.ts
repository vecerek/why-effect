import { Cache, Console, Effect, Random } from "effect"

const program = Effect.gen(function* () {
  const cache = yield* Cache.make({
    capacity: Number.MAX_SAFE_INTEGER,
    timeToLive: Infinity,
    lookup: () => Random.next,
  })

  const result = yield* Effect.all([
    cache.get("key0"),
    cache.get("key1"),
    cache.get("key0"),
    cache.get("key1"),
  ])
  const [a0, b0, a1, b1] = result

  if (a0 === a1 && b0 === b1) {
    yield* Console.log("I'll always end up here....")
  }

  return result
})

Effect.runPromise(program).then(console.log, console.error)
