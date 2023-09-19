import { kebabCase } from "https://esm.sh/tiny-case@1.0.3";
import { Blockquote } from "litdoc/components/Blockquote.tsx";
import { Code } from "litdoc/components/Code.tsx";
import { Heading } from "litdoc/components/Heading.tsx";
import { InlineCode } from "litdoc/components/InlineCode.tsx";
import { Link } from "litdoc/components/Link.tsx";
import { ListItem } from "litdoc/components/ListItem.tsx";
import { Paragraph } from "litdoc/components/Paragraph.tsx";
import { Tag } from "litdoc/components/Tag.tsx";
import { Token } from "litdoc/components/Token.tsx";
import { View } from "litdoc/components/View.tsx";
import {
  NodeComponents,
  RenderNodeProps,
  useDoc,
} from "litdoc/hooks/use_doc.ts";
import { Root } from "litdoc/utils/schema.ts";
import "slate";
import { Node } from "slate";
import { Editable, ReactEditor, Slate, useSlate } from "slate-react";

/** HELPERS **/

function Value(props: RenderNodeProps<"Token">) {
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

const components: NodeComponents = {
  Blockquote: function (props) {
    const { attributes, children, node } = props;
    const editor = useSlate();
    const path = ReactEditor.findPath(editor, node);
    return (
      <Blockquote
        {...attributes}
        style={{
          marginBottom: editor.getSpacing(path) + "px",
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
          marginBottom: editor.getSpacing(path) + "px",
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
    const slug = kebabCase(Node.string(node));
    return (
      <Heading
        {...attributes}
        depth={node.depth}
        id={slug}
        style={{
          lineHeight: editor.getLineHeight(path) + "px",
          fontSize: editor.getFontSize(path) + "px",
          marginBottom: editor.getSpacing(path) + "px",
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
          marginBottom: editor.getSpacing(path) + "px",
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
        size={editor.getFontSize(path)}
        icon={editor.getIcon(path)}
        lineHeight={editor.getLineHeight(path)}
        indent={editor.getListIndent(path)}
        style={{
          marginBottom: editor.getSpacing(path) + "px",
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
          marginBottom: editor.getSpacing(path) + "px",
          lineHeight: editor.getLineHeight(path) + "px",
          fontSize: editor.getFontSize(path) + "px",
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
    const { attributes, children } = props;
    return (
      <View {...attributes}>
        <View
          tag="hr"
          class="border-gray-300 dark:border-gray-700"
        />
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

export type DocProps = {
  root: Root;
  values: Record<string, unknown>;
  components?: Partial<NodeComponents>;
};

export function Doc(props: DocProps) {
  const { render, editor } = useDoc({
    ...props,
    components: {
      ...components,
      ...props.components,
    },
  });

  return (
    <Slate
      editor={editor}
      initialValue={editor.children}
    >
      <Editable
        // @ts-ignore must be string to work
        spellCheck="false"
        readOnly
        renderElement={({ element, ...rest }) =>
          render({
            ...rest,
            node: element,
          })}
        renderLeaf={({ leaf, ...rest }) =>
          render({
            ...rest,
            node: leaf,
          })}
        style={{
          padding: "16px",
        }}
      />
    </Slate>
  );
}
