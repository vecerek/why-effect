/* source: https://effect.website/docs/guides/observability/telemetry/tracing */
import { Effect } from "effect"
import { NodeSdk } from "@effect/opentelemetry"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base"

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}))

const program = Effect.void.pipe(
  Effect.delay("100 millis"),
  Effect.withSpan("myspan", { attributes: { key: "value" } }),
  Effect.provide(NodeSdkLive)
)

Effect.runPromise(program)
/* Output:
{
  resource: {
    attributes: {
      'service.name': 'example',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': '@effect/opentelemetry',
      'telemetry.sdk.version': '1.24.0'
    }
  },
  traceId: 'bede6e63a606a452b4a20158706cccc5',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: 'be88eac331a8f748',
  kind: 0,
  timestamp: 1714929760558000,
  duration: 102286.167,
  attributes: { key: 'value' },
  status: { code: 1 },
  events: [],
  links: []
}
*/
