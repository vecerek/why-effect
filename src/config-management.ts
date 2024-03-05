import { Config, Console, Effect, pipe } from "effect";

const program = pipe(
  "RUNTIME_ENVIRONMENT",
  Config.literal("development", "staging", "production"),
  Effect.flatMap((env) => Console.log(`The runtime env is: ${env}`))
);

Effect.runPromise(program).then(console.log, console.error);
/* Output:
{
  _id: 'FiberFailure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: {
      _tag: 'MissingData',
      path: [Array],
      message: 'Expected RUNTIME_ENVIRONMENT to exist in the process context'
    }
  }
}
*/
