const validRuntimeEnvironments = ["development", "staging", "production"]

const program = async () => {
  const env = process.env.RUNTIME_ENVIRONMENT

  if (!env) {
    throw new Error(
      "Expected RUNTIME_ENVIRONMENT to exist in the process context"
    )
  }

  if (!validRuntimeEnvironments.includes(env)) {
    throw new Error(
      `Invalid data at RUNTIME_ENVIRONMENT: "Expected one of (${validRuntimeEnvironments.join(
        ", "
      )}) but received ${env}`
    )
  }

  console.log(`The runtime env is: ${env}`)
}

program().then(console.log, console.error)
/* Output:
Error: Expected RUNTIME_ENVIRONMENT to exist in the process context
*/
