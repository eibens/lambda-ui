import { createEditor, Editor, Node, Path, Text } from "slate";
import { ReactEditor, withReact } from "slate-react";
import { getTokens } from "./tokens.ts";
import type { LitdocEditor, Page, Root, ToCustomTypes } from "./types.ts";

/** MAIN **/

declare module "slate" {
  // deno-lint-ignore no-empty-interface
  interface CustomTypes extends ToCustomTypes<LitdocEditor & ReactEditor> {}
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

export function getPage(root: Root): Page {
  const editor = create(root);
  return {
    icon: getIcon(editor),
    title: getTitle(editor),
    description: getLead(editor),
    color: getColor(editor),
    breadcrumbs: [],
    links: {},
  };
}
