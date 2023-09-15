import type { Program } from "litdoc/utils/swc.ts";
import { link } from "litdoc/utils/link.ts";
import { stringify } from "litdoc/utils/stringify.ts";
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

  function mergeTs(blocks: WeaveCodeOptions[]) {
    const merged: WeaveCodeOptions[] = [];
    for (const block of blocks) {
      const last = merged[merged.length - 1];
      if (last && last.lang === block.lang && last.lang === "ts") {
        last.text += block.text;
        continue;
      }
      merged.push({ ...block });
    }

    return merged;
  }

  function trimTs(blocks: WeaveCodeOptions[]) {
    const isTs = (block?: WeaveCodeOptions) => block?.lang === "ts";

    if (blocks.length === 1 && isTs(blocks[0])) {
      return blocks;
    }

    // remove ts block from start and end
    const copy = [...blocks];
    if (isTs(copy[0])) copy.shift();
    if (isTs(copy[copy.length - 1])) copy.pop();

    return copy;
  }

  function* generate() {
    const calls = getCalls(module);
    const paths = link(program, calls);
    let callIndex = 0;
    for (let i = 0; i < program.body.length; i++) {
      const path = paths[callIndex];
      if (!path) continue;
      const [_, j] = path;
      if (i === j) {
        const call = calls[callIndex++];
        const { args, name: lang } = call;
        const text = stringify({ args, path: [i] });
        yield { lang, text };
      } else {
        const { start, end } = program.body[i].span;
        const text = source.slice(start - 1, end);
        yield { lang: "ts", text };
      }
    }
  }

  return trimTs(mergeTs(Array.from(generate())))
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
