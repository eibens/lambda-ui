import { stringify } from "litdoc/utils/stringify.ts";
import type { Program } from "litdoc/utils/swc.ts";
import type { Call } from "litdoc/utils/tags.ts";

/** HELPERS **/

function getCalls(mod: unknown): Call[] {
  if (mod == null) return [];
  if (typeof mod !== "object") return [];
  if (!("doc" in mod)) return [];
  const doc = mod.doc;
  if (typeof doc !== "function") return [];
  const calls = doc();
  if (!Array.isArray(calls)) return [];
  return calls;
}

function stringifyCode(options: WeaveCodeOptions): string {
  const { lang, text } = options;
  if (lang === "md") return text;
  if (lang === "ts") return `~~~ts\n${text.trim()}\n~~~`;
  return `~~~${lang}\n${text}\n~~~`;
}

function stringifyModule(options: WeaveModuleOptions) {
  const { module } = options;
  const calls = getCalls(module);

  const blocks = calls.map((call, i) => {
    const { args, name: lang } = call;
    const text = stringify({ args, path: [i] });
    return { lang, text };
  });

  return blocks.map(stringifyCode).join("\n\n");
}

function stringifyProgram(options: WeaveProgramOptions) {
  const { program, text: source, module } = options;
  const calls = getCalls(module);
  let cursor = 0;
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
    const text = stringify({ args, path: [i] });
    blocks.push({ lang, text });
    cursor = end;
  }

  return blocks
    .map(stringifyCode)
    .join("\n\n");
}

function getValues(module: unknown) {
  const calls = getCalls(module);

  let lastValueId = 0;
  const values: Record<string, unknown> = {};

  for (let i = 0; i < calls.length; i++) {
    const { args: [_, ...callValues] } = calls[i];

    for (let j = 0; j < callValues.length; j++) {
      values[`${lastValueId + j}`] = callValues[j];
    }

    lastValueId += callValues.length;
  }

  return values;
}

/** MAIN **/

export type WeaveProgramOptions = {
  program: Program;
  text: string;
  module: unknown;
};

export type WeaveModuleOptions = {
  module: unknown;
};

export type WeaveCodeOptions = {
  lang: string;
  text: string;
};

export type WeaveValuesOptions = {
  module: unknown;
};

export type WeaveOptions =
  | WeaveProgramOptions & { type: "Program" }
  | WeaveModuleOptions & { type: "Module" }
  | WeaveCodeOptions & { type: "Code" }
  | WeaveValuesOptions & { type: "Values" };

export type WeaveResult = {
  text: string;
  values: Record<string, unknown>;
};

export function weave(options: WeaveOptions): WeaveResult {
  const { type } = options;

  switch (type) {
    case "Program":
      return {
        text: stringifyProgram(options),
        values: getValues(options.module),
      };
    case "Module":
      return {
        text: stringifyModule(options),
        values: getValues(options.module),
      };
    case "Code":
      return {
        text: stringifyCode(options),
        values: {},
      };
    case "Values":
      return {
        text: "",
        values: getValues(options.module),
      };
  }
}
