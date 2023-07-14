import { Node } from "slate";

export type NodeBase = {
  key?: string;
};

export type ElementBase = {
  children: Node[];
};

export type TextBase = {
  text: string;
};

// node maps

export type NodeMap<Schema> = ElementMap<Schema> & TextMap<Schema>;

export type ElementMap<Schema> = {
  [K in keyof Schema]: Schema[K] extends ElementBase ? Schema[K] & { type: K }
    : never;
};

export type TextMap<Schema> = {
  [K in keyof Schema]: Schema[K] extends TextBase ? Schema[K] & { type: K }
    : never;
};

// node type properties

export type NodeType<Schema> = keyof NodeMap<Schema>;

export type ElementType<Schema> = keyof ElementMap<Schema>;

export type TextType<Schema> = keyof TextMap<Schema>;

// node objects

export type Element<
  Schema,
  T extends ElementType<Schema> = ElementType<Schema>,
> = ElementMap<Schema>[T];

export type Text<Schema, T extends TextType<Schema> = TextType<Schema>> =
  TextMap<Schema>[T];

export type Node<Schema, T extends NodeType<Schema> = NodeType<Schema>> =
  NodeMap<Schema>[T];

export type Editor<Schema> = Schema extends { root: infer Editor } ? Editor
  : never;

// custom

export type SlateCustomTypes<Schema> = {
  Editor: Editor<Schema>;
  Element: Element<Schema>;
  Text: Text<Schema>;
};
import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { Editor, Element, Node, NodeEntry, Transforms } from "slate";

/** HELPERS **/

function ensureKey(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;
  if (
    Element.isElement(node) &&
    node.key == null
  ) {
    const key = nanoid();
    Transforms.setNodes(editor, { key }, { at: path });

    // Prevent infinite loop.
    return;
  }
}

function markLeadParagraphs(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  // We look for a paragraph that is the second child of the root.
  // { type: "root", children: [{ ...title }, { type: "paragraph", ...}] }
  // Only consider top level paragraphs inside root element.
  // Lead paragraph is the second child (after the header).
  if (!Element.isElement(node)) return;
  if (node.type !== "paragraph") return;
  if (path.length !== 2) return;
  if (path[1] !== 1) return;

  const isLead = true;

  // Prevent infinite normalization loop.
  if (node.isLead !== isLead) return;

  Transforms.setNodes(editor, { isLead }, { at: path });
  return true;
}

function addSlugs(editor: Editor, entry: NodeEntry) {
  const [node, path] = entry;

  if (!Element.isElement(node)) return;
  if (node.type !== "heading") return;

  const slug = kebabCase(Node.string(node));

  // Prevent infinite loop.
  if (node.slug === slug) return;

  Transforms.setNodes(editor, { slug }, { at: path });
  return true;
}

/** MAIN **/

declare module "slate" {
  interface CustomTypes extends ToCustomTypes<Schema> {
    _none: unknown;
  }
}


export function normalize(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    if (markLeadParagraphs(editor, entry)) return;
    if (addSlugs(editor, entry)) return;

    normalizeNode(entry);
  };
}

export function isInlineParent(node: {
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

export function isBlockParent(node: Node): node is LitBlockParent {
  return [
    "blockquote",
    "list",
    "listItem",
  ].includes(node.type);
}
