import { Link as LinkView, RenderNodeProps } from "./deps.ts";

export function LinkReference(props: RenderNodeProps<"LinkReference">) {
  const { attributes, children } = props;
  return (
    <LinkView {...attributes} href="#">
      {children}
    </LinkView>
  );
}
