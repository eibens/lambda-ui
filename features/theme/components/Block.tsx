import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { useSlate } from "slate-react";
import { getSpacing } from "../utils/theme.ts";

/** MAIN **/

export function Block(
  props: RenderNodeProps & {
    contentEditable?: boolean;
  },
) {
  const { attributes, children, node, contentEditable } = props;

  const editor = useSlate();
  const spacing = getSpacing(editor, node);

  return (
    <View
      {...attributes}
      {...{
        "data-slate-type": node.type,
        contentEditable,
      }}
      style={{
        marginBottom: spacing + "px",
      }}
    >
      {children}
    </View>
  );
}
