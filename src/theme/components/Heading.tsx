import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import {
  getFontSize,
  getLineHeight,
  getSpacing,
  Node,
  RenderNodeProps,
  useSlate,
  View,
} from "./deps.ts";

export function Heading(props: RenderNodeProps<"Heading">) {
  const { attributes, children, node } = props;

  const { depth } = node;

  const i = depth - 1;
  const h = [1, 2, 3, 4, 5, 6][i];
  const H = `h${h}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  const editor = useSlate();
  const size = getFontSize(editor, node);
  const spacing = getSpacing(editor, node);
  const lineHeight = getLineHeight(editor, node);
  const slug = kebabCase(Node.string(node));

  return (
    <View
      {...attributes}
      tag={H}
      id={slug}
      class={[
        "font-sans font-bold",
      ]}
      style={{
        lineHeight: lineHeight + "px",
        fontSize: size + "px",
        marginBottom: spacing + "px",
      }}
    >
      {children}
    </View>
  );
}
