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

export function format(str: string) {
  return trimIndent(
    trimEmptyLines(str.split("\n")),
  ).join("\n");
}
