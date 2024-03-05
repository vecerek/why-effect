import { Schema } from "@effect/schema";
import { Config, Console, Effect } from "effect";

const ids = Schema.string.pipe(
  Schema.compose(Schema.split(",")),
  Schema.compose(Schema.nonEmptyArray(Schema.ULID), { strict: false })
);

const program = Config.string("IDX").pipe(
  Effect.flatMap(Schema.decode(ids)),
  Effect.flatMap(
    Effect.forEach((id, index) => Console.log(`Input[${index}]: ${id}`))
  )
);

Effect.runPromise(program).then(console.log, console.error);
