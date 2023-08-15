import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { LitdocEditor } from "litdoc";
import { Editor, Node } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { FaIcon } from "../../ui/fa_icon.tsx";
import { getFontSize, getLineHeight, getSpacing } from "../utils/theme.ts";

function getIconSize(editor: Editor, node: Node) {
  const path = ReactEditor.findPath(editor, node);
  // check
}

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
        "flex flex-row gap-4",
      ]}
      style={{
        marginBottom: spacing + "px",
      }}
    >
      <View
        {...attributes}
        tag="p"
        class={[
          "text-gray-700 dark:text-gray-300",
          "whitespace-normal",
        ]}
        style={{
          lineHeight: lineHeight + "px",
          fontSize: size + "px",
        }}
      >
        <FaIcon name={icon ?? "minus"} />
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
