/** HELPERS **/

import { Call } from "../types.ts"

function trimIndent(text: string): string {
  const lines = text.split("\n");
  let minIndent: number | null = null;

  for (const line of lines) {
    if (line.trim().length === 0) continue; // Skip empty lines

    const lineIndent = line.search(/\S|$/); // Find the index of the first non-whitespace character or end of the line
    if (minIndent === null || lineIndent < minIndent) {
      minIndent = lineIndent;
    }
  }

  if (minIndent === null || minIndent === 0) {
    return text; // No indentation found or already minimum indentation
  }

  const trimmedLines = lines.map((line) => {
    return line.slice(minIndent as number);
  });

  return trimmedLines.join("\n");
}

type TemplateArgs = [TemplateStringsArray, ...unknown[]];

function getSource(node: Call) {
  // take the first argument as a string for the code
  if (typeof node.args[0] === "string") {
    return node.args[0] as string;
  }

  // otherwise, intersperse the strings and values
  const [strings, ...values] = node.args as TemplateArgs;
  return strings.reduce((acc, part, i) => {
    const value = values[i - 1] ?? "";
    return `${acc}${value}${part}`;
  }, "");
}

/** MAIN **/

export function code() {
  return (node: Node) => {
    return {
      type: "Code",
      lang: "ts",
      value: trimIndent(getSource(node)).trim(),
    };
  };
}
