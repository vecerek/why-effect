/* source: https://effect.website/docs/guides/batching-caching */
import { Effect } from "effect"
import * as API from "./API.js"

const program = Effect.gen(function* () {
  const todos = yield* API.getTodos

  yield* Effect.forEach(todos, (todo) => API.notifyOwner(todo), {
    concurrency: "unbounded",
  })
})

Effect.runPromise(program).then(console.log, console.error)
