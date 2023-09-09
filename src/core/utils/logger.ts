import { bgCyan, blue, bold } from "$std/fmt/colors.ts";

/** MAIN **/

export type Async<T> = T | Promise<T>;

export async function task<T>(
  text: string,
  file: string,
  hook: (f: (apply: () => Async<T>) => Async<T>) => Async<T>,
) {
  const template = (tag: string, file: string, text: string) => {
    return `${tag} ${file} ${text}`;
  };

  const skeleton = template("Litdoc", file, text);
  const message = template(bgCyan(" Litdoc "), blue(file), bold(text));
  const padding = Math.max(0, 50 - skeleton.length);
  const line = message + " ".repeat(padding);

  const result = await hook((f) => {
    console.time(line);
    return f();
  });

  console.timeEnd(line);
  return result;
}
