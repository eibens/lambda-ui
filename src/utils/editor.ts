import type { NodeMap, Nodes, Root } from "litdoc/utils/schema.ts";
import {
  BaseEditor,
  createEditor,
  Editor,
  Element,
  Node,
  NodeEntry,
  Path,
  Text,
} from "slate";
import type { ReactEditor } from "slate-react";

type ToElementMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    children: infer _;
  } ? NodeMap[K]
    : never;
};

type ToTextMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    text: string;
  } ? NodeMap[K]
    : never;
};

type ToCustomNodeTypes<NodeMap> = {
  Node: Nodes<NodeMap>;
  Element: Nodes<ToElementMap<NodeMap>>;
  Text: Nodes<ToTextMap<NodeMap>>;
};

type ToCustomTypes<Editor> = ToCustomNodeTypes<NodeMap> & {
  Editor: Editor & Root & {
    values: Record<string, unknown>;
  };
};

function isInline(node: Element) {
  if ("isInline" in node) return Boolean(node.isInline);
  return [
    "Emphasis",
    "Strong",
    "Delete",
    "Link",
    "Token",
  ].includes(node.type);
}

function isVoid(node: Element) {
  if ("isVoid" in node) return Boolean(node.isVoid);
  return [
    "ThematicBreak",
    "Image",
    "Html",
    "Break",
    "FootnoteReference",
    "LinkReference",
  ].includes(node.type);
}

function normalizeNode(
  editor: Editor,
  entry: NodeEntry,
) {
  const [node, path] = entry;

  if (!node.type) {
    const isEmptyText = Text.isText(node) && editor.string(path) === "";
    const type = isEmptyText ? "Text" : "Unknown";
    editor.setNodes({ type }, { at: path });
    return true;
  }

  return false;
}

type TokenData = {
  href: string;
  path: string[];
  params: URLSearchParams;
};

function getTokens(node: Node): TokenData[] {
  return (node.tokens ?? [])
    .map((href) => new URL(href))
    .map((url) => ({
      href: url.href,
      path: url.pathname.split("/").filter(Boolean),
      params: url.searchParams,
    }));
}

/** MAIN **/

export type LitdocEditor = BaseEditor & ReactEditor & {
  values: Record<string, unknown>;
  getTitle: (at?: Path) => string | undefined;
  getLead: (at?: Path) => string | undefined;
  getIcon: (at?: Path) => string | undefined;
  getColor: (at?: Path) => string | undefined;
  getSpacing: (at?: Path) => number;
  getFontSize: (at?: Path) => number;
  getLineHeight: (at?: Path) => number;
  getListIndent: (at?: Path) => number;
};

declare module "slate" {
  // deno-lint-ignore no-empty-interface
  interface CustomTypes extends ToCustomTypes<LitdocEditor> {}
}

export function create(root: Root, values?: Record<string, unknown>) {
  const editor = createEditor();
  const old = { ...editor };

  Object.assign<
    LitdocEditor,
    Partial<LitdocEditor>
  >(
    editor,
    {
      ...root,
      values: values || {},
      getTitle: (at) => getTitle(editor, at),
      getLead: (at) => getLead(editor, at),
      getIcon: (at) => getIcon(editor, at),
      getColor: (at) => getColor(editor, at),
      getSpacing: (at) => getSpacing(editor, at),
      getFontSize: (at) => getFontSize(editor, at),
      getLineHeight: (at) => getLineHeight(editor, at),
      getListIndent: (at) => getListIndent(editor, at),
      isInline: (node) => {
        return isInline(node) || old.isInline(node);
      },
      isVoid: (node) => {
        return isVoid(node) || old.isVoid(node);
      },
      normalizeNode: (entry, options) => {
        const applied = normalizeNode(editor, entry);
        if (applied) return;
        old.normalizeNode(entry, options);
      },
    },
  );

  editor.normalize({ force: true });
  return editor;
}

export function getTitle(editor: Editor, at: Path = []): string | undefined {
  const [_, path] = editor.node(at);

  const headings = editor.nodes({
    at: path,
    match: (node) => node.type === "Heading",
  });

  for (const [heading] of headings) {
    return Node.string(heading).trim();
  }
}

export function getLead(editor: Editor, at: Path = []): string | undefined {
  const [_, path] = editor.node(at);

  const paragraphs = editor.nodes({
    at: path,
    match: (node) => node.type === "Paragraph",
  });

  for (const [paragraph] of paragraphs) {
    return Node.string(paragraph).trim();
  }
}

export function getIcon(editor: Editor, at: Path = []): string | undefined {
  const [node] = editor.node(at);

  const icon = getTokens(node)
    .filter((token) => token.path[0] === "icons")
    .map((token) => token.path[1])
    .filter(Boolean)[0];

  if (icon) return icon;

  if (node.type === "ListItem") {
    const [child] = node.children;
    if (child) {
      return getIcon(editor, at.concat(0));
    }
  }
}

export function getColor(editor: Editor, at: Path = []): string | undefined {
  const [node] = editor.node(at);
  return getTokens(node)
    .filter((token) => token.path[0] === "colors")
    .map((token) => token.path[1])
    .filter(Boolean)[0];
}

export function getSpacing(editor: Editor, at: Path = []) {
  const [node, path] = editor.node(at);

  const unit = 16;

  // No spacing for last nodes.
  const nextEntry = editor.next({ at: path });
  if (!nextEntry) return 0;
  const [next] = nextEntry;

  const isHeading = node.type === "Heading";
  const isNextHeading = next.type === "Heading";
  if (isHeading && isNextHeading) return unit;
  if (isHeading) return unit;
  if (isNextHeading) return 6 * unit;

  // The first paragraph after a heading is the lead.
  // It has a fixed spacing to the following element.
  if (node.type === "Paragraph") {
    const prevEntry = editor.previous({ at: path });
    if (prevEntry) {
      const [prev] = prevEntry;
      if (prev.type === "Heading") return 3 * unit;
    }
  }

  if (node.type === next.type) return unit;

  // Reduce spacing between these elements.
  const narrow = ["Paragraph", "ListItem", "List"];
  const isNarrow = narrow.includes(node.type);
  const isNextNarrow = narrow.includes(next.type);
  if (isNarrow && isNextNarrow) return unit;

  return 3 * unit;
}

export function getFontSize(editor: Editor, at: Path = []) {
  const [node, path] = editor.node(at);

  const unit = 4;
  const base = 4;

  if (node.type === "Heading") {
    const i = node.depth - 1;
    const s = [8, 6, 4, 3, 2, 1][i];
    return unit * (s + base);
  }

  if (node.type === "ListItem") {
    return getFontSize(editor, path.concat(0));
  }

  const prevEntry = editor.previous({ at: path });
  if (prevEntry) {
    const [prevNode] = prevEntry;
    if (prevNode.type == "Heading") {
      const level = prevNode.depth;
      return (6 - level) * 2 + unit * base;
    }
  }

  return unit * base;
}

export function getLineHeight(editor: Editor, at: Path = []) {
  return getFontSize(editor, at) * 1.5;
}

export function getListIndent(editor: Editor, at: Path = []) {
  return getLineHeight(editor, at) + 2;
}
