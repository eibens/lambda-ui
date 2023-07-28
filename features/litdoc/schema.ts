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

type ToCustomTypes<NodeMap> = {
  Node: ToNode<NodeMap>;
  Element: ToNode<ToElementMap<NodeMap>>;
  Text: ToNode<ToTextMap<NodeMap>>;
};

type BaseNodeProps = {
  key?: string;
};

type BaseLeafProps = BaseNodeProps & {
  text: string;
};

type BaseElementProps = BaseNodeProps & {
  // Cannot use Node here because it is circular
  children: ToNode<NodeMap>[];
};

type NodeMap = ToNodeMap<{
  // Structural nodes
  Root: BaseElementProps;
  Value: BaseElementProps & {
    id: string;
  };
  Unknown: BaseElementProps;
  Text: BaseLeafProps;

  // Custom extension
  Icon: BaseElementProps & {
    name: string;
    title?: string;
    alt?: string;
  };

  // Markdown
  Paragraph: BaseElementProps;
  Heading: BaseElementProps & {
    depth: 1 | 2 | 3 | 4 | 5 | 6;
    slug?: string;
  };
  Blockquote: BaseElementProps;
  List: BaseElementProps & {
    ordered?: boolean;
  };
  ListItem: BaseElementProps;
  Code: BaseElementProps & {
    lang?: string;
  };
  ThematicBreak: BaseElementProps;
  InlineCode: BaseLeafProps;
  Link: BaseElementProps & {
    url: string;
  };
  LinkReference: BaseElementProps & {
    label: string;
    identifier: string;
    referenceType: string;
  };
  Image: BaseElementProps & {
    url: string;
    title?: string;
    alt?: string;
  };
  Emphasis: BaseElementProps;
  Strong: BaseElementProps;
  Delete: BaseElementProps;
  FootnoteReference: BaseElementProps & {
    identifier: string;
    label?: string;
  };
  Html: BaseElementProps;
  Break: BaseElementProps;
}>;

/** MAIN **/

export type CustomNodeTypes = ToCustomTypes<NodeMap>;
