interface MyDependency {
  readonly doSomething: () => string
}

const createMyDependency = (): MyDependency => {
  const something = process.env.SOMETHING

  if (!something) {
    throw new Error("Expected SOMETHING to exist in the process context")
  }

  return { doSomething: () => something }
}

const program = async (createMyDependency: () => MyDependency) => {
  const result = createMyDependency().doSomething()

  console.log(result)
}

program(createMyDependency).then(console.log, console.error)
