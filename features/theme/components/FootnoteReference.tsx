import { RenderNodeProps } from "@litdoc/render";
import { Link as LinkView } from "@litdoc/ui";

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
