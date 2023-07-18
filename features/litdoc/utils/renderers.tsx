import { View } from "@/features/theme/view.tsx";
import { ComponentChildren, JSX } from "preact";

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
  ) => JSX.Element;
};

export type Renderers<Node> = {
  renderElement: (props: RenderElementProps<Node>) => JSX.Element;
  renderLeaf: (props: RenderLeafProps<Node>) => JSX.Element;
};

export function create<
  Node extends {
    type: string;
  },
>(
  components: Components<Node>,
): Renderers<Node> {
  function renderNode(props: RenderNodeProps<Node>) {
    const { node } = props;
    const { type } = node;
    const Component = components[type as keyof typeof components];
    if (!Component) {
      console.log("Missing component for type", node);
      return (
        <View class="color-fuchsia" {...props.attributes}>
          {props.children}
        </View>
      );
    }
    // deno-lint-ignore no-explicit-any
    return <Component {...(props as any)} />;
  }

  return {
    renderElement: (props) => {
      const { element, ...rest } = props;
      return renderNode({ ...rest, node: element });
    },
    renderLeaf: (props) => {
      const { leaf, ...rest } = props;
      return renderNode({ ...rest, node: leaf });
    },
  };
}
