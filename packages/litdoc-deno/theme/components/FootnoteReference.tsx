import { Link as LinkView, RenderNodeProps } from "./deps.ts";

export function FootnoteReference(
  props: RenderNodeProps<"FootnoteReference">,
) {
  const { node } = props;
  const { identifier } = node;
  const url = "#" + identifier;
  const label = "[" + identifier + "]";
  return (
    <LinkView
      href={url}
    >
      {label}
    </LinkView>
  );
}
