import { Scope, Effect, Console, Exit } from "effect";

const program = Scope.make().pipe(
  Effect.tap((scope) => Scope.addFinalizer(scope, Console.log("finalizer 1"))),
  Effect.tap((scope) => Scope.addFinalizer(scope, Console.log("finalizer 2"))),
  Effect.flatMap((scope) =>
    Scope.close(scope, Exit.succeed("scope closed successfully"))
  )
);

Effect.runPromise(program);
/*
Output:
finalizer 2 <-- finalizers are closed in reverse order
finalizer 1
*/
