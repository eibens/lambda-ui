export type ToNodeMap<PropMap> = {
  [K in keyof PropMap]: {
    type: K;
  } & PropMap[K];
};

export type ToElementMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    children: infer _;
  } ? NodeMap[K]
    : never;
};

export type ToTextMap<NodeMap> = {
  [K in keyof NodeMap]: NodeMap[K] extends {
    text: string;
  } ? NodeMap[K]
    : never;
};

export type ToNode<NodeMap> = NodeMap[keyof NodeMap];

export type ToCustomTypes<NodeMap> = {
  Element: ToNode<ToElementMap<NodeMap>>;
  Text: ToNode<ToTextMap<NodeMap>>;
};
