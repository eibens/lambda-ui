import { nanoid } from "https://esm.sh/nanoid@4.0.0";
import { Loader } from "./types.ts";

export function fromLog<T>(options: {
  load: Loader<T>;
  type: string;
  source: string;
}): Loader<T> {
  const { type, source, load } = options;
  return async (key, version) => {
    const message =
      `[litdoc/cache] ${type} <- ${source}: ${key} (${nanoid()}):`;
    console.time(message);
    const value = await load(key, version);
    console.timeEnd(message);
    return value;
  };
}
