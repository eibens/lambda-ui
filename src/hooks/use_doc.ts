import { ViewChildren } from "litdoc/components/View.tsx";
import { create } from "litdoc/utils/editor.ts";
import { Root } from "litdoc/utils/schema.ts";
import { h, VNode } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import "slate";
import { Node } from "slate";
import { withReact } from "slate-react";

export type NodeComponent<T extends Node["type"] = Node["type"]> = (
  props: RenderNodeProps<T>,
) => VNode;

export type NodeComponents =
  & {
    [K in Node["type"]]?: NodeComponent<K>;
  }
  & {
    Unknown: (props: RenderNodeProps<"Unknown">) => VNode;
  };

export type RenderNodeProps<T extends Node["type"] = Node["type"]> = {
  attributes: Record<string, unknown>;
  children: ViewChildren;
  node: Extract<Node, { type: T }>;
};

export type DocProps = {
  root: Root;
  values: Record<string, unknown>;
  components: NodeComponents;
};

export function useDoc(props: DocProps) {
  const { root, values, components } = props;

  const editor = useMemo(() => {
    return withReact(create(root, values));
  }, []);

  const render = useCallback((props: RenderNodeProps) => {
    const { node } = props;
    const { type } = node;

    const Component = components[type as keyof typeof components] ??
      components.Unknown;

    // deno-lint-ignore no-explicit-any
    return h(Component as any, props);
  }, [components]);

  return {
    render,
    editor,
  };
}
