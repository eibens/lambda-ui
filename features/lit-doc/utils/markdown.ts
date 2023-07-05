import { ViewNode } from "../../theme/view.tsx";
import { gfm, parseRemark, unified } from "../deps.ts";
import { isInlineParent } from "../mod.ts";
import { LitElement } from "../types.ts";
import { Slot, Template, Tree } from "../utils/mod.ts";

/** HELPERS **/

function fixLiterals(root: Tree.Node) {
  // In Markdown AST, nodes that contain text are typed as Literal.
  for (const [node] of Tree.nodes(root)) {
    // A Literal has a `value` property that contains the text.
    const literal = node as unknown as Record<PropertyKey, unknown>;
    if (typeof literal.value !== "string") continue;

    // Rename the `value` property to `text` for each such node.
    literal.text = literal.value;
    delete literal.value;
  }
}

function fixSlots(root: Tree.Node, options: {
  isInlineParent: (node: Tree.Node) => boolean;
}) {
  const { isInlineParent } = options;
  // Replace the slots with explicit slot nodes.
  for (const [node, path] of Tree.nodes(root)) {
    const { type, text } = node as unknown as Record<PropertyKey, unknown>;

    // Ignore non-slot nodes.
    if (type !== "html") continue;
    if (typeof text !== "string") continue;
    const data = Slot.parse(text);
    if (!data) continue;

    // Might need to extend this to other types of parents.
    const parent = Tree.parent(root, path);
    const isInline = isInlineParent(parent);

    // Replace the HTML node with a more explicit slot node.
    const slot: Tree.Node = {
      type: "slot" as const,
      id: data.id,
      isInline,
      children: [{ type: "text", text: "" }],
    };

    Tree.replace(root, path, slot);
  }
}

function fixChildren(root: Tree.Node) {
  // Some nodes in Markdown AST have not children.
  // These need an empty text element for Slate compatibility.
  for (const [node] of Tree.nodes(root)) {
    // Ignore elements with child array.
    if (Array.isArray(node.children)) continue;

    // Ignore text nodes.
    if (typeof node.text === "string") continue;

    // Add an empty text element to each such node.
    node.children = [];
  }
}

function isViewNode(node: unknown): node is ViewNode {
  if (typeof node !== "object") return false;
  if (node === null) return false;
  const type = Reflect.get(node, "$$typeof");
  return type === Symbol.for("react.element");
}

/** MAIN **/

export type Value<Data> =
  | string
  | ViewNode
  | ((data: Data, id: string) => string);

export type Input<Data> = Template.Input<Value<Data>>;

export type Options<Data> = {
  data?: Data;
};

export type Result = {
  children: LitElement[];
  slots: Record<string, unknown>;
};

export function weave(input: Input<unknown>): Result;
export function weave<Data>(input: Input<Data>, options: {
  data: Data;
}): Result;
export function weave<Data>(input: Input<Data>, options?: {
  data: Data;
}): Result {
  const { data } = options ?? {};

  const { text, slots } = Template.weave(input, {
    evaluate: (value, id) => {
      if (typeof value === "function") {
        return value(data ?? ({} as Data), id);
      }
      if (isViewNode(value)) {
        return Slot.stringify({ id });
      }
      if (value == null) {
        return "";
      }

      return String(value);
    },
  });

  // Dataarse the Markdown source into a Markdown AST.
  const markdownRoot = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(text) as Tree.Node;

  fixLiterals(markdownRoot);
  fixSlots(markdownRoot, { isInlineParent });
  fixChildren(markdownRoot);

  return {
    // Can cast here since we fixed the tree.
    children: markdownRoot.children as LitElement[],
    slots,
  };
}
