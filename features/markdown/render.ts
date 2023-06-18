import { Node, NodeType, Theme } from "./types.ts";

/** HELPERS **/

const NodeTypeMap: {
  [K in NodeType]: Node<K>["type"];
} = {
  FootnoteReference: "footnoteReference",
  InlineCode: "inlineCode",
  Blockquote: "blockquote",
  Break: "break",
  CodeBlock: "code",
  Definition: "definition",
  Delete: "delete",
  Emphasis: "emphasis",
  Footnote: "footnote",
  FootnoteDefinition: "footnoteDefinition",
  Heading: "heading",
  Html: "html",
  Image: "image",
  ImageReference: "imageReference",
  Link: "link",
  LinkReference: "linkReference",
  List: "list",
  ListItem: "listItem",
  Paragraph: "paragraph",
  Slot: "Slot",
  Strong: "strong",
  Table: "table",
  TableCell: "tableCell",
  TableRow: "tableRow",
  Text: "text",
  ThematicBreak: "thematicBreak",
  Yaml: "yaml",
  Root: "root",
};

function findNodeType(node: Node): NodeType | null {
  for (const key in NodeTypeMap) {
    if (NodeTypeMap[key as NodeType] === node.type) {
      return key as NodeType;
    }
  }
  return null;
}

/** MAIN **/

export function render<V>(node: Node, options: {
  theme: Theme<V>;
}): V {
  const {
    theme,
  } = options;

  const key = findNodeType(node);

  if (!key) {
    return node as V;
  }

  const renderNode = theme[key] as (props: unknown) => V;
  return renderNode(node);
}
