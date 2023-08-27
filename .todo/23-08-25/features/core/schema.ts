type ToNodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

type ToElementMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    children: infer _;
  } ? NodeMap[K]
    : never;
};

type ToTextMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    text: string;
  } ? NodeMap[K]
    : never;
};

type ToNode<NodeMap> = NodeMap[keyof NodeMap];

type ToCustomNodeTypes<NodeMap> = {
  Node: ToNode<NodeMap>;
  Element: ToNode<ToElementMap<NodeMap>>;
  Text: ToNode<ToTextMap<NodeMap>>;
};

type BaseNodeProps = {
  // NOTE: This can be removed once there is at least one other prop.
  __unused?: never;
};

type BaseLeafProps = BaseNodeProps & {
  text: string;
};

type BaseElementProps = BaseNodeProps & {
  // Cannot use Node here because it is circular
  children: ToNode<NodeMap>[];
};

type BaseInlineBlockProps = BaseElementProps & {
  isInline?: boolean;
};

type NodeMap = ToNodeMap<{
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
  Call: BaseInlineBlockProps & {
    name: string;
    args: unknown[];
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
  Token: BaseLeafProps;
  Link: BaseElementProps & {
    url: string;
  };
}>;

/** MAIN **/

export type ToCustomTypes<Editor> = ToCustomNodeTypes<NodeMap> & {
  Editor: Editor & NodeMap["Root"];
};

export type NodeType<T extends keyof NodeMap = keyof NodeMap> = T;

export type Node<T extends NodeType = NodeType> = NodeMap[T];
