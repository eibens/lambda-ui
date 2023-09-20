import { ViewChildren } from "litdoc/components/View.tsx";
import { Litdoc } from "litdoc/lit.ts";
import { create } from "litdoc/utils/editor.ts";
import { parse } from "litdoc/utils/parse.ts";
import { Route } from "litdoc/utils/route.ts";
import { weave } from "litdoc/utils/weave.ts";
import { h, VNode } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import "slate";
import { Node } from "slate";
import { withReact } from "slate-react";

/** HELPERS **/

// TODO: Make this configurable.
const NOT_FOUND_TEMPLATE = `
# Not Found

The requested page could not be found.
`;

/** MAIN **/

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
  route: Route;
  litdoc: Litdoc;
  components: NodeComponents;
};

export function useDoc(props: DocProps) {
  const { route, litdoc, components } = props;

  const editor = useMemo(() => {
    const manifest = litdoc.doc();
    const module = manifest.assets[route.file];

    if (module !== undefined) {
      const { values } = weave({ type: "Values", module });
      return withReact(create(route.root, values));
    }

    const notFound = parse(NOT_FOUND_TEMPLATE);
    return withReact(create(notFound, {}));
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
