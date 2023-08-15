import { RenderNodeProps } from "@litdoc/render";
import { View } from "@litdoc/ui";
import { Editor, Path } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { FaIcon } from "../../ui/fa_icon.tsx";
import { getListIndent } from "../utils/theme.ts";

function isListItemBullet(editor: Editor, path: Path) {
  const ancestors = Path.ancestors(path, {
    reverse: true,
  });

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
}

export function Icon(props: RenderNodeProps<"Icon">) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const path = ReactEditor.findPath(editor, node);

  const isBullet = isListItemBullet(editor, path);
  const indent = getListIndent(editor, node);

  return (
    <View
      tag="span"
      {...attributes}
      contentEditable={false}
      class="relative"
    >
      <span
        style={{
          position: isBullet ? "absolute" : "relative",
          left: isBullet ? -indent + "px" : "0",
        }}
      >
        <FaIcon name={node.name} />
      </span>
      {children}
    </View>
  );
}
