import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import { NodeMap, Nodes, Root } from "./schema.ts";

/** HELPERS **/

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

type ToCustomNodeTypes<NodeMap> = {
  Node: Nodes<NodeMap>;
  Element: Nodes<ToElementMap<NodeMap>>;
  Text: Nodes<ToTextMap<NodeMap>>;
};

type ToCustomTypes<Editor> = ToCustomNodeTypes<NodeMap> & {
  Editor: Editor & Root & {
    values: Record<string, unknown>;
  };
};

/** MAIN **/

declare module "slate" {
  // deno-lint-ignore no-empty-interface
  interface CustomTypes extends ToCustomTypes<BaseEditor & ReactEditor> {}
}
