import { RenderNodeProps, View } from "./deps.ts";

export function Image(props: RenderNodeProps<"Image">) {
  const { node, attributes, children } = props;
  const { url, alt, title } = node;
  return (
    <View {...attributes}>
      <View
        tag="img"
        src={url}
        alt={alt ?? undefined}
        title={title ?? undefined}
        class="rounded"
      />
      {children}
    </View>
  );
}
