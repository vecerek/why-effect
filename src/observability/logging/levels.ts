/* source: https://effect.website/docs/guides/observability/logging */
import { Effect, pipe } from "effect";

const program = pipe(
  Effect.logInfo("start"),
  Effect.flatMap(() => Effect.sleep("2 seconds")),
  Effect.flatMap(() => Effect.logDebug("in between")),
  Effect.flatMap(() => Effect.sleep("1 seconds")),
  Effect.flatMap(() => Effect.logInfo("done"))
);

Effect.runPromise(program);
/*
Output:
... level=INFO message=start
... level=INFO message=done <-- 3 seconds later
*/
