import type { Call, Program, Template } from "./types.ts";

/** HELPERS **/

function stringifyCode(text: string, lang: string): string {
  if (lang === "md") return text;
  if (lang === "ts") return `~~~ts\n${text.trim()}\n~~~`;
  return `~~~${lang}\n${text}\n~~~`;
}

function stringifyBlocks(block: { lang: string; text: string }[]) {
  return block
    .map(({ lang, text }) => stringifyCode(text, lang))
    .join("\n\n");
}

function stringifyTemplate(template: Template, offset = 0): string {
  const [strings, ...values] = template;

  const iter = (function* (): Generator<string> {
    for (let i = 0; i < strings.length; i++) {
      yield strings[i];
      if (i < values.length) {
        const value = values[i];
        if (value === undefined) yield "";
        if (value === null) yield "";
        if (typeof value === "boolean") yield "";
        if (typeof value === "number") yield value.toString();
        if (typeof value === "string") yield value;
        yield `:values/${offset + i}:`;
      }
    }
  })();

  return Array.from(iter).join("");
}

/** MAIN **/

export function stringifyCalls(calls: Call[]) {
  const blocks = calls.map((call, i) => {
    const { args, name: lang } = call;
    const text = stringifyTemplate(args, i);
    return { lang, text };
  });

  return stringifyBlocks(blocks);
}

export function stringifyProgram(options: {
  program: Program;
  text: string;
  calls: Call[];
}) {
  const { program, text: source, calls } = options;

  let cursor = 0;
  let valueOffset = 0;
  const blocks: { lang: string; text: string }[] = [];

  for (let i = 0; i < program.body.length; i++) {
    // Ignore everything after the last template.
    if (calls.length === 0) break;

    // A template is an expression statement...
    const node = program.body[i];
    if (node.type !== "ExpressionStatement") continue;

    // ... of either a call or a tagged template...
    const { expression } = node;
    const isCall = expression.type === "CallExpression";
    const isTagged = expression.type === "TaggedTemplateExpression";
    if (!isCall && !isTagged) continue;

    // ... that has an identifier as callee or tag...
    const identifier = isCall ? expression.callee : expression.tag;
    if (identifier.type !== "Identifier") continue;

    // ... that matches the next call in the queue.
    if (identifier.value !== calls[0].name) continue;

    // Before adding the template, add code since the last one.
    // Unless, this is the first template or empty, then ignore.
    const { start, end } = program.body[i].span;
    if (blocks.length > 0) {
      const text = source.slice(cursor, start - 1);
      if (text.trim().length > 0) {
        blocks.push({ lang: "ts", text });
      }
    }

    // Add the template.
    const { args, name: lang } = calls.shift()!;
    const text = stringifyTemplate(args, valueOffset);
    blocks.push({ lang, text });

    cursor = end;
    valueOffset += args.length - 1;
  }

  return stringifyBlocks(blocks);
}
