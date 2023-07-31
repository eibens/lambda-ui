import { View } from "@litdoc/ui";
import { useSignal } from "@preact/signals";
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

function Value(props: {
  value: unknown;
}) {
  const { value } = props;
  const type = typeof value;

  if (typeof value === "string") {
    const maxLen = 20;
    const cutoff = value.length > maxLen;
    const postfix = cutoff ? "..." : "";
    const text = value.substring(0, maxLen);
    return (
      <View
        tag="span"
        class={[
          "color-cyan fill-0",
        ]}
      >
        "{text}
        {postfix}"
      </View>
    );
  }

  return (
    <View tag="span" class="color-teal fill-0 font-italic">
      {type}
    </View>
  );
}

function DebuggerProp(props: {
  name: string;
  value: unknown;
}) {
  const { name, value } = props;

  return (
    <View tag="span" class="text-xs font-mono">
      <View tag="span" class="color-gray fill-0">
        -{" "}
      </View>
      <View tag="span" class="font-mono color-teal fill-0">
        {name}
      </View>
      <View tag="span" class="font-mono color-gray fill-0">
        :{" "}
      </View>
      <View tag="span">
        <Value value={value} />
      </View>
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

  const keys = Object.keys(node)
    .filter((key) => !["children", "type", "key"].includes(key))
    .sort((a, b) => a.localeCompare(b));

  const showProps = useSignal(false);

  return (
    <>
      <View
        class={[
          "color-gray fill-10 stroke-50 border-1",
          "flex flex-col gap-2",
          `ml-${4 * depth}`,
          "p-2",
          "rounded-md",
        ]}
      >
        <View
          tag="header"
          class="flex gap-2 cursor-pointer"
          onClick={() => {
            showProps.value = !showProps.value;
          }}
        >
          <View class="font-sans">{node.type}</View>
          <View class="flex-1" />
          {isEditor && <Tag text="Editor" color="fuchsia" />}
          {isElement && <Tag text="Element" color="purple" />}
          {isInline && <Tag text="Inline" color="teal" />}
          {isLeaf && <Tag text="Leaf" color="green" />}
        </View>
        {showProps.value && keys.map((name) => (
          <DebuggerProp
            name={name}
            value={Reflect.get(node, name)}
          />
        ))}
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
        "flex flex-col gap-1 w-[320px]",
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
