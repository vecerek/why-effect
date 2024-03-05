import { Console, Data, Effect, Random } from "effect"

export class GetConnectionError extends Data.TaggedError(
  "GetConnectionError"
)<{}> {}
export class ExecuteConnectionError extends Data.TaggedError(
  "ExecuteConnectionError"
)<{}> {}

export interface Connection {
  readonly execute: Effect.Effect<unknown, ExecuteConnectionError>
  readonly close: Effect.Effect<void>
}

export const acquire = Effect.gen(function* () {
  if ((yield* Random.next) < 0.5) yield* Effect.fail(new GetConnectionError())

  yield* Console.log("Connection acquired")

  return {
    execute: Random.next.pipe(
      Effect.andThen((n) =>
        n > 0.5
          ? Effect.succeed("lorem ipsum")
          : Effect.fail(new ExecuteConnectionError())
      )
    ),
    close: Console.log("Connection closed"),
  }
})

export const release = (conn: Connection) => conn.close
