/* source: https://effect.website/docs/guides/batching-caching */
import { Effect, Layer, Request } from "effect"
import * as Queries from "./Queries.js"

const program = Effect.gen(function* () {
  const todos = yield* Queries.getTodos

  yield* Effect.forEach(todos, (todo) => Queries.notifyOwner(todo), {
    batching: true,
  })
}).pipe(
  Effect.withRequestCaching(true),
  Effect.provide(
    Layer.setRequestCache(
      Request.makeCache({ capacity: 4, timeToLive: "1 seconds" })
    )
  )
)

Effect.runPromise(program).then(console.log, console.error)
/* Output:
Fetching todos...
Fetching users 1,2,3,4,5...
Fetching users 1,2,3,4,5...
Sending 50 emails
*/
