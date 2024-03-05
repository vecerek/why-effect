import { Effect, Console, pipe } from "effect";
import { acquire, Connection, release } from "./resource.js";

const use = (conn: Connection) =>
  pipe(
    conn.execute(),
    Effect.flatMap((res) => Console.log(`Result is ${res}`))
  );

const program = Effect.acquireUseRelease(acquire(), use, release);

Effect.runPromise(program);
