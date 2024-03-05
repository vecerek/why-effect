/* source: https://effect.website/docs/guides/batching-caching */
import { ParseError } from "@effect/schema/ParseResult"
import { Option, Request } from "effect"
import * as Model from "./Model.js"

export interface GetTodos
  extends Request.Request<
    readonly Model.Todo[],
    ParseError | Model.GetTodosError
  > {
  readonly _tag: "GetTodos"
}

export const GetTodos = Request.tagged<GetTodos>("GetTodos")

export interface GetUserById
  extends Request.Request<
    Option.Option<Model.User>,
    ParseError | Model.GetUserError
  > {
  readonly _tag: "GetUserById"
  readonly id: number
}

export const GetUserById = Request.tagged<GetUserById>("GetUserById")

export interface SendEmail extends Request.Request<void, Model.SendEmailError> {
  readonly _tag: "SendEmail"
  readonly address: string
  readonly text: string
}

export const SendEmail = Request.tagged<SendEmail>("SendEmail")

export type ApiRequest = GetTodos | GetUserById | SendEmail
