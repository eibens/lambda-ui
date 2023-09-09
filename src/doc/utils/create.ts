import {
  createEditor,
  Editor,
  EditorNodesOptions,
  Node,
  NodeEntry,
  Text,
} from "slate";
import type { NodeType, Root } from "./schema.ts";
import * as Slots from "./slots.ts";
import * as Tokens from "./tokens.ts";
import * as Values from "./values.ts";

import { Element, Operation } from "slate";

/** HELPERS **/

type Plugin = Partial<{
  isInline: (element: Element) => boolean;
  isVoid: (element: Element) => boolean;
  normalizeNode: (entry: NodeEntry, next: () => void) => void;
  onChange: (options?: { operation?: Operation }) => void;
}>;

function override(
  editor: Editor,
  plugin: Plugin,
) {
  const { isInline, isVoid, normalizeNode, onChange } = editor;
  return Object.assign(editor, {
    isInline: (element: Element) => {
      return plugin.isInline?.(element) || isInline(element);
    },
    isVoid: (element: Element) => {
      return plugin.isVoid?.(element) || isVoid(element);
    },
    normalizeNode: (entry: NodeEntry, options: {
      operation?: Operation;
    }) => {
      const next = () => normalizeNode(entry, options);
      if (!plugin.normalizeNode) return next();
      plugin.normalizeNode(entry, next);
    },
    onChange: (options?: { operation?: Operation }) => {
      plugin.onChange?.(options);
      onChange(options);
    },
  });
}

function mutate(
  editor: Editor,
  options: EditorNodesOptions<Node> & {
    apply: (entry: NodeEntry<Node>) => boolean;
  },
) {
  const { apply, ...nodesOptions } = options;
  const iter = editor.nodes(nodesOptions);
  const entries = Array.from(iter);
  if (entries.length === 0) return;

  for (const entry of entries) {
    if (apply(entry)) {
      mutate(editor, options);
      return;
    }
  }
}

const inlineTypes: NodeType[] = [
  "Emphasis",
  "Strong",
  "Delete",
  "Link",
  "Token",
];

const voidTypes: NodeType[] = [
  "ThematicBreak",
  "Token",
  "Image",
  "Html",
  "Break",
  "FootnoteReference",
  "LinkReference",
];

/** MAIN **/

export function create(root: Root) {
  const editor = createEditor();
  editor.children = root.children;
  editor.type = "Root";

  mutate(editor, {
    at: [],
    voids: true,
    match: (x) => Slots.match(editor, x),
    apply: (x) => Slots.apply(editor, x),
  });

  mutate(editor, {
    at: [],
    match: (x) => Tokens.match(editor, x),
    apply: (x) => Tokens.apply(editor, x),
  });

  mutate(editor, {
    at: [],
    voids: true,
    match: (x) => Values.match(editor, x),
    apply: (x) => Values.apply(editor, x),
  });

  const docEditor = override(editor, {
    normalizeNode: (entry, next) => {
      const [node, path] = entry;
      if (node.type) return next();
      const isEmptyText = Text.isText(node) && editor.string(path) === "";
      const type = isEmptyText ? "Text" : "Unknown";
      editor.setNodes({ type }, { at: path });
    },
    isInline: (node) => {
      if ("isInline" in node) return Boolean(node.isInline);
      if (inlineTypes.includes(node.type)) return true;
      return false;
    },
    isVoid: (node) => voidTypes.includes(node.type),
  });

  docEditor.normalize({ force: true });

  return docEditor;
}
