/* source: https://effect.website/docs/guides/batching-caching */
import { Effect } from "effect"
import * as Queries from "./Queries.js"

const program = Effect.gen(function* () {
  const todos = yield* Queries.getTodos

  yield* Effect.forEach(todos, (todo) => Queries.notifyOwner(todo), {
    batching: true,
  })
})

Effect.runPromise(program).then(console.log, console.error)
/* Output:
Fetching todos...
Fetching users 1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5...
Fetching users 1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5...
Sending 50 emails
*/
