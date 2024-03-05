/* source: https://effect.website/docs/guides/observability/logging */
import { Effect } from "effect"

const program = Effect.log("Application started")

Effect.runSync(program)
/* Output:
timestamp=2024-03-06T08:31:35.819Z level=INFO fiber=#0 message="Application started"
 */
