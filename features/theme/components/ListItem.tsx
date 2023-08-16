import { RenderNodeProps } from "@litdoc/render";
import { FaIcon, View } from "@litdoc/ui";
import { useSlate } from "slate-react";
import {
  getFontSize,
  getLineHeight,
  getListIndent,
  getSpacing,
} from "../utils/theme.ts";

export function ListItem(props: RenderNodeProps<"ListItem">) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const spacing = getSpacing(editor, node);
  const size = getFontSize(editor, node);
  const lineHeight = getLineHeight(editor, node);

  return (
    <View
      {...attributes}
      tag="li"
      class={[
        "flex flex-row",
      ]}
      style={{
        marginBottom: spacing + "px",
      }}
    >
      <View
        style={{
          lineHeight: lineHeight + "px",
          fontSize: size + "px",
          width: getListIndent(editor, node) + "px",
          // NOTE: For some reason, the icon would not be aligned
          // with an icon in the body of the list item.
          // e.g. using something like: - :minus: :minus: item
          transform: "translateY(-0.053em)",
        }}
      >
        <FaIcon name={node.icon ?? "minus"} />
      </View>
      <View
        class={[
          "flex flex-col",
        ]}
      >
        {children}
      </View>
    </View>
  );
}
