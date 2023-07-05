import { Element } from "slate";
import { RenderElementProps } from "slate-react";
import { ViewNode } from "../../theme/mod.ts";
import { withElementRenderer } from "./with_element_renderer.ts";

export type ElementComponentProps<T> = RenderElementProps & {
  element: T;
};

export type ElementComponent<T> = (props: ElementComponentProps<T>) => ViewNode;

export function withElementComponents(
  components:
    & {
      [key in Element["type"]]?: ElementComponent<
        Extract<Element, { type: key }>
      >;
    }
    & {
      _?: ElementComponent<Element>;
    },
) {
  withElementRenderer((props, next) => {
    const { element, attributes } = props;
    const Component = components[element.type] ?? components._;
    if (!Component) return next(props);

    return (
      <Component
        {
          // deno-lint-ignore no-explicit-any
          ...props as any
        }
        attributes={attributes}
      />
    );
  });
}
