import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function ThematicBreak(props: RenderNodeProps<"ThematicBreak">) {
  return (
    <Block {...props}>
      <View
        tag="hr"
        class="border-gray-300 dark:border-gray-700"
      />
    </Block>
  );
}
