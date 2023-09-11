import { Value } from "./Value.tsx";
import { Link as LinkView, RenderNodeProps, Token, View } from "./deps.ts";

export function Link(props: RenderNodeProps<"Link">) {
  const { attributes, children, node } = props;

  if (node.url.startsWith("token://")) {
    if (node.url.startsWith("token:///values/")) {
      return <Value {...props} />;
    }
    return (
      <View tag="span" {...attributes}>
        <Token href={node.url} />
        {children}
      </View>
    );
  }

  return (
    <LinkView
      {...attributes}
      href={node.url}
    >
      {children}
    </LinkView>
  );
}
