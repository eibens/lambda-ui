import { Link as LinkView, RenderNodeProps } from "./deps.ts";

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
