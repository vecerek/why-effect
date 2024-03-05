/* source: https://effect.website/docs/guides/batching-caching */
import { ParseError } from "@effect/schema/ParseResult";
import { Schema } from "@effect/schema";
import { Console, Effect, pipe, ReadonlyArray } from "effect";
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

export const getUserByIds = (ids: number[]) =>
  Console.log(`Fetching users ${ids.join(",")}...`).pipe(
    Effect.flatMap(() =>
      Effect.async<Model.User[], ParseError | Model.GetUserError>((resume) => {
        const db = path.join(__dirname, "db", "users.json");

        fs.readFile(db, { encoding: "utf8" }, (err, data) => {
          if (err) {
            resume(Effect.fail(new Model.GetUserError()));
          } else {
            const schema = Schema.parseJson(Schema.array(Model.User));

            const findUsers = pipe(
              data,
              Schema.decodeUnknown(schema),
              Effect.map(ReadonlyArray.filter((user) => ids.includes(user.id)))
            );

            resume(findUsers);
          }
        });
      })
    )
  );

export const sendEmails = (emails: { address: string; text: string }[]) =>
  Console.log(`Sending ${emails.length} emails`).pipe(
    Effect.flatMap(() =>
      Effect.async<void, Model.SendEmailError>((resume) => {
        const db = path.join(__dirname, "db", "emails.csv");
        const data = emails
          .map(({ address, text }) => `${address},${text}`)
          .join("\n");

        fs.writeFile(db, data, { flag: "a" }, (err) => {
          if (err) {
            resume(Effect.fail(new Model.SendEmailError()));
          } else {
            resume(Effect.unit);
          }
        });
      })
    )
  );
