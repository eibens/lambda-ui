import { ViewNode } from "@/features/theme/view.tsx";
import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Element, Node } from "slate";
import { Template } from "../utils/mod.ts";

/** HELPERS **/

type Slot = {
  id: string;
};

type Entry = [Node, Path];

type Path = number[];

function* nodes(node: Node, path: Path = []): Generator<Entry> {
  yield [node, path];

  if ("children" in node) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const childPath = [...path, i];
      yield* nodes(child, childPath);
    }
  }
}

function parent(root: Node, path: Path): Element {
  if (path.length === 0) {
    throw new Error("Parent not found.");
  }
  const parentPath = path.slice(0, -1);
  let parent: Node | null = root;
  for (const index of parentPath) {
    if (!parent || !("children" in parent)) {
      throw new Error("Parent not found.");
    }
    parent = parent.children[index];
  }
  return parent as Element;
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
    Reflect.deleteProperty(node, "position");
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

function fixSlots(slots: Record<string, unknown>, root: Node, options: {
  isInlineParent: (node: Node) => boolean;
}) {
  const { isInlineParent } = options;
  // Replace the slots with explicit slot nodes.
  for (const [node, path] of nodes(root)) {
    const { type, text } = node as unknown as Record<PropertyKey, unknown>;

    // Ignore non-slot nodes.
    if (type !== "html") continue;
    if (typeof text !== "string") continue;

    // Extract the slot identifier from the HTML node.
    const match = /^<slot id="([^"]+)"\/>$/.exec(text.trim());
    if (!match) return null;
    const [, id] = match;

    // Might need to extend this to other types of parents.
    const p = parent(root, path);
    const isInline = isInlineParent(p);

    const newNode: Node = (() => {
      // deno-lint-ignore no-explicit-any
      const value = slots[id] as any;
      if (Node.isNode(value)) {
        return value;
      }
      // Replace the HTML node with a more explicit slot node.
      return {
        type: "slot" as const,
        id,
        isInline,
        children: [{ type: "plain", text: "" }],
      };
    })();

    if (!p) throw new Error("Parent not found.");
    const index = path[path.length - 1];
    p.children![index] = newNode;
  }
}

function fixText(root: Node) {
  for (const [node] of nodes(root)) {
    const type = node.type as string;
    if (type === "text") {
      node.type = "plain";
    }
  }
}

function fixChildren(root: Node) {
  // Some nodes in Markdown AST have not children.
  // These need an empty text element for Slate compatibility.
  for (const [node] of nodes(root)) {
    // Ignore elements with child array.
    if ("children" in node) continue;

    // Ignore text nodes.
    if (typeof node.text === "string") continue;

    // Add an empty text element to each such node.
    (node as unknown as Element).children = [{
      type: "plain",
      text: "",
    }];
  }
}

function fixCodeBlocks(root: Node) {
  // Code blocks are literals that need to be converted to elements.
  for (const [node] of nodes(root)) {
    if (node.type !== "code") continue;
    const literal = node as { text?: string };
    const { text = "" } = literal;
    node.children = [{ type: "plain", text }];
    delete literal.text;
  }
}

/** MAIN **/

export type Value<Data> =
  | null
  | undefined
  | boolean
  | string
  | number
  | ViewNode
  | Node
  | Value<Data>[]
  | ((data: Data, id: string, slots: Record<string, unknown>) => Value<Data>);

export type Input<Data> = Template.Input<Value<Data>>;

export type Options<Data> = {
  data?: Data;
};

export function weave(
  slots: Record<string, unknown>,
  input: Input<unknown>,
): Node[];
export function weave<Data>(
  slots: Record<string, unknown>,
  input: Input<Data>,
  options: {
    data: Data;
  },
): Node[];
export function weave<Data>(
  slots: Record<string, unknown>,
  input: Input<Data>,
  options?: {
    data: Data;
  },
): Node[] {
  const { data } = options ?? { data: {} as Data };

  const text = Template.weave(
    slots,
    input,
    function stringify(value, id, slots): string {
      if (typeof value === "function") {
        value = value(data, id, slots);
      }
      if (Array.isArray(value)) {
        return value.map((value, i) => {
          const itemId = `${id}.${i}`;
          slots[itemId] = value;
          return stringify(value, itemId, slots);
        }).join("");
      }
      if (value == null) {
        return "";
      }
      if (typeof value === "boolean") {
        return "";
      }
      if (typeof value === "object") {
        return `<slot id="${id}"/>`;
      }

      return String(value);
    },
  );

  const markdownRoot = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(text) as Element;

  fixPositions(markdownRoot);
  fixText(markdownRoot);
  fixLiterals(markdownRoot);
  fixCodeBlocks(markdownRoot);
  fixChildren(markdownRoot);
  fixSlots(slots, markdownRoot, { isInlineParent });

  return markdownRoot.children;
}
