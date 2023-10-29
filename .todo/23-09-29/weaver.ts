import type { Call, TemplateArgs, Value } from "./lit.ts";
import type { Program } from "./swc.ts";

/** HELPERS **/

function fromBlocks(
  block: { lang: string; text: string }[],
  values: Value[],
): Template {
  const text = block
    .map(({ lang, text }) => {
      if (lang === "md") return text;
      if (lang === "ts") return `~~~ts\n${text.trim()}\n~~~`;
      return `~~~${lang}\n${text}\n~~~`;
    })
    .join("\n\n");
  return { text, values };
}

function weaveTemplateArgs(
  args: TemplateArgs,
  offset = 0,
): Template {
  const [strings, ...values] = args;

  const newValues: Value[] = [];
  const iter = (function* (): Generator<string> {
    for (let i = 0; i < strings.length; i++) {
      yield strings[i];
      if (i >= values.length) break;

      const value = values[i];
      newValues.push(value);
      const innerOffset = offset + newValues.length;

      if (value === undefined) yield "";
      else if (value === null) yield "";
      else if (typeof value === "boolean") yield "";
      else if (typeof value === "number") yield value.toString();
      else if (typeof value === "string") yield value;
      else if (typeof value === "object") {
        const array = [value].flat();
        for (const item of array) {
          const type = Reflect.get(item, "type");
          if (type === "Call") {
            const call = item as Call;
            const template = weaveTemplateArgs(call.args, innerOffset);
            const { text, values } = template;
            yield text;
            newValues.push(...values);
          }
        }
      } else {
        yield `:values/${innerOffset}:`;
      }
    }
  })();

  const text = Array.from(iter).join("");
  return { text, values: newValues };
}

function weaveCalls(calls: Call[]) {
  const values: Value[] = [];

  const blocks = calls.map((call) => {
    const { args, name: lang } = call;
    const offset = values.length;
    const template = weaveTemplateArgs(args, offset);
    const { text, values: newValues } = template;
    values.push(...newValues);
    return { lang, text };
  });

  return fromBlocks(blocks, values);
}

function weaveProgram(
  calls: Call[],
  sources: {
    program: Program;
    text: string;
  },
): Template {
  const { program, text: source } = sources;

  let cursor = 0;
  const values: Value[] = [];
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
    const template = weaveTemplateArgs(args, values.length);
    const { text, values: newValues } = template;
    values.push(...newValues);
    blocks.push({ lang, text });

    cursor = end;
  }

  return fromBlocks(blocks, values);
}

/** MAIN **/

export type Template = {
  text: string;
  values: Value[];
};

export function weave(calls: Call[], sources?: {
  program: Program;
  text: string;
}): Template {
  return sources ? weaveProgram(calls, sources) : weaveCalls(calls);
}
