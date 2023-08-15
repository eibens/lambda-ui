import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Path } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { FaIcon } from "../../ui/fa_icon.tsx";

export function Icon(props: RenderNodeProps<"Icon">) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);
  // has listItem ancestor
  const ancestors = Path.ancestors(path, {
    reverse: true,
  });

  const isListItem = (() => {
    for (const ancestorPath of [path, ...ancestors]) {
      const [ancestorNode] = editor.node(ancestorPath);

      if (ancestorNode.type === "ListItem") return true;

      const index = ancestorPath[ancestorPath.length - 1];

      if (index === 0) {
        continue;
      }

      if (index !== 1) {
        return false;
      }

      const [prev] = editor.node(Path.previous(ancestorPath));
      if (prev.type !== "Text") {
        return false;
      }

      if (prev.text !== "") {
        return false;
      }
    }

    return false;
  })();

  return (
    <View
      tag="span"
      {...attributes}
      contentEditable={false}
    >
      {!isListItem && <FaIcon name={node.name} />}
      {children}
    </View>
  );
}
