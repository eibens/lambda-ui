import { View } from "litdoc/ui/mod.ts";
import { ComponentChildren, VNode } from "preact";
import { Node } from "slate";

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

export type Components = {
  [K in Node["type"]]: (props: RenderNodeProps<K>) => VNode;
};

export function fromComponent(
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

export function fromComponents(
  components: Components,
): Renderer {
  return fromComponent((props: RenderNodeProps) => {
    const { node } = props;
    const { type } = node;
    const Component = components[type as keyof typeof components];
    if (!Component) {
      console.log("Missing component for type", node);
      return (
        <View class="color-red fill-10 stroke-50" {...props.attributes}>
          {props.children}
        </View>
      );
    }
    // deno-lint-ignore no-explicit-any
    return <Component {...(props as any)} />;
  });
}
