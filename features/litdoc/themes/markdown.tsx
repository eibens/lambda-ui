import { Node } from "slate";
import { View } from "../../theme/mod.ts";
import { ViewChildren } from "../../theme/view.tsx";
import * as Utils from "../utils/mod.ts";

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

const components: Utils.Renderers.Components<Node> = {
  root: (props) => {
    const { attributes, children } = props;
    return (
      <View
        {...attributes}
        class="prose prose-lg mx-auto"
      >
        {children}
      </View>
    );
  },
  plain: (props) => {
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
    const { attributes, children, node } = props;
    const syntax = "#".repeat(node.depth) + " ";
    return (
      <View
        {...attributes}
        id={node.slug}
        class="text-xl font-bold"
      >
        <Syntax>{syntax}</Syntax>
        {children}
      </View>
    );
  },
  code: (props) => {
    const { attributes, children, node } = props;
    return (
      <View
        {...attributes}
      >
        <Syntax>{"```" + node.lang}</Syntax>
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
    const { attributes, children, node } = props;
    const { ordered } = node;
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
    const { attributes, children, node } = props;
    const { type } = node;
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
    const { attributes, children, node } = props;
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
          {node.url}
        </View>
        <Syntax>{")"}</Syntax>
      </View>
    );
  },
  slot: (props) => {
    const { attributes, children, node } = props;
    const { id, isInline } = node;

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
  linkReference: () => {
    return <></>;
  },
};

export default components;
