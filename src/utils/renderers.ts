import { ComponentChildren, h, VNode } from "preact";
import { Node } from "slate";

/** HELPERS **/

function fromComponent(
  render: (props: RenderNodeProps) => VNode,
): Renderer {
  return {
    renderElement: (props) => {
      const { element, ...rest } = props;
      return render({ ...rest, node: element });
    },
    renderLeaf: (props) => {
      const { leaf, ...rest } = props;
      return render({ ...rest, node: leaf });
    },
  };
}

/** MAIN **/

export type RenderNodeProps<T extends Node["type"] = Node["type"]> = {
  attributes: Record<string, unknown>;
  children: ComponentChildren;
  node: Extract<Node, { type: T }>;
};

export type RenderLeafProps = {
  attributes: Record<string, unknown>;
  children: ComponentChildren;
  leaf: Node;
};

export type RenderElementProps = {
  attributes: Record<string, unknown>;
  children: ComponentChildren;
  element: Node;
};

export type Renderer = {
  renderElement: (props: RenderElementProps) => VNode;
  renderLeaf: (props: RenderLeafProps) => VNode;
};

export type Components =
  & {
    [K in Node["type"]]: (props: RenderNodeProps<K>) => VNode;
  }
  & {
    Unknown: (props: RenderNodeProps<"Unknown">) => VNode;
  };

export function renderers(
  components: Components,
): Renderer {
  return fromComponent((props: RenderNodeProps) => {
    const { node } = props;
    const { type } = node;

    const Component = components[type as keyof typeof components] ??
      components.Unknown;

    // deno-lint-ignore no-explicit-any
    return h(Component as any, props);
  });
}
