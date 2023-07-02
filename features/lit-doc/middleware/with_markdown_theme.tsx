import { View } from "../../theme/mod.ts";
import { ViewChildren } from "../../theme/view.tsx";
import {
  isInline,
  isVoid,
  withEditor,
  withElementComponents,
  withIsInline,
  withIsVoid,
  withLeafComponents,
} from "../mod.ts";

/** HELPERS **/

function Syntax(props: {
  children: ViewChildren;
}) {
  const { children } = props;
  return (
    <View
      tag="span"
      class="text-gray-500 font-mono"
    >
      {children}
    </View>
  );
}

export function withMarkdownTheme() {
  const editor = withEditor();

  withIsInline(isInline);

  withIsVoid(isVoid);

  withLeafComponents({
    _: (props) => {
      const { attributes, children } = props;
      return (
        <View
          {...attributes}
          tag="span"
          class="color-red fill-0"
        >
          {children}
        </View>
      );
    },
    text: (props) => {
      const { attributes, children } = props;
      return (
        <View tag="span" {...attributes}>
          {children}
        </View>
      );
    },
    inlineCode: (props) => {
      const { attributes, children } = props;
      return (
        <View tag="span" {...attributes} class="font-mono text-teal-500">
          <Syntax>{"`"}</Syntax>
          {children}
          <Syntax>{"`"}</Syntax>
        </View>
      );
    },
  });

  withElementComponents({
    _: (props) => {
      const { attributes, children, element } = props;
      const isInline = Reflect.get(element, "isInline") ?? false;
      return (
        <View
          {...attributes}
          tag={isInline ? "span" : "div"}
          class={[
            "m-2 color-red border-1 rounded-lg border-20 fill-10",
          ]}
        >
          <View class="m-2">{element.type}</View>
          {children}
        </View>
      );
    },
    root: (props) => {
      const { attributes, children } = props;
      return (
        <View
          {...attributes}
          class="flex flex-col text-md gap-8"
        >
          {children}
        </View>
      );
    },
    paragraph: (props) => {
      const { attributes, children } = props;
      return (
        <View
          {...attributes}
          class="whitespace-normal"
        >
          {children}
        </View>
      );
    },
    heading: (props) => {
      const { attributes, children, element } = props;
      const syntax = "#".repeat(element.depth) + " ";
      return (
        <View
          {...attributes}
          id={element.slug}
          class="text-xl font-bold"
        >
          <Syntax>{syntax}</Syntax>
          {children}
        </View>
      );
    },
    code: (props) => {
      const { attributes, children, element } = props;
      return (
        <View
          {...attributes}
        >
          <Syntax>{"```" + element.lang}</Syntax>
          {children}
          <Syntax>{"```"}</Syntax>
        </View>
      );
    },
    blockquote: (props) => {
      const { attributes, children } = props;
      return (
        <View
          {...attributes}
        >
          <Syntax>{"> "}</Syntax> {children}
        </View>
      );
    },
    thematicBreak: (props) => {
      const { attributes, children } = props;
      return (
        <View
          {...attributes}
        >
          <Syntax>{"---"}</Syntax>
          {children}
        </View>
      );
    },
    list: (props) => {
      const { attributes, children, element } = props;
      const { ordered } = element;
      const tag = ordered ? "ol" : "ul";
      const style = ordered ? "list-decimal" : "list-disc";
      return (
        <View
          {...attributes}
          tag={tag}
          class={[
            "ml-8 flex flex-col gap-2",
            style,
          ]}
        >
          {children}
        </View>
      );
    },
    listItem: (props) => {
      const { attributes, children, element } = props;
      const { type } = element;
      return (
        <View
          {...attributes}
          tag="li"
          type={type}
          class={[
            "flex flex-col gap-2",
          ]}
        >
          {children}
        </View>
      );
    },
    link: (props) => {
      const { attributes, children, element } = props;
      return (
        <View
          tag="span"
          {...attributes}
          class="color-blue fill-0"
        >
          <Syntax>{"["}</Syntax>
          {children}
          <Syntax>{"]"}</Syntax>
          <Syntax>{"("}</Syntax>
          <View
            tag="span"
            class="font-mono"
          >
            {element.url}
          </View>
          <Syntax>{")"}</Syntax>
        </View>
      );
    },
    slot: (props) => {
      const { attributes, children, element } = props;
      const { id, isInline } = element;

      return (
        <View
          {...attributes}
          tag={isInline ? "span" : "div"}
        >
          <Syntax>{`<slot id="${id}"/>`}</Syntax>
          {children}
        </View>
      );
    },
    emphasis: (props) => {
      const { attributes, children } = props;
      return (
        <View
          tag="span"
          {...attributes}
          class="font-italic"
        >
          <Syntax>*</Syntax>
          {children}
          <Syntax>*</Syntax>
        </View>
      );
    },
    strong: (props) => {
      const { attributes, children } = props;
      return (
        <View
          tag="span"
          {...attributes}
          class="font-bold"
        >
          <Syntax>**</Syntax>
          {children}
          <Syntax>**</Syntax>
        </View>
      );
    },
    delete: (props) => {
      const { attributes, children } = props;
      return (
        <View
          tag="span"
          {...attributes}
        >
          ~{children}~
        </View>
      );
    },
  });
}
