import { Console, Data, Effect, pipe } from "effect";

export class GetConnectionError extends Data.Error<{}> {}
export class ExecuteConnectionError extends Data.Error<{}> {}

export interface Connection {
  readonly execute: () => Effect.Effect<unknown, ExecuteConnectionError>;
  readonly close: () => Effect.Effect<void>;
}

export const acquire = () => {
  if (Math.random() < 0.5) return Effect.fail(new GetConnectionError());

  return pipe(
    Console.log("Connection acquired"),
    Effect.map(() => ({
      execute: () => Effect.succeed("lorem ipsum"),
      close: () => Console.log("Connection released"),
    }))
  );
};

export const release = (conn: Connection) => conn.close();
