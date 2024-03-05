/* source: https://effect.website/docs/guides/observability/telemetry/tracing */
import { Effect, pipe } from "effect";
import { NodeSdk } from "@effect/opentelemetry";
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}));

const program = pipe(
  Effect.unit,
  Effect.delay("100 millis"),
  Effect.tap(() => Effect.annotateCurrentSpan("key", "value")),
  Effect.withSpan("myspan"),
  Effect.provide(NodeSdkLive)
);

Effect.runPromise(program);
/* Output:
{
  traceId: '6f6bcdfa0662f1d0e91f83000fb85bc1',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: '137db1bd81403b60',
  kind: 0,
  timestamp: 1709718796762339,
  duration: 101759.458,
  attributes: { key: 'value' },
  status: { code: 1 },
  events: [],
  links: []
}
*/
