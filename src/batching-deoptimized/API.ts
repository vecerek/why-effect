/* source: https://effect.website/docs/guides/batching-caching */
import { ParseError } from "@effect/schema/ParseResult";
import { Schema } from "@effect/schema";
import { Console, Effect, Option, pipe, ReadonlyArray } from "effect";
import * as fs from "node:fs";
import { fileURLToPath } from "url";
import * as path from "node:path";
import * as Model from "./Model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getTodos = Console.log("Fetching todos...").pipe(
  Effect.flatMap(() =>
    Effect.async<readonly Model.Todo[], ParseError | Model.GetTodosError>(
      (resume) => {
        const db = path.join(__dirname, "db", "todos.json");

        fs.readFile(db, { encoding: "utf8" }, (err, data) => {
          if (err) {
            resume(Effect.fail(new Model.GetTodosError()));
          } else {
            const schema = Schema.parseJson(Schema.array(Model.Todo));
            const parse = Schema.decodeUnknown(schema);

            resume(parse(data));
          }
        });
      }
    )
  )
);

export const getUserById = (id: number) =>
  Console.log(`Fetching user ${id}...`).pipe(
    Effect.flatMap(() =>
      Effect.async<Option.Option<Model.User>, ParseError | Model.GetUserError>(
        (resume) => {
          const db = path.join(__dirname, "db", "users.json");

          fs.readFile(db, { encoding: "utf8" }, (err, data) => {
            if (err) {
              resume(Effect.fail(new Model.GetUserError()));
            } else {
              const schema = Schema.parseJson(Schema.array(Model.User));

              const findUser = pipe(
                data,
                Schema.decodeUnknown(schema),
                Effect.map(ReadonlyArray.findFirst((user) => user.id === id))
              );

              resume(findUser);
            }
          });
        }
      )
    )
  );

export const sendEmail = (address: string, text: string) =>
  Console.log(`Sending email to: ${address}`).pipe(
    Effect.flatMap(() =>
      Effect.async<void, Model.SendEmailError>((resume) => {
        const db = path.join(__dirname, "db", "emails.csv");
        const data = `${address},${text}\n`;

        fs.writeFile(db, data, { flag: "a" }, (err) => {
          if (err) {
            resume(Effect.fail(new Model.SendEmailError()));
          }
        });
      })
    )
  );

export const sendEmailToUser = (id: number, message: string) =>
  getUserById(id).pipe(
    Effect.flatten,
    Effect.flatMap((user) => sendEmail(user.email, message))
  );

export const notifyOwner = (todo: Model.Todo) =>
  getUserById(todo.ownerId).pipe(
    Effect.flatten,
    Effect.flatMap((user) =>
      sendEmailToUser(user.id, `hey ${user.name} you got a todo!`)
    )
  );
