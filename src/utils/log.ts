import { bgCyan, blue, bold } from "$std/fmt/colors.ts";

export type Async<T> = T | Promise<T>;

export type HookCallback<T> = (apply: () => Async<T>) => Async<T>;

export type Hook<T> = (f: HookCallback<T>) => Async<T>;

export async function logFileOperation<T>(
  text: string,
  file: string,
  hook: Hook<T>,
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

export async function logTime<T>(
  text: string,
  hook: Hook<T>,
) {
  const template = (tag: string, text: string) => {
    return `${tag} ${text}`;
  };

  const skeleton = template("Litdoc", text);
  const message = template(bgCyan(" Litdoc "), bold(text));
  const padding = Math.max(0, 50 - skeleton.length);
  const line = message + " ".repeat(padding);

  const result = await hook((f) => {
    console.time(line);
    return f();
  });

  console.timeEnd(line);
  return result;
}

export function logText(
  text: string,
) {
  const template = (tag: string, text: string) => {
    return `${tag} ${text}`;
  };
  const message = template(bgCyan(" Litdoc "), bold(text));
  console.log(message);
}
