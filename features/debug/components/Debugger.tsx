import { Button, FaIcon, View } from "@litdoc/ui";
import { useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { Editor, Element, Node, Range } from "slate";
import { ObjectValue } from "./ObjectValue.tsx";
import { Tag } from "./Tag.tsx";

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
  const isEmptyText = !isElement && editor.string(path) === "";
  const isVoid = isElement && editor.isVoid(node);
  const showProps = useSignal(false);
  const isSelected = !isEditor && editor.selection &&
    Range.includes(editor.selection, path);

  return (
    <>
      <View
        class={[
          isSelected ? "color-blue" : "color-gray",
          "fill-10",
          "flex flex-col gap-2",
          `ml-${4 * depth}`,
          "p-2",
          "rounded-md",
        ]}
      >
        <View
          tag="header"
          class="flex gap-2 cursor-pointer items-center"
          onClick={() => {
            showProps.value = !showProps.value;
          }}
        >
          <View class="font-sans">{node.type}</View>
          <View class="flex-1" />
          {isElement && <Tag text={"Children: " + node.children.length} />}
          {isEditor && <Tag text="Editor" color="fuchsia" />}
          {isElement && <Tag text="Element" color="purple" />}
          {isInline && <Tag text="Inline" color="teal" />}
          {isLeaf && <Tag text="Leaf" color="green" />}
          {isVoid && <Tag text="Void" color="blue" />}
          {isEmptyText && <Tag text="Empty" color="cyan" />}
          <Button
            label="Select"
            tint
            size="xs"
            onClick={(event: Event) => {
              event.stopPropagation();
              editor.select(path);
            }}
          />
          <Button
            icon={<FaIcon name="trash" />}
            tint
            size="xs"
            onClick={(event: Event) => {
              editor.removeNodes({ at: path });
            }}
          />
        </View>
        {showProps.value && <ObjectValue value={node} />}
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

  const [_, setVersion] = useState(0);

  useEffect(() => {
    let running = true;
    const { onChange } = editor;
    editor.onChange = () => {
      if (running) {
        setVersion((prev) => prev + 1);
      }
      onChange();
    };
    return () => {
      running = false;
    };
  }, [editor]);

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
        "flex flex-col gap-1 w-[420px]",
        "fixed",
        "right-0 top-0 bottom-0",
        "overflow-scroll",
        "p-2",
      ]}
    >
      <View class="p-2 color-gray rounded-md fill-10">
        <ObjectValue
          value={{
            "anchor.path": editor.selection?.anchor.path.join("."),
            "anchor.offset": editor.selection?.anchor.offset,
            "focus.path": editor.selection?.focus.path.join("."),
            "focus.offset": editor.selection?.focus.offset,
          }}
        />
      </View>
      <DebuggerNode
        editor={editor}
        node={editor}
        path={[]}
      />
    </View>
  );
}
