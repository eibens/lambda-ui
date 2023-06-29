import { default as gfm } from "https://esm.sh/remark-gfm@3.0.1";
import { default as parseRemark } from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { createEditor, Descendant } from "slate";
import { isInlineParent } from "../mod.ts";
import { LitEditor } from "../types.ts";
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

function parse(...input: Template.Input) {
  const { text, slots } = Template.weave(...input);

  // Parse the Markdown source into a Markdown AST.
  const markdownRoot = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(text) as Tree.Node;

  fixLiterals(markdownRoot);
  fixSlots(markdownRoot, { isInlineParent });
  fixChildren(markdownRoot);

  const editor = createEditor();

  // Cast here to ignore the stricter typings of the Markdown AST.
  editor.children = markdownRoot.children as unknown as Descendant[];

  // The slots hold the actual values for the slots.
  // Values cannot be included in the editor, as they might not be JSON-serializable.
  return Object.assign(editor, { slots });
}

/** MAIN **/

export function create(editor: LitEditor) {
  return function (...input: Template.Input) {
    const parsed = parse(...input);
    editor.children = [
      ...editor.children,
      ...parsed.children,
    ];
    Object.assign(editor.slots, parsed.slots);
  };
}
