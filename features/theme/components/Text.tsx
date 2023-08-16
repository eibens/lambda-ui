import { RenderNodeProps } from "@litdoc/render";
import { Span } from "@litdoc/ui";

export function Text(props: RenderNodeProps<"Text">) {
  const { attributes, children } = props;

  return (
    <Span {...attributes}>
      {children}
    </Span>
  );
}
