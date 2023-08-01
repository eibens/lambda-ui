import gfm from "https://esm.sh/remark-gfm@3.0.1";
import parseRemark from "https://esm.sh/remark-parse@10.0.1";
import { unified } from "https://esm.sh/unified@10.1.2";
import { Editor, Element, Node, NodeEntry } from "slate";

/** HELPERS **/

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

function fixTypes(root: Node) {
  // from lowerCamelCase to UpperCamelCase
  for (const [node] of nodes(root)) {
    const { type } = node;
    if (!type) continue;
    const newType = type.replace(/^[a-z]/, (c) => c.toUpperCase());
    if (newType === type) continue;
    node.type = newType as Node["type"];
  }
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

function fixInlineCode(root: Node) {
  // Replace the slots with explicit slot nodes.
  for (const [node] of nodes(root)) {
    const code = node as unknown as Record<PropertyKey, unknown>;

    // Ignore non-slot nodes.
    if (code.type !== "InlineCode") continue;

    node.type = "Code";
    code.children = [{ type: "Text", text: code.text }];
    delete code.text;
  }
}

function fixSlots(root: Node) {
  // Replace the slots with explicit slot nodes.
  for (const [node, path] of nodes(root)) {
    const { type, text } = node as unknown as Record<PropertyKey, unknown>;

    // Ignore non-slot nodes.
    if (type !== "Html") continue;
    if (typeof text !== "string") continue;

    // Extract the slot identifier from the HTML node.
    const match = /^<slot id="([^"]+)"\/>$/.exec(text.trim());
    if (!match) return null;
    const [, id] = match;

    // Might need to extend this to other types of parents.
    const p = parent(root, path);

    const newNode: Node = {
      type: "Value",
      id,
      children: [{ type: "Text", text: "" }],
    };

    if (!p) throw new Error("Parent not found.");
    const index = path[path.length - 1];
    p.children![index] = newNode;
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
      type: "Text",
      text: "",
    }];
  }
}

function fixCodeBlocks(root: Node) {
  // Code blocks are literals that need to be converted to elements.
  for (const [node] of nodes(root)) {
    if (node.type !== "Code") continue;
    const literal = node as { text?: string };
    const { text = "" } = literal;
    node.children = [{ type: "Text", text }];
    delete literal.text;
  }
}

/** MAIN **/

export function parse(str: string): Node[] {
  const root = unified()
    .use(parseRemark)
    .use(gfm)
    .parse(str) as unknown as Extract<Node, { type: "Root" }>;

  fixTypes(root);
  fixPositions(root);
  fixLiterals(root);
  fixSlots(root);
  fixInlineCode(root);
  fixChildren(root);
  fixCodeBlocks(root);

  return root.children;
}

export function replace(editor: Editor, entry: NodeEntry) {
  const [_, path] = entry;
  const str = editor.string(path);
  const parsed = parse(str);

  editor.removeNodes({ at: path });
  editor.insertNodes(parsed, { at: path });
}

export function replaceAll(
  editor: Editor,
) {
  const nodes = editor.nodes({
    at: [],
    voids: true,
    match: (node) =>
      Element.isElement(node) &&
      node.type === "Code" &&
      node.lang === "md",
  });

  for (const entry of nodes) {
    replace(editor, entry);
  }
}
