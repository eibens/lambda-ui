import { BaseEditor, Element, Node, Text } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { ViewNode } from "../theme/mod.ts";

export type NodeBase = {
  key?: string;
};

export type RootElement = NodeBase & {
  type: "root";
  children: Node[];
};

export type PlainText = NodeBase & {
  type: "text";
  text: string;
};

export type ParagraphElement = NodeBase & {
  type: "paragraph";
  children: LitText[];
  isLead?: boolean;
};

export type HeadingElement = NodeBase & {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  slug?: string;
  children: LitText[];
};

export type BlockquoteElement = NodeBase & {
  type: "blockquote";
  children: Node[];
};

export type ListElement = NodeBase & {
  type: "list";
  ordered?: boolean;
  children: Node[];
};

export type ListItemElement = NodeBase & {
  type: "listItem";
  children: Node[];
};

export type SlotElement = NodeBase & {
  type: "slot";
  id: string;
  isInline?: boolean;
  children: Node[];
};

export type CodeElement = NodeBase & {
  type: "code";
  lang?: string;
  children: Node[];
};

export type ThematicBreak = NodeBase & {
  type: "thematicBreak";
};

export type InlineCodeText = NodeBase & {
  type: "inlineCode";
  text: string;
};

export type LinkElement = NodeBase & {
  type: "link";
  url: string;
  children: Node[];
};

export type EmphasisElement = NodeBase & {
  type: "emphasis";
  children: Node[];
};

export type StrongElement = NodeBase & {
  type: "strong";
  children: Node[];
};

export type DeleteElement = NodeBase & {
  type: "delete";
  children: Node[];
};

export type LitText =
  | PlainText
  | InlineCodeText;

export type LitElement =
  | RootElement
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | ListElement
  | ListItemElement
  | ThematicBreak
  | SlotElement
  | CodeElement
  | LinkElement
  | EmphasisElement
  | StrongElement
  | DeleteElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: LitElement;
    Text: LitText;
  }
}

export type LitEditorMixin = {
  slots: Record<string, unknown>;
  renderElement: (props: RenderElementProps) => ViewNode;
  renderLeaf: (props: RenderLeafProps) => ViewNode;
};

export type LitEditor = ReactEditor & LitEditorMixin;

export function isElementType<T extends LitElement["type"]>(
  node: Node,
  type: T,
): node is Extract<Element, { type: T }> {
  return Element.isElement(node) && node.type === type;
}

export function isTextType<T extends LitText["type"]>(
  node: Node,
  type: T,
): node is Extract<LitText, { type: T }> {
  return Text.isText(node) && node.type === type;
}

export function isInline(node: Element): boolean {
  if (node.type === "slot" && node.isInline) return true;
  return [
    "emphasis",
    "strong",
    "link",
    "inlineCode",
    "delete",
  ].includes(node.type);
}

export function isVoid(node: Element): boolean {
  return ["slot", "hr"].includes(node.type);
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
