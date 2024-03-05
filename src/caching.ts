import { Cache, Effect, pipe, Random } from "effect";

const program = pipe(
  Cache.make({
    capacity: Number.MAX_SAFE_INTEGER,
    timeToLive: Infinity,
    lookup: () => Random.next,
  }),
  Effect.flatMap((cache) =>
    Effect.all([
      cache.get("key0"),
      cache.get("key1"),
      cache.get("key0"),
      cache.get("key1"),
    ])
  ),
  Effect.tap(([a0, b0, a1, b1]) => {
    if (a0 === a1 && b0 === b1) {
      console.log("I'll always end up here....");
    }
  })
);

Effect.runPromise(program).then(console.log, console.error);
