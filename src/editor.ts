import { createEditor, Editor, Node, Path, Text } from "slate";
import { ReactEditor, withReact } from "slate-react";
import type {
  LitdocEditor,
  NodeMap,
  Root,
  ToCustomTypes,
  TokenData,
  Value,
} from "./types.ts";

/** HELPERS **/

function* resolveToken(
  node: Node,
  values: Record<string, Value>,
): Iterable<Node> {
  if (node.type !== "Token") {
    return yield node;
  }

  // Token is not a value.
  const valuePrefix = "token:///values/";
  if (!node.url.startsWith(valuePrefix)) {
    return yield node;
  }

  // Extract key and value.
  const key = node.url.slice(valuePrefix.length);
  const value = values[key];

  // All values must resolve.
  if (value == null) {
    console.warn(`Value ${key} not found.`);
    return yield node;
  }

  // At this stage, there should be only nodes and VDom.
  if (typeof value !== "object") {
    throw new Error(`Value ${key} is not an object.`);
  }

  if ("doc" in value) {
    throw new Error("TODO: Handle Litdoc values.");
  }

  // VDom will be handled later during rendering.
  if ("$$typeof" in value) {
    return [node];
  }

  const nodes: Node[] = (Array.isArray(value) ? value : [value]) as Node[];
  for (const child of nodes) {
    if (child.type === "Fragment" || child.type === "Root") {
      yield* child.children;
    } else {
      yield child;
    }
  }
}

/** MAIN **/

declare module "slate" {
  // deno-lint-ignore no-empty-interface
  interface CustomTypes extends ToCustomTypes<LitdocEditor & ReactEditor> {}
}

export function create(root: Root, values?: Record<number | string, Value>) {
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
      isInline: (node) => {
        if ("isInline" in node) return Boolean(node.isInline);
        return [
          "Emphasis",
          "Strong",
          "Delete",
          "Link",
          "Token",
        ].includes(node.type) || old.isInline(node);
      },
      isVoid: (node) => {
        if ("isVoid" in node) return Boolean(node.isVoid);
        return [
          "ThematicBreak",
          "Image",
          "Html",
          "Break",
          "FootnoteReference",
          "LinkReference",
        ].includes(node.type) || old.isVoid(node);
      },
      normalizeNode: (entry, options) => {
        const [node, path] = entry;

        if (!node.type) {
          const isEmptyText = Text.isText(node) && editor.string(path) === "";
          const type = isEmptyText ? "Text" : "Unknown";
          editor.setNodes({ type }, { at: path });
          return;
        }

        if (node.type === "Token") {
          // Token sticks to the node before it (or parent).
          if (node.assign === "before") {
            const [target, targetPath] = editor.previous({ at: path }) ??
              editor.parent(path);
            const tokens = [...(target.tokens ?? []), node.url];
            editor.setNodes({ tokens }, { at: targetPath });
            editor.removeNodes({ at: path });
            return;
          }

          // Token sticks to the node after it (or parent).
          if (node.assign === "after") {
            const [target, targetPath] = editor.next({ at: path }) ??
              editor.parent(path);
            const tokens = [...(target.tokens ?? []), node.url];
            editor.setNodes({ tokens }, { at: targetPath });
            editor.removeNodes({ at: path });
            return;
          }

          // Token is parsed as a node.
          const nodes = Array.from(resolveToken(node, editor.values));
          if (nodes.length !== 1 || nodes[0] !== node) {
            editor.removeNodes({ at: path });
            editor.insertNodes(nodes, {
              at: path,
            });
            return;
          }
        }

        old.normalizeNode(entry, options);
      },
    },
  );

  editor.normalize({ force: true });
  return withReact(editor);
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

export function getTokens(node: Node): TokenData[] {
  return (node.tokens ?? [])
    .map((href) => new URL(href))
    .map((url) => ({
      href: url.href,
      path: url.pathname.split("/").filter(Boolean),
      params: url.searchParams,
    }));
}

export function getIcon(editor: Editor, at: Path = []): string | undefined {
  const [node] = editor.node(at);

  const icon = getTokens(node)
    .filter((token) => token.path[0] === "icons")
    .map((token) => token.path[1])
    .filter(Boolean)[0];

  if (icon) return icon;

  if (node.type === "ListItem" || node.type === "Root") {
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

export function getLinks(editor: Editor, at: Path = []) {
  const nodes = editor.nodes<Extract<Node, { type: "Link" }>>({
    at,
    match: (node) => node.type === "Link",
  });

  const links: NodeMap["Link"][] = [];
  for (const [node] of nodes) {
    links.push({ ...node });
  }

  return links;
}
