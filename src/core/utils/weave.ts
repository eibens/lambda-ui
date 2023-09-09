import type { Program } from "litdoc/swc/mod.ts";
import { Call } from "litdoc/tags/mod.ts";
import * as Templates from "litdoc/templates/mod.ts";
import { link } from "../utils/link.ts";

/** HELPERS **/

function stringify(
  value: unknown,
  props?: unknown,
  fallback?: (value: unknown) => string,
): string {
  const recurse = (value: unknown) => stringify(value, props, fallback);
  if (value === undefined) return "";
  if (value === null) return "";
  if (typeof value === "boolean") return "";
  if (typeof value === "number") return value.toString();
  if (typeof value === "string") return value;
  if (typeof value === "function") return recurse(value(props));
  if (Array.isArray(value)) return value.map(recurse).join("");
  if (fallback) return fallback(value);
  return String(value);
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

  const blocks: Block[] = [];

  for (let i = 0; i < program.body.length; i++) {
    const path = paths[index];

    if (!path) {
      continue;
    }

    const [_, j] = path;

    const push = (lang: string, text?: string) => {
      blocks.push({
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
        .stringify(template, (value) => stringify(value))
        .trim();
      push(name, text);
    } else {
      push("ts");
    }
  }

  return blocks;
}

function mergeAdjacent(blocks: Block[]) {
  // aggregate span
  const merged: Block[] = [];
  for (const block of blocks) {
    const last = merged[merged.length - 1];
    if (last && last.lang === block.lang) {
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

export function weave(mod: unknown, program: Program) {
  return trimTypescriptBlocks(
    mergeAdjacent(
      toBlocks(mod, program),
    ),
  );
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
