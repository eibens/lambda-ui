/** MAIN **/

export type Path = (string | number)[];

export class PathNotFoundError extends Error {
  readonly path: Path;
  readonly pathIndex: number;

  constructor(path: Path, pathIndex: number) {
    const absolutePath = path.slice(0, pathIndex + 1);
    const relativePath = path.slice(pathIndex + 1);

    super(
      `Could not find path ${JSON.stringify(relativePath)} in ${
        JSON.stringify(absolutePath)
      }`,
    );

    this.path = path;
    this.pathIndex = pathIndex;
  }
}

/**
 * Get the value at a path in an object.
 *
 * @param object root object to search
 * @param path array of keys to traverse
 * @returns the value at the path
 * @throws if the path does not exist
 */
export function lookup<T>(object: T, path: Path): T {
  let result: T = object;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];

    if (result == null) {
      throw new PathNotFoundError(path, i);
    }

    if (typeof result !== "object") {
      throw new PathNotFoundError(path, i);
    }

    result = result[key as keyof T] as T;
  }
  return result;
}
