import { ConfigProvider, Effect, Layer, pipe } from "effect"
import assert from "node:assert"
import { describe, it } from "node:test"
import {
  myDependencyLayer,
  MyDependency,
  program,
} from "./dependency-injection.js"

describe("program", () => {
  it("returns whatever the dependency returns", () => {
    const res = pipe(
      program,
      Effect.provideService(MyDependency, {
        doSomething: () => "I've done something",
      }),
      Effect.runSync
    )

    assert.equal(res, "I've done something")
  })

  it("tests the actual dependency implementation", () => {
    const res = pipe(
      program,
      Effect.provide(myDependencyLayer),
      Effect.provide(
        Layer.setConfigProvider(
          ConfigProvider.fromMap(
            new Map([["SOMETHING", "I've actually done something"]])
          )
        )
      ),
      Effect.runSync
    )

    assert.equal(res, "I've actually done something")
  })
})
