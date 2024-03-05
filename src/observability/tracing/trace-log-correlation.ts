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
  Effect.log("Hello"),
  Effect.delay("100 millis"),
  Effect.tap(() => Effect.annotateCurrentSpan("key", "value")),
  Effect.withSpan("myspan"),
  Effect.provide(NodeSdkLive)
)

Effect.runPromise(program)
/* Output:
{
  traceId: 'a512639a4da8644fc4924a589487e03b',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: 'a749f6d6cf2d2630',
  kind: 0,
  timestamp: 1709719024275346.5,
  duration: 104595.75,
  attributes: { key: 'value' },
  status: { code: 1 },
  events: [
    {
      name: 'Hello',
      attributes: { 'effect.fiberId': '#0', 'effect.logLevel': 'INFO' },
      time: [ 1709719024, 379354420 ],
      droppedAttributesCount: 0
    }
  ],
  links: []
}
*/
