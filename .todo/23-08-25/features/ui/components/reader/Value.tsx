import { RenderNodeProps } from "@litdoc/render";
import { useSlate } from "slate-react";
import { View } from "../View.tsx";

export function Value(props: RenderNodeProps<"Value">) {
  const { attributes, children, node } = props;

  const { id , isInline} = node;
  const values = useValue(id);

  const content = (
    <>
      <View
        tag={isInline ? "span" : "div"}
        contentEditable={false}
        // See https://github.com/ianstormtaylor/slate/issues/3425#issuecomment-575436724
        // This prevents error when focusing a Monaco Editor.
        // But it does not prevent error when blurring.
        data-slate-editor
      >
        <>{value}</>
      </View>
      {children}
    </>
  );

  if (isInline) {
    return (
      <View
        {...attributes}
        tag="span"
      >
        {content}
      </View>
    );
  }

  return (
    <View
      {...attributes}
      contentEditable={false}
    >
      {content}
    </View>
  );
}
