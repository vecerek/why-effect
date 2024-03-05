import { Scope, Effect, Console, Exit } from "effect"

const program = Effect.gen(function* () {
  const scope = yield* Scope.make()
  yield* Scope.addFinalizer(scope, Console.log("finalizer 1"))
  yield* Scope.addFinalizer(scope, Console.log("finalizer 2"))
  yield* Scope.close(scope, Exit.void)
})

Effect.runPromise(program)
/*
Output:
finalizer 2 <-- finalizers are closed in reverse order
finalizer 1
*/
