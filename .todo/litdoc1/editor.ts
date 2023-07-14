import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { Doc } from "litdoc";
import {
  createEditor as createSlateEditor,
  Descendant,
  Editor,
  Element,
  Node,
  NodeEntry,
  Transforms,
} from "slate";
import * as SlateReact from "slate-react";
import { nanoid } from "../lit-doc/deps.ts";

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

export function createEditor(doc: Doc) {
  const editor = createSlateEditor();
  const { isVoid, isInline, normalizeNode } = editor;

  editor.children = doc.children as Descendant[];

  editor.isVoid = (node) => {
    return [
      "slot",
      "hr",
    ].includes(node.type) || isVoid(node);
  };

  editor.isInline = (node) => {
    if (node.type === "slot" && node.isInline) return true;
    return [
      "emphasis",
      "strong",
      "link",
      "linkReference",
      "inlineCode",
      "delete",
    ].includes(node.type) || isInline(node);
  };

  editor.normalizeNode = (entry) => {
    ensureKey(editor, entry);
    markLeadParagraphs(editor, entry);
    addSlugs(editor, entry);
    normalizeNode(entry);
  };

  return SlateReact.withReact(editor);
}
