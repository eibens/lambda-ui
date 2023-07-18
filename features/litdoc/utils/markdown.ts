import { ViewNode } from "@/features/theme/view.tsx";
import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Element } from "slate";
import { Template } from "../utils/mod.ts";

/** HELPERS **/

type Slot = {
  id: string;
};

type Entry = [Node, Path];

type Path = number[];

type Node = {
  type: string;
  children?: Node[];
} & Record<string, unknown>;

function* nodes(node: Node, path: Path = []): Generator<Entry> {
  yield [node, path];

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childPath = [...path, i];
      yield* nodes(child, childPath);
    }
  }
}

function parent(root: Node, path: Path): Node {
  if (path.length === 0) {
    throw new Error("Parent not found.");
  }
  const parentPath = path.slice(0, -1);
  let parent: Node | null = root;
  for (const index of parentPath) {
    if (!parent.children) {
      throw new Error("Parent not found.");
    }
    parent = parent.children[index];
  }
  return parent;
}

function stringifySlot(data: Slot): string {
  return `<slot id="${data.id}"/>`;
}

function parseSlot(str: string): Slot | null {
  const match = /^<slot id="([^"]+)"\/>$/.exec(str.trim());
  if (!match) return null;
  return { id: match[1] };
}

function isInlineParent(node: {
  type: string;
}): boolean {
  return [
    "paragraph",
    "heading",
    "link",
    "emphasis",
    "strong",
    "delete",
    "inlineCode",
  ].includes(node.type);
}

function fixPositions(root: Node) {
  for (const [node] of nodes(root)) {
    delete node.position;
  }
}

function fixLiterals(root: Node) {
  // In Markdown AST, nodes that contain text are typed as Literal.
  for (const [node] of nodes(root)) {
    // A Literal has a `value` property that contains the text.
    const literal = node as unknown as Record<PropertyKey, unknown>;
    const isLiteral = typeof literal.value !== "string";
    if (isLiteral) continue;

    // Rename the `value` property to `text` for each such node.
    literal.text = literal.value;
    delete literal.value;
  }
}

function fixSlots(root: Node, options: {
  isInlineParent: (node: Node) => boolean;
}) {
  const { isInlineParent } = options;
  // Replace the slots with explicit slot nodes.
  for (const [node, path] of nodes(root)) {
    const { type, text } = node as unknown as Record<PropertyKey, unknown>;

    // Ignore non-slot nodes.
    if (type !== "html") continue;
    if (typeof text !== "string") continue;
    const data = parseSlot(text);
    if (!data) continue;

    // Might need to extend this to other types of parents.
    const p = parent(root, path);
    const isInline = isInlineParent(p);

    // Replace the HTML node with a more explicit slot node.
    const slot: Node = {
      type: "slot" as const,
      id: data.id,
      isInline,
      children: [{ type: "plain", text: "" }],
    };

    if (!p) throw new Error("Parent not found.");
    const index = path[path.length - 1];
    p.children![index] = slot;
  }
}

function fixText(root: Node) {
  for (const [node] of nodes(root)) {
    if (node.type === "text") {
      node.type = "plain";
    }
  }
}

function fixChildren(root: Node) {
  // Some nodes in Markdown AST have not children.
  // These need an empty text element for Slate compatibility.
  for (const [node] of nodes(root)) {
    // Ignore elements with child array.
    if (Array.isArray(node.children)) continue;

    // Ignore text nodes.
    if (typeof node.text === "string") continue;

    // Add an empty text element to each such node.
    node.children = [];
  }
}

function fixCodeBlocks(root: Node) {
  // Code blocks are literals that need to be converted to elements.
  for (const [node] of nodes(root)) {
    if (node.type !== "code") continue;
    const { text } = node;
    node.children = [{ type: "plain", text }];
    delete node.text;
  }
}

function isViewNode(node: unknown): node is ViewNode {
  if (typeof node !== "object") return false;
  if (node === null) return false;
  const type = Reflect.get(node, "$$typeof");
  return type === Symbol.for("react.element");
}

function evaluate<Data>(data: Data, value: Value<Data>, id: string): string {
  if (typeof value === "function") {
    const result = value(data, id);
    return evaluate(data, result, id);
  }
  if (isViewNode(value)) {
    return stringifySlot({ id });
  }
  if (Array.isArray(value)) {
    return value.map((value) => evaluate(data, value, id)).join("");
  }
  if (value == null) {
    return "";
  }

  return String(value);
}

/** MAIN **/

export type Value<Data> =
  | string
  | string[]
  | ViewNode
  | ((data: Data, id: string) => Value<Data>);

export type Input<Data> = Template.Input<Value<Data>>;

export type Options<Data> = {
  data?: Data;
};

export type Result = {
  children: Element[];
  slots: Record<string, unknown>;
};

export function weave(input: Input<unknown>): Result;
export function weave<Data>(input: Input<Data>, options: {
  data: Data;
}): Result;
export function weave<Data>(input: Input<Data>, options?: {
  data: Data;
}): Result {
  const { data } = options ?? { data: {} as Data };

  const { text, slots } = Template.weave(input, {
    evaluate: (value, id) => evaluate(data, value, id),
  });

  const markdownRoot = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(text) as Node;

  fixPositions(markdownRoot);
  fixText(markdownRoot);
  fixLiterals(markdownRoot);
  fixCodeBlocks(markdownRoot);
  fixChildren(markdownRoot);
  fixSlots(markdownRoot, { isInlineParent });

  return {
    // Can cast here since we fixed the tree.
    children: markdownRoot.children as Element[],
    slots,
  };
}
