import { Cause, Effect } from "effect"

const validateName = Effect.succeed(1)
const validateEmail = Effect.fail("Email must not be an empty string").pipe(
  Effect.as(2)
)
const validateBirthday = Effect.fail("Must be at least 16 years of age").pipe(
  Effect.as(3)
)

const program = validateName.pipe(
  Effect.validate(validateEmail),
  Effect.validate(validateBirthday),
  Effect.catchAllCause((cause) => Effect.fail(Cause.failures(cause)))
)

Effect.runPromise(program).then(console.log, console.error)
/* Output:
(FiberFailure) {
  "_id": "Chunk",
  "values": [
    "Email must not be an empty string",
    "Must be at least 16 years of age"
  ]
}
*/
