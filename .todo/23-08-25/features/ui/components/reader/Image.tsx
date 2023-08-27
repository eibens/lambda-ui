import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function Image(props: RenderNodeProps<"Image">) {
  const { node } = props;
  const { url, alt, title } = node;
  return (
    <Block {...props}>
      <View
        tag="img"
        src={url}
        alt={alt ?? undefined}
        title={title ?? undefined}
        class="rounded"
      />
    </Block>
  );
}
