import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Block } from "./Block.tsx";

export function Heading(props: RenderNodeProps<"Heading">) {
  const { children, node } = props;

  const { depth } = node;

  const i = depth - 1;
  const mt = [16, 12, 8, 4, 2, 0][i];
  const s = [8, 6, 4, 3, 2, 1][i] * 4 + 16;
  const h = [1, 2, 3, 4, 5, 6][i];
  const font = "font-bold";
  const H = `h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Block {...props}>
      <View
        tag={H}
        id={node.slug}
        class={[
          "font-sans",
          `text-[${s}px] ${font}`,
        ]}
      >
        {children}
      </View>
    </Block>
  );
}
