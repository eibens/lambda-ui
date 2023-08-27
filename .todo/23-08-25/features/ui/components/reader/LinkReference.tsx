import { RenderNodeProps } from "@litdoc/render";
import { Link as LinkView } from "@litdoc/ui";

export function LinkReference(props: RenderNodeProps<"LinkReference">) {
  const { attributes, children } = props;
  return (
    <LinkView {...attributes} href="#">
      {children}
    </LinkView>
  );
}
