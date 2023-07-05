import { Blockquote } from "../../text/blockquote.tsx";
import { CodeBlock } from "../../text/code_block.tsx";
import { Delete } from "../../text/delete.tsx";
import { Emphasis } from "../../text/emphasis.tsx";
import { Heading } from "../../text/heading.tsx";
import { InlineCode } from "../../text/inline_code.tsx";
import { Link } from "../../text/link.tsx";
import { Paragraph } from "../../text/paragraph.tsx";
import { Strong } from "../../text/strong.tsx";
import { ThematicBreak } from "../../text/thematic_break.tsx";
import { View } from "../../theme/mod.ts";
import {
  isInline,
  isVoid,
  withEditor,
  withElementComponents,
  withIsInline,
  withIsVoid,
  withKeys,
  withLeadParagraph,
  withLeafComponents,
  withSlugs,
} from "../mod.ts";
import { withElementRenderer } from "./with_element_renderer.ts";

/** HELPERS **/

export function withBasicTheme() {
  const editor = withEditor();

  withKeys();

  withIsInline(isInline);

  withIsVoid(isVoid);

  withSlugs();

  withLeadParagraph();

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
        <InlineCode {...attributes}>
          {children}
        </InlineCode>
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
          class="flex flex-col gap-12"
        >
          {children}
        </View>
      );
    },
    paragraph: (props) => {
      const { attributes, children, element } = props;
      return (
        <Paragraph
          {...attributes}
          isLead={element.isLead}
          class="whitespace-normal"
        >
          {children}
        </Paragraph>
      );
    },
    heading: (props) => {
      const { attributes, children, element } = props;
      return (
        <Heading
          {...attributes}
          depth={element.depth}
          id={element.slug}
        >
          {children}
        </Heading>
      );
    },
    code: (props) => {
      const { attributes, children } = props;
      return (
        <CodeBlock
          {...attributes}
        >
          {children}
        </CodeBlock>
      );
    },
    blockquote: (props) => {
      const { attributes, children } = props;
      return (
        <Blockquote
          {...attributes}
        >
          {children}
        </Blockquote>
      );
    },
    thematicBreak: (props) => {
      const { attributes } = props;
      return (
        <ThematicBreak
          {...attributes}
        />
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
        <Link
          {...attributes}
          href={element.url}
        >
          {children}
        </Link>
      );
    },
    slot: (props) => {
      const { attributes, children, element } = props;
      const { id, isInline } = element;
      const slot = editor.slots?.[id];

      return (
        <View
          {...attributes}
          tag={isInline ? "span" : "div"}
        >
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
        </View>
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
  });

  // Will be applied before the component renderers.
  withElementRenderer((props, next) => {
    const { attributes, element } = props;

    const newAttributes = {
      ...attributes,
      "data-slate-type": element.type,
      "data-slate-key": element.key,
    };

    return next({
      ...props,
      attributes: newAttributes,
    });
  });
}
