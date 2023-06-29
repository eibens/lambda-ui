import { createEditor } from "slate";
import { LitEditor } from "../types.ts";
import * as Template from "../utils/template.ts";

/** HELPERS **/

function trimIndent(lines: string[]): string[] {
  let minIndent = Infinity;
  for (const line of lines) {
    // Skip empty lines.
    if (line.trim().length === 0) continue;

    // Find the index of the first non-whitespace character or end of the line.
    const lineIndent = line.search(/\S|$/);

    minIndent = Math.min(minIndent, lineIndent);
  }

  minIndent = minIndent === Infinity ? 0 : minIndent;

  return lines
    // Trim the lines.
    .map((line) => line.slice(minIndent));
}

function trimEmptyLines(lines: string[]): string[] {
  let startIndex = 0;
  let endIndex = lines.length - 1;

  // Find the index of the first non-empty line
  while (startIndex < lines.length && lines[startIndex].trim() === "") {
    startIndex++;
  }

  // Find the index of the last non-empty line
  while (endIndex >= 0 && lines[endIndex].trim() === "") {
    endIndex--;
  }

  // Extract the non-empty lines
  return lines.slice(startIndex, endIndex + 1);
}

function parse(...args: Template.Args | [string]) {
  // Helper to convert string input to TemplateArgs.
  function tag(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Template.Args {
    return [strings, ...values];
  }

  const [strings, ...values] = typeof args[0] === "string"
    ? tag`${args[0]}`
    : args;

  let source = "";

  for (let i = 0; i < strings.length; i++) {
    source += strings[i];
    const value = values[i] ?? "";
    source += value;
  }

  const formatted = trimIndent(
    trimEmptyLines(
      source.split("\n"),
    ),
  ).join("\n");

  const editor = createEditor();

  editor.children = [{
    type: "code",
    children: [{
      type: "text",
      text: formatted,
    }],
  }];

  return editor;
}

/** MAIN **/

export function create(editor: LitEditor) {
  return function (...input: Template.Input) {
    const parsed = parse(...input);
    editor.children = [
      ...editor.children,
      ...parsed.children,
    ];
  };
}
