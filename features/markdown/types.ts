import type * as Md from "https://esm.sh/v96/@types/mdast@3.0.10/index.d.ts";

/** HELPERS **/

type BlockBase = {
  blockIndex?: number;
};

type NodeMap = {
  // MISC
  Root: Md.Root;
  Slot: { type: "Slot"; id: string; value: unknown } & BlockBase;
  Yaml: Md.YAML;

  // BLOCK
  Blockquote: Md.Blockquote & BlockBase;
  CodeBlock: Md.Code & BlockBase;
  Heading: Md.Heading & { id?: string } & BlockBase;
  List: Md.List & BlockBase;
  Paragraph: Md.Paragraph & BlockBase & { isLead?: boolean };
  Table: Md.Table & BlockBase;
  Html: Md.HTML & BlockBase;
  ThematicBreak: Md.ThematicBreak;

  // INLINE
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
  Definition: Md.Definition;
  Footnote: Md.Footnote;
  FootnoteDefinition: Md.FootnoteDefinition;
  ImageReference: Md.ImageReference;
  TableRow: Md.TableRow;
  TableCell: Md.TableCell;
};

/** MAIN **/

export type NodeType = keyof NodeMap;

export type Node<T extends NodeType = NodeType> = NodeMap[T];

export type Theme<V> = {
  [K in NodeType]: (props: Node<K>) => V;
};
