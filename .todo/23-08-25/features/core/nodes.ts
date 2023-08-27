export type ToElementMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends BaseElementProps ? NodeMap[K]
    : never;
};

export type ToLeafMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends BaseLeafProps ? NodeMap[K]
    : never;
};

export type ToNodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

export type ToNode<NodeMap> = NodeMap[keyof NodeMap];

export type CustomNodeTypes<NodeMap> = {
  Node: ToNode<NodeMap>;
  Element: ToNode<ToElementMap<NodeMap>>;
  Text: ToNode<ToLeafMap<NodeMap>>;
};

export type BaseLeafProps = {
  text: string;
};

export type BaseElementProps<Node = any> = {
  children: Node[];
};

export type BaseInlineBlockProps<NodeMap> = BaseElementProps<NodeMap> & {
  isInline?: boolean;
};
