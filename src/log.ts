import { bgCyan, blue, bold } from "$std/fmt/colors.ts";

export type Async<T> = T | Promise<T>;

export async function logFileOperation<T>(
  text: string,
  file: string,
  func: () => Async<T>,
) {
  const template = (tag: string, file: string, text: string) => {
    return `${tag} ${file} ${text}`;
  };

  const skeleton = template("Litdoc", file, text);
  const message = template(bgCyan(" Litdoc "), blue(file), bold(text));
  const padding = Math.max(0, 50 - skeleton.length);
  const line = message + " ".repeat(padding);

  console.time(line);
  const result = await func();
  console.timeEnd(line);
  return result;
}

export async function logTime<T>(
  text: string,
  func: () => Async<T>,
) {
  const template = (tag: string, text: string) => {
    return `${tag} ${text}`;
  };

  const skeleton = template("Litdoc", text);
  const message = template(bgCyan(" Litdoc "), bold(text));
  const padding = Math.max(0, 50 - skeleton.length);
  const line = message + " ".repeat(padding);

  console.time(line);
  const result = await func();
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
