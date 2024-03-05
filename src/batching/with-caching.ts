/* source: https://effect.website/docs/guides/batching-caching */
import { Effect, pipe } from "effect";
import * as Queries from "./Queries.js";

const program = pipe(
  Effect.flatMap(
    Queries.getTodos,
    Effect.forEach((todo) => Queries.notifyOwner(todo), {
      batching: true,
    })
  ),
  Effect.withRequestCaching(true)
);

Effect.runPromise(program).then(console.log, console.error);
/* Output:
Fetching todos...
Fetching users 1,2,3,4,5...
Sending 50 emails
*/
