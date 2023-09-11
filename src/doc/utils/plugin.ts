import { Editor, Text } from "slate";
import * as IconLists from "./icon_lists.ts";
import { override } from "./override.ts";
import type { NodeType } from "./schema.ts";
import * as Tokens from "./tokens.ts";

/** HELPERS **/

const inlineTypes: NodeType[] = [
  "Emphasis",
  "Strong",
  "Delete",
  "Link",
];

const voidTypes: NodeType[] = [
  "ThematicBreak",
  "Image",
  "Html",
  "Break",
  "FootnoteReference",
  "LinkReference",
];

const plugins = {
  types: override({
    isVoid: (_, node) => {
      const token = Tokens.parseToken(node);
      if (token) return true;
      return voidTypes.includes(node.type);
    },
    isInline: (_, node) => {
      if ("isInline" in node) return Boolean(node.isInline);
      if (inlineTypes.includes(node.type)) return true;
      return false;
    },
    normalizeNode: (editor, entry, next) => {
      const [node, path] = entry;
      if (node.type) return next();
      const isEmptyText = Text.isText(node) && editor.string(path) === "";
      const type = isEmptyText ? "Text" : "Unknown";
      editor.setNodes({ type }, { at: path });
    },
  }),
  tokens: override({
    normalizeNode: (editor, entry, next) => {
      if (!Tokens.normalizeNode(editor, entry)) return next();
    },
  }),
  iconList: override({
    normalizeNode: (editor, entry, next) => {
      if (!IconLists.normalizeNode(editor, entry)) return next();
    },
  }),
};

const middleware = [
  plugins.types,
  plugins.tokens,
  plugins.iconList,
];

/** MAIN **/

export function plugin(editor: Editor) {
  for (const plugin of middleware) {
    editor = plugin(editor);
  }
  editor.type = "Root";
  editor.normalize({ force: true });
  return editor;
}
