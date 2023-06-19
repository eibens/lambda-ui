export type Node<
  T extends string = string,
  P = Record<PropertyKey, unknown>,
> = P & {
  type: T;
  children: Node[];
};

export type Root = Node<"Root">;

export type Slot = Node<"Slot", {
  id: string;
  value: unknown;
}>;

export type Call = Node<"Call", {
  name: string;
  args: unknown[];
}>;

export type Blockquote = Node<"Blockquote">;

export type Code = Node<"Code"> & {
  lang?: string;
};

export type Heading = Node<"Heading"> & {
  level: number;
};

export type List = Node<"List"> & {
  ordered: boolean;
  start?: number;
  spread?: boolean;
  children: Node[];
};

export type Paragraph = Node<"Paragraph">;

export type Html = Node<"Html"> & {
  value: string;
};

export type ThematicBreak = Node<"ThematicBreak">;

export type Image = Node<"Image"> & {
  url: string;
  title?: string;
  alt?: string;
};

export type Link = Node<"Link"> & {
  url: string;
  title?: string;
};

export type ListItem = Node<"ListItem">;

export type Formatted = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};
