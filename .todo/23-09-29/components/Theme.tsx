import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { h, VNode } from "preact";
import { Editor as EditorType, Node } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import * as Helpers from "../theme.ts";
import { Blockquote } from "./Blockquote.tsx";
import { Code } from "./Code.tsx";
import { Editor, EditorNodeProps } from "./Editor.tsx";
import { Heading } from "./Heading.tsx";
import { InlineCode } from "./InlineCode.tsx";
import { Link } from "./Link.tsx";
import { ListItem } from "./ListItem.tsx";
import { Paragraph } from "./Paragraph.tsx";
import { Tag } from "./Tag.tsx";
import { Token } from "./Token.tsx";
import { View } from "./View.tsx";

/** HELPERS **/

function Value(props: EditorNodeProps<"Token">) {
  const { attributes, children, node } = props;

  const { url } = node;

  // TODO: Find out how to do block level values (e.g. Preact widgets).
  const isInline = true;

  const { pathname } = new URL(url);
  const [_, id] = pathname.split("/").filter(Boolean);

  const editor = useSlate();
  const { values } = editor;
  const value = values[id];

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

const COMPONENTS: NodeComponents = {
  Blockquote: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    const spacing = Helpers.getSpacing(editor, path);
    return (
      <Blockquote
        {...attributes}
        style={{
          marginBottom: spacing + "px",
        }}
      >
        {children}
      </Blockquote>
    );
  },
  Break: function (props) {
    const { attributes, children } = props;
    return (
      <View tag="br" {...attributes} class="my-4">
        {children}
      </View>
    );
  },
  Code: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);

    if (node.isInline) {
      return (
        <InlineCode
          {...attributes}
        >
          {children}
        </InlineCode>
      );
    }

    return (
      <Code
        {...attributes}
        style={{
          marginBottom: Helpers.getSpacing(editor, path) + "px",
        }}
      >
        {children}
      </Code>
    );
  },
  Delete: function (props) {
    const { attributes, children } = props;
    return (
      <View
        {...attributes}
        tag="del"
        class="opacity-50"
      >
        {children}
      </View>
    );
  },
  Emphasis: function (props) {
    const { attributes, children } = props;
    return (
      <View
        {...attributes}
        tag="em"
        class="font-serif text-black dark:text-white"
      >
        {children}
      </View>
    );
  },
  FootnoteReference: function (props) {
    const { node } = props;
    const { identifier } = node;
    const url = "#" + identifier;
    const label = "[" + identifier + "]";
    return (
      <Link href={url}>
        {label}
      </Link>
    );
  },
  Heading: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    const parent = editor.parent(path);
    const isListItemChild = parent?.[0].type === "ListItem";
    const slug = kebabCase(Node.string(node));
    const icon = isListItemChild ? undefined : Helpers.getIcon(editor, path);
    return (
      <Heading
        {...attributes}
        depth={node.depth}
        id={slug}
        icon={icon}
        style={{
          lineHeight: Helpers.getLineHeight(editor, path) + "px",
          fontSize: Helpers.getFontSize(editor, path) + "px",
          marginBottom: Helpers.getSpacing(editor, path) + "px",
        }}
      >
        {children}
      </Heading>
    );
  },
  Html: function (props) {
    const { node, attributes, children } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    const isInline = editor.isInline(node);
    const value = editor.string(path, { voids: true });

    if (isInline) {
      return (
        <span
          {...attributes}
          dangerouslySetInnerHTML={{ __html: value }}
          contentEditable={false}
        />
      );
    }

    return (
      <View {...attributes} contentEditable={false}>
        <div dangerouslySetInnerHTML={{ __html: value }} />
        {children}
      </View>
    );
  },
  Image: function (props) {
    const { node, attributes, children } = props;
    const { url, alt, title } = node;
    return (
      <View {...attributes}>
        <View
          tag="img"
          src={url}
          alt={alt ?? undefined}
          title={title ?? undefined}
          class="rounded"
        />
        {children}
      </View>
    );
  },
  Link: function (props) {
    const { attributes, children, node } = props;
    return (
      <Link
        {...attributes}
        href={node.url}
      >
        {children}
      </Link>
    );
  },
  LinkReference: function (props) {
    const { attributes, children } = props;
    return (
      <Link {...attributes} href="#">
        {children}
      </Link>
    );
  },
  List: function (props) {
    const { attributes, children, node } = props;
    const { ordered } = node;
    const tag = ordered ? "ol" : "ul";
    const style = ordered ? "list-decimal" : "list-disc";
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    return (
      <View
        tag={tag}
        {...attributes}
        class={[
          "flex flex-col",
          style,
        ]}
        style={{
          marginBottom: Helpers.getSpacing(editor, path) + "px",
        }}
      >
        {children}
      </View>
    );
  },
  ListItem: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    return (
      <ListItem
        {...attributes}
        size={Helpers.getFontSize(editor, path)}
        icon={Helpers.getIcon(editor, path)}
        lineHeight={Helpers.getLineHeight(editor, path)}
        indent={Helpers.getListIndent(editor, path)}
        style={{
          marginBottom: Helpers.getSpacing(editor, path) + "px",
        }}
      >
        {children}
      </ListItem>
    );
  },
  Paragraph: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    return (
      <Paragraph
        {...attributes}
        style={{
          marginBottom: Helpers.getSpacing(editor, path) + "px",
          lineHeight: Helpers.getLineHeight(editor, path) + "px",
          fontSize: Helpers.getFontSize(editor, path) + "px",
        }}
      >
        {children}
      </Paragraph>
    );
  },
  Root: function (props) {
    const { attributes, children } = props;
    return (
      <View
        {...attributes}
      >
        {children}
      </View>
    );
  },
  Strong: function (props) {
    const { attributes, children } = props;
    return (
      <View
        {...attributes}
        tag="strong"
        class="font-serif text-black dark:text-white"
      >
        {children}
      </View>
    );
  },
  Token: function (props) {
    const { attributes, children, node } = props;

    if (node.url.startsWith("token:///values/")) {
      return <Value {...props} />;
    }

    return (
      <View tag="span" {...attributes}>
        <Token href={node.url} />
        {children}
      </View>
    );
  },
  Text: function (props) {
    const { attributes, children } = props;

    return (
      <View tag="span" {...attributes}>
        {children}
      </View>
    );
  },
  ThematicBreak: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    return (
      <View
        {...attributes}
        tag="hr"
        class="border-gray-300 dark:border-gray-700"
        style={{
          marginBottom: Helpers.getSpacing(editor, path) + "px",
        }}
      >
        {children}
      </View>
    );
  },
  Unknown: function (props) {
    const { attributes, children, node } = props;
    const { type } = node;
    return (
      <View tag="span" {...attributes}>
        <Tag color="red">
          Missing component for <b>{type}</b>
        </Tag>
        {children}
      </View>
    );
  },
};

/** MAIN **/

export type NodeComponent<T extends Node["type"] = Node["type"]> = (
  props: EditorNodeProps<T>,
) => VNode;

export type NodeComponents =
  & {
    [K in Node["type"]]?: NodeComponent<K>;
  }
  & {
    Unknown: (props: EditorNodeProps<"Unknown">) => VNode;
  };

export type ThemeProps = {
  editor: EditorType;
  components?: Partial<NodeComponents>;
};

export function Theme(props: ThemeProps) {
  const { editor, components } = props;

  const merged = {
    ...COMPONENTS,
    ...components,
  };

  const render = (props: EditorNodeProps) => {
    const { node } = props;
    const { type } = node;

    const key = type as keyof typeof components;
    const Component = merged[key] ?? merged.Unknown;

    // deno-lint-ignore no-explicit-any
    return h(Component as any, props);
  };

  return <Editor render={render} editor={editor} />;
}
