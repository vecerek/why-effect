/* source: https://effect.website/docs/guides/observability/logging */
import { Effect, pipe } from "effect";

const program = pipe(
  Effect.sleep("1 seconds"),
  Effect.flatMap(() => Effect.log("The job is finished!")),
  Effect.withLogSpan("myspan")
);

Effect.runPromise(program);
/*
Output:
... level=INFO fiber=#0 message="The job is finished!" myspan=1011ms
*/
