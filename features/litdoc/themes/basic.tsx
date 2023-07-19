import { View } from "@/features/theme/view.tsx";
import { Code } from "@/features/widgets/code.tsx";
import { Icon } from "@/features/widgets/icon.tsx";
import {
  Blockquote,
  Delete,
  Emphasis,
  Heading,
  InlineCode,
  Link,
  Paragraph,
  Strong,
  ThematicBreak,
} from "@lambda-ui/text";
import { Node } from "slate";
import { useSlate } from "slate-react";
import { Components, RenderNodeProps } from "../utils/renderers.tsx";

/** HELPERS **/

function getSpacing(a?: Node, b?: Node) {
  if (!a || !b) return 0;
  if (b.type === "heading") return 24;

  if (a.type === "list" && b.type === "paragraph") return 3;
  if (a.type === "paragraph" && b.type === "list") return 3;
  if (a.type === "list" && b.type === "listItem") return 3;
  if (a.type === "listItem" && b.type === "list") return 3;

  if (a.type !== b.type) return 12;
  return 3;
}

function Block(props: RenderNodeProps<Node>) {
  const { attributes, children, node } = props;

  const editor = useSlate();
  const path = editor.lookup(node.key)!;
  const next = editor.next({ at: path });
  const spacing = getSpacing(node, next?.[0]);

  return (
    <View
      {...attributes}
      {...{
        "data-slate-type": node.type,
        "data-slate-key": node.key,
      }}
    >
      {children}
      {next && (
        <View
          contentEditable={false}
          class={[
            "flex",
            `h-${spacing}`,
          ]}
        />
      )}
    </View>
  );
}

const components: Components<Node> = {
  root: (props) => {
    const { attributes, children } = props;
    return (
      <View
        {...attributes}
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
      <InlineCode {...attributes}>
        {children}
      </InlineCode>
    );
  },
  paragraph: (props) => {
    const { children, node } = props;

    const editor = useSlate();
    const path = editor.lookup(node.key)!;
    const prev = editor.previous({ at: path });

    const isLead = prev && prev[0].type === "heading" && prev[0].depth === 1;

    return (
      <Block {...props}>
        <Paragraph
          isLead={isLead}
          class="whitespace-normal"
        >
          {children}
        </Paragraph>
      </Block>
    );
  },
  heading: (props) => {
    const { children, node } = props;
    return (
      <Block {...props}>
        <Heading
          depth={node.depth}
          id={node.slug}
        >
          {children}
        </Heading>
      </Block>
    );
  },
  icon: (props) => {
    const { attributes, children, node } = props;
    return (
      <View tag="span" {...attributes}>
        <Icon
          name={node.name}
        />
        {children}
      </View>
    );
  },
  code: (props) => {
    const { children, node } = props;

    const editor = useSlate();
    const path = editor.lookup(node.key)!;
    const value = editor.string(path, { voids: true });

    return (
      <Block {...props}>
        <Code
          lang={node.lang}
          value={value}
          readOnly
        />
        {children}
      </Block>
    );
  },
  blockquote: (props) => {
    const { children } = props;
    return (
      <Block {...props}>
        <Blockquote>
          {children}
        </Blockquote>
      </Block>
    );
  },
  thematicBreak: (props) => {
    const { attributes } = props;
    return (
      <Block {...props}>
        <ThematicBreak />
      </Block>
    );
  },
  list: (props) => {
    const { children, node } = props;
    const { ordered } = node;
    const tag = ordered ? "ol" : "ul";
    const style = ordered ? "list-decimal" : "list-disc";
    return (
      <Block {...props}>
        <View
          tag={tag}
          class={[
            "ml-8 flex flex-col",
            style,
          ]}
        >
          {children}
        </View>
      </Block>
    );
  },
  listItem: (props) => {
    const { attributes, children, node } = props;
    return (
      <Block {...props}>
        <View
          {...attributes}
          tag="li"
        >
          <View
            class={[
              "flex flex-col",
            ]}
          >
            {children}
          </View>
        </View>
      </Block>
    );
  },
  link: (props) => {
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
  linkReference: (props) => {
    const { attributes, children } = props;
    return (
      <Link {...attributes} href="#">
        {children}
      </Link>
    );
  },
  slot: (props) => {
    const { attributes, children, node } = props;
    const { id, isInline } = node;
    const editor = useSlate();
    const slot = editor.slots?.[id];

    const content = (
      <>
        <View
          tag={isInline ? "span" : "div"}
          contentEditable={false}
          // See https://github.com/ianstormtaylor/slate/issues/3425#issuecomment-575436724
          // This prevents error when focusing a Monaco Editor slot.
          // But it does not prevent error when blurring.
          data-slate-editor
        >
          <>{slot}</>
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
      <Block {...props}>
        {content}
      </Block>
    );
  },
  emphasis: (props) => {
    const { attributes, children } = props;
    return (
      <Emphasis {...attributes}>
        {children}
      </Emphasis>
    );
  },
  strong: (props) => {
    const { attributes, children } = props;
    return (
      <Strong {...attributes}>
        {children}
      </Strong>
    );
  },
  delete: (props) => {
    const { attributes, children } = props;
    return (
      <Delete {...attributes}>
        {children}
      </Delete>
    );
  },
};

export default components;
