import { RenderNodeProps } from "@litdoc/render";
import { Link as LinkView } from "@litdoc/ui";

export function Link(props: RenderNodeProps<"Link">) {
  const { attributes, children, node } = props;
  return (
    <LinkView
      {...attributes}
      href={node.url}
    >
      {children}
    </LinkView>
  );
}
