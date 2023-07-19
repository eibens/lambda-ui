import { View } from "@/features/theme/view.tsx";
import { ComponentChildren, VNode } from "preact";

export type RenderNodeProps<Node> = {
  attributes: Record<string, unknown>;
  children: ComponentChildren;
  node: Node;
};

export type RenderLeafProps<Node> = {
  attributes: Record<string, unknown>;
  children: ComponentChildren;
  leaf: Node;
};

export type RenderElementProps<Node> = {
  attributes: Record<string, unknown>;
  children: ComponentChildren;
  element: Node;
};

export type Components<Node extends { type: string }> = {
  [K in Node["type"]]: (
    props: RenderNodeProps<Node extends { type: K } ? Node : never>,
  ) => VNode;
};

export type Renderers<Node> = {
  renderElement: (props: RenderElementProps<Node>) => VNode;
  renderLeaf: (props: RenderLeafProps<Node>) => VNode;
};

export function fromRenderer<Node>(
  render: (props: RenderNodeProps<Node>) => VNode,
): Renderers<Node> {
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

export function fromComponents<
  Node extends {
    type: string;
  },
>(
  components: Components<Node>,
): Renderers<Node> {
  return fromRenderer((props: RenderNodeProps<Node>) => {
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
