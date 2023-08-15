import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { LitdocEditor } from "litdoc";
import { ReactEditor, useSlate } from "slate-react";
import { FaIcon } from "../../ui/fa_icon.tsx";
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
  const path = ReactEditor.findPath(editor, node);
  const icon = LitdocEditor.getIcon(editor, { at: path });

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
        }}
      >
        {!icon && <FaIcon name={icon ?? "minus"} />}
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
