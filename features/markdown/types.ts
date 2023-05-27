import type * as Md from "https://esm.sh/v96/@types/mdast@3.0.10/index.d.ts";

/** HELPERS **/

type BlockBase = {
  blockIndex?: number;
};

type NodeMap = {
  // TODO: Use React context for block index and other block properties.
  Block: { type: "Block"; child: Md.Content };
  Blockquote: Md.Blockquote & BlockBase;
  CodeBlock: Md.Code & BlockBase;
  Heading: Md.Heading & { id?: string } & BlockBase;
  List: Md.List & BlockBase;
  Paragraph: Md.Paragraph & BlockBase;
  Table: Md.Table & BlockBase;
  Html: Md.HTML & BlockBase & { block?: boolean };
  Slot: { type: "Slot"; id: string; value: unknown } & BlockBase;
  Break: Md.Break;
  Delete: Md.Delete;
  Emphasis: Md.Emphasis;
  FootnoteReference: Md.FootnoteReference;
  Image: Md.Image;
  InlineCode: Md.InlineCode;
  Link: Md.Link;
  LinkReference: Md.LinkReference;
  ListItem: Md.ListItem;
  Strong: Md.Strong;
  Text: Md.Text;
  ThematicBreak: Md.ThematicBreak;
  Definition: Md.Definition;
  Footnote: Md.Footnote;
  FootnoteDefinition: Md.FootnoteDefinition;
  ImageReference: Md.ImageReference;
  TableRow: Md.TableRow;
  TableCell: Md.TableCell;
  Yaml: Md.YAML;
  Root: Md.Root & { blocks: BlockNode[] };
};

/** MAIN **/

export type NodeType = keyof NodeMap;

export type BlockType =
  | "Blockquote"
  | "CodeBlock"
  | "Heading"
  | "List"
  | "Paragraph"
  | "Table"
  | "Html"
  | "Slot";

export type Node<T extends NodeType = NodeType> = NodeMap[T];

export type BlockNode = Node<BlockType>;

export type Theme<V> = {
  [K in NodeType]: (props: Node<K>) => V;
};
