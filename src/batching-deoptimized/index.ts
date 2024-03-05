/* source: https://effect.website/docs/guides/batching-caching */
import { Effect } from "effect";
import * as API from "./API.js";

const program = Effect.flatMap(
  API.getTodos,
  Effect.forEach((todo) => API.notifyOwner(todo), {
    concurrency: "unbounded",
  })
);

Effect.runPromise(program).then(console.log, console.error);
