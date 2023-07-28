import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";

export function Break(props: RenderNodeProps<"Break">) {
  return (
    <View
      tag="br"
      viewProps={props}
    />
  );
}
