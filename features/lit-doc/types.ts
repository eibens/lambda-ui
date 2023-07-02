import { BaseEditor, Element, Node, Text } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { ViewNode } from "../theme/mod.ts";

export type RootElement = {
  type: "root";
  children: Node[];
};

export type PlainText = {
  type: "text";
  text: string;
};

export type ParagraphElement = {
  type: "paragraph";
  children: CustomText[];
  isLead?: boolean;
};

export type HeadingElement = {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  slug?: string;
  children: CustomText[];
};

export type BlockquoteElement = {
  type: "blockquote";
  children: Node[];
};

export type ListElement = {
  type: "list";
  ordered?: boolean;
  children: Node[];
};

export type ListItemElement = {
  type: "listItem";
  children: Node[];
};

export type SlotElement = {
  type: "slot";
  id: string;
  isInline?: boolean;
  children: Node[];
};

export type CodeElement = {
  type: "code";
  lang?: string;
  children: Node[];
};

export type ThematicBreak = {
  type: "thematicBreak";
};

export type InlineCodeText = {
  type: "inlineCode";
  text: string;
};

export type LinkElement = {
  type: "link";
  url: string;
  children: Node[];
};

export type EmphasisElement = {
  type: "emphasis";
  children: Node[];
};

export type StrongElement = {
  type: "strong";
  children: Node[];
};

export type DeleteElement = {
  type: "delete";
  children: Node[];
};

export type CustomText =
  | PlainText
  | InlineCodeText;

export type CustomElement =
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
    Element: CustomElement;
    Text: CustomText;
  }
}

export type LitEditorMixin = {
  slots: Record<string, unknown>;
  renderElement: (props: RenderElementProps) => ViewNode;
  renderLeaf: (props: RenderLeafProps) => ViewNode;
};

export type LitEditor = ReactEditor & LitEditorMixin;

export function isElementType<T extends CustomElement["type"]>(
  node: Node,
  type: T,
): node is Extract<Element, { type: T }> {
  return Element.isElement(node) && node.type === type;
}

export function isTextType<T extends CustomText["type"]>(
  node: Node,
  type: T,
): node is Extract<CustomText, { type: T }> {
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
