/* source: https://effect.website/docs/guides/observability/telemetry/tracing */
import { Effect, pipe } from "effect"
import { NodeSdk } from "@effect/opentelemetry"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base"

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}))

const program = pipe(
  Effect.void,
  Effect.delay("100 millis"),
  Effect.withSpan("myspan"),
  Effect.provide(NodeSdkLive)
)

Effect.runPromise(program)
/* Output:
{
  traceId: '9f48a4b051003ce76419c154c97947f8',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: '7aeaee6bbddd2662',
  kind: 0,
  timestamp: 1709718587910611,
  duration: 101270.708,
  attributes: {},
  status: { code: 1 },
  events: [],
  links: []
}
*/
