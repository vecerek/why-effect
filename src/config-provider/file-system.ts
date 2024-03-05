import {
  Boolean,
  ConfigError,
  ConfigProvider,
  Effect,
  Either,
  HashSet,
  pipe,
  ReadonlyArray,
  String,
} from "effect";
import { flow } from "effect/Function";
import * as fs from "node:fs";
import * as path from "node:path";

type Parse<A> = (content: string) => Either.Either<A, ConfigError.ConfigError>;

const parseConfig = <A>(parse: Parse<A>) =>
  flow(
    String.trim,
    parse,
    Either.match({
      onLeft: Effect.fail,
      onRight: (a) => Effect.succeed([a]),
    })
  );

const readConfig = <A>(filePath: string, parse: Parse<A>) =>
  pipe(
    Effect.sync(() => fs.readFileSync(filePath, "utf-8")),
    Effect.flatMap(parseConfig(parse))
  );

const resolveEnumerableDirs = (pathSegments: readonly string[]) =>
  pipe(
    pathSegments,
    ReadonlyArray.isEmptyReadonlyArray,
    Boolean.match({
      onFalse: () => [path.join(...pathSegments)],
      onTrue: () => [],
    })
  );

export const fromFileSystem = (opts?: { rootPath: string }) => {
  const resolveFilePath = (pathSegments: readonly string[]) =>
    path.join(...[opts?.rootPath ?? "/", ...pathSegments]);

  const pathNotFoundError = (pathSegments: readonly string[]) => {
    return ConfigError.MissingData(
      [...pathSegments],
      `Path ${resolveFilePath(pathSegments)} not found`
    );
  };

  const listFiles = (pathSegments: readonly string[]) => (dir: string) =>
    Effect.try({
      try: () => fs.readdirSync(dir),
      catch: () => pathNotFoundError(pathSegments),
    });

  return pipe(
    ConfigProvider.makeFlat({
      load: (pathSegments, config) => {
        const filePath = resolveFilePath(pathSegments);

        return pipe(
          fs.existsSync(filePath),
          Boolean.match({
            onFalse: () => Effect.fail(pathNotFoundError(pathSegments)),
            onTrue: () => readConfig(filePath, config.parse),
          })
        );
      },
      enumerateChildren: (pathSegments) =>
        pipe(
          pathSegments,
          resolveEnumerableDirs,
          ReadonlyArray.map(listFiles(pathSegments)),
          Effect.all,
          Effect.map(flow(ReadonlyArray.flatten, HashSet.fromIterable))
        ),
      patch: {
        _tag: "Empty" as const,
      },
    }),
    ConfigProvider.fromFlat
  );
};
