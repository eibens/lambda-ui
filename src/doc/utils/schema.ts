/** HELPERS **/

type ToNodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

type BaseLeafProps = {
  text: string;
};

type BaseElementProps = {
  // Cannot use Node here because it is circular
  children: NodeMap[keyof NodeMap][];
};

type BaseInlineBlockProps = BaseElementProps & {
  isInline?: boolean;
};

/** MAIN **/

export type NodeMap = ToNodeMap<{
  // Structural nodes
  Root: BaseElementProps & {
    values: Record<string, unknown>;
  };
  Text: BaseLeafProps;

  // Inline Blocks
  // Can be marked either as inline or block element.
  // Determined by type of parent.
  Html: BaseInlineBlockProps;
  Value: BaseInlineBlockProps & {
    id: string;
  };
  Code: BaseInlineBlockProps & {
    lang?: string;
  };
  Unknown: BaseInlineBlockProps;

  // Blocks
  Paragraph: BaseElementProps;
  Blockquote: BaseElementProps;
  Heading: BaseElementProps & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
  };
  List: BaseElementProps & {
    ordered?: boolean;
  };
  ListItem: BaseElementProps & {
    icon?: string;
  };
  Image: BaseElementProps & {
    url: string;
    title?: string;
    alt?: string;
  };
  ThematicBreak: BaseElementProps;
  LinkReference: BaseElementProps & {
    label: string;
    identifier: string;
    referenceType: string;
  };
  FootnoteReference: BaseElementProps & {
    identifier: string;
    label?: string;
  };

  // Inline
  Emphasis: BaseElementProps;
  Strong: BaseElementProps;
  Delete: BaseElementProps;
  Break: BaseElementProps;
  Token: BaseElementProps;
  Link: BaseElementProps & {
    url: string;
  };
}>;

export type Nodes<NodeMap> = NodeMap[keyof NodeMap];

export type NodeType<T extends keyof NodeMap = keyof NodeMap> = T;

export type Node<T extends NodeType = NodeType> = NodeMap[T];

export type Path = number[];

export type NodeEntry<T extends NodeType = NodeType> = [Node<T>, Path];

export type Root = NodeMap["Root"];
