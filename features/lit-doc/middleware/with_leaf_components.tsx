import { Text } from "slate";
import { RenderLeafProps } from "slate-react";
import { ViewNode } from "../../theme/mod.ts";
import { withLeafRenderer } from "./with_leaf_renderer.ts";

export type LeafComponentProps<T> = RenderLeafProps & {
  leaf: T;
};

export type LeafComponent<T> = (props: LeafComponentProps<T>) => ViewNode;

export function withLeafComponents(
  components:
    & {
      [key in Text["type"]]?: LeafComponent<
        Extract<Text, { type: key }>
      >;
    }
    & {
      _?: LeafComponent<Element>;
    },
) {
  withLeafRenderer((props, next) => {
    const { leaf, attributes } = props;
    const Component = components[leaf.type] ?? components._;
    if (!Component) return next();

    const newAttributes = {
      ...attributes,
      "data-slate-type": leaf.type,
    };

    return (
      <Component
        {
          // deno-lint-ignore no-explicit-any
          ...props as any
        }
        attributes={newAttributes}
      />
    );
  });
}
