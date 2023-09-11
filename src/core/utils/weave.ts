import type { Program } from "litdoc/swc/mod.ts";
import { Call } from "litdoc/tags/mod.ts";
import { link } from "../utils/link.ts";
import * as Templates from "./templates.ts";

/** HELPERS **/

function stringify(
  value: unknown,
  index: number,
  props?: unknown,
): string {
  const recurse = (value: unknown) => stringify(value, index, props);
  if (value === undefined) return "";
  if (value === null) return "";
  if (typeof value === "boolean") return "";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (typeof value === "function") return recurse(value(props));
  if (Array.isArray(value)) return value.map(recurse).join("");
  return `:values/${index}:`;
}

function getCalls(value: unknown): Call[] {
  if (typeof value !== "object" || value === null) return [];

  // 'doc' is the canonical name.
  // '_doc' can be used as fallback in case 'doc' is already taken.
  // '_doc' will take precedence over 'doc' if both are present.
  const doc = Reflect.get(value, "_doc") ?? Reflect.get(value, "doc");
  if (typeof doc !== "function") return [];

  return doc() as Call[];
}

function toBlocks(mod: unknown, program: Program) {
  const calls = getCalls(mod);
  const paths = link(program, calls);

  let index = 0;

  const children: Block[] = [];
  let lastValueId = 0;
  const values: Record<string, unknown> = {};

  for (let i = 0; i < program.body.length; i++) {
    const path = paths[index];

    if (!path) {
      continue;
    }

    const [_, j] = path;

    const push = (lang: string, text?: string) => {
      children.push({
        type: "Block",
        lang,
        span: program.body[i].span,
        children: text ? [{ type: "Text", text }] : [],
      });
    };

    if (i === j) {
      const { name, args } = calls[index++];
      const template = Templates.tagged(...args);

      const text = Templates
        .stringify(
          template,
          (value, index) => stringify(value, lastValueId + index),
        )
        .trim();

      lastValueId += template.values.length;

      push(name, text);
    } else {
      push("ts");
    }
  }

  return {
    children,
    values,
  };
}

function mergeAdjacentTypescript(blocks: Block[]) {
  // aggregate span
  const merged: Block[] = [];
  for (const block of blocks) {
    const last = merged[merged.length - 1];
    if (last && last.lang === block.lang && last.lang === "ts") {
      last.span.end = block.span.end;
      last.children.push(...block.children);
      continue;
    }
    merged.push(block);
  }

  return merged;
}

function trimTypescriptBlocks(blocks: Block[]) {
  const isTs = (block?: Block) => block?.lang === "ts";

  if (blocks.length === 1 && isTs(blocks[0])) {
    return blocks;
  }

  // remove ts block from start and end
  const copy = [...blocks];
  if (isTs(copy[0])) copy.shift();
  if (isTs(copy[copy.length - 1])) copy.pop();

  return copy;
}

/** MAIN **/

export type Block = {
  type: "Block";
  lang: string;
  span: { start: number; end: number };
  children: {
    type: "Text";
    text: string;
  }[];
};

export function toValues(mod: unknown) {
  const calls = getCalls(mod);

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

export function weave(mod: unknown, program: Program) {
  const { children, values } = toBlocks(mod, program);
  return {
    values,
    children: trimTypescriptBlocks(
      mergeAdjacentTypescript(children),
    ),
  };
}

export function toMarkdown(blocks: Block[], text: string): string {
  return blocks
    .map((node) => {
      const { start, end } = node.span;
      if (node.lang === "md") {
        return node.children.map((child) => child.text).join("");
      }
      const source = text.slice(start - 1, end).trim();
      return `~~~${node.lang}\n${source}\n~~~`;
    })
    .join("\n\n");
}
