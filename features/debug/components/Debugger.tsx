import { View } from "@litdoc/ui";
import { useEffect, useState } from "preact/hooks";
import { Editor, Element, Node } from "slate";

function Tag(props: {
  text: string;
  color?: string;
}) {
  return (
    <View
      tag="span"
      class={[
        "px-1 flex items-center",
        "rounded",
        "font-sans",
        "text-xs",
        "text-white",
        `color-${props.color ?? "gray"}`,
        "stroke-50 fill-10 border-1",
      ]}
    >
      {props.text}
    </View>
  );
}

function DebuggerNode(props: {
  editor: Editor;
  node: Node;
  path: number[];
}) {
  const { editor, node, path } = props;

  const depth = path.length;
  const isEditor = node === editor;
  const isElement = Element.isElement(node);
  const isInline = isElement && editor.isInline(node);
  const isLeaf = !isElement && !isEditor;
  return (
    <>
      <View
        class={[
          "color-gray fill-10 stroke-50 border-1",
          "flex",
          `ml-${4 * depth}`,
          "p-2",
          "gap-2",
          "rounded-md",
        ]}
      >
        <View class="font-sans">{node.type}</View>
        <View class="flex-1" />
        {isEditor && <Tag text="Editor" color="fuchsia" />}
        {isElement && <Tag text="Element" color="purple" />}
        {isInline && <Tag text="Inline" color="teal" />}
        {isLeaf && <Tag text="Leaf" color="green" />}
      </View>
      {"children" in node &&
        node.children.map((child, i) => (
          <DebuggerNode
            key={i}
            editor={editor}
            node={child}
            path={[...path, i]}
          />
        ))}
    </>
  );
}

export function Debugger(props: {
  editor: Editor;
}) {
  const { editor } = props;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "F9") {
        setIsVisible((prev) => !prev);
      }
    };
    addEventListener("keydown", handler);
    return () => {
      removeEventListener("keydown", handler);
    };
  });

  if (!isVisible) {
    return null;
  }

  return (
    <View
      class={[
        "flex flex-col gap-1 w-[240px]",
        "absolute",
        "right-4 top-16",
      ]}
    >
      <DebuggerNode
        editor={editor}
        node={editor}
        path={[]}
      />
    </View>
  );
}
