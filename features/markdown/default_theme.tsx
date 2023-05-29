import {
  Block,
  Blockquote,
  Break,
  CodeBlock,
  Delete,
  Emphasis,
  Heading,
  Image,
  InlineCode,
  Link,
  List,
  ListItem,
  Paragraph,
  Strong,
  ThematicBreak,
} from "../text/mod.ts";
import { ViewFragment, ViewNode } from "../theme/mod.ts";
import type { Node, Theme } from "./types.ts";
import { useMarkdownRenderer } from "./use_markdown_renderer.ts";

/** HELPERS **/

function Unknown(props: {
  type: string;
}) {
  const { type } = props;
  return (
    <div
      style={{
        color: "red",
        textDecoration: "underline",
      }}
    >
      Unknown node type: {type}
    </div>
  );
}

function useChildrenRenderer() {
  const render = useMarkdownRenderer();
  return (children: Node[]) => (
    <>
      {children.map((child, i) => (
        <ViewFragment key={i}>{render(child)}</ViewFragment>
      ))}
    </>
  );
}

/** MAIN **/

export const DefaultTheme: Theme<ViewNode> = {
  Root: function (props) {
    const { blocks } = props;
    const render = useChildrenRenderer();
    return <>{render(blocks)}</>;
  },
  Block: function (props) {
    const { child } = props;
    const render = useMarkdownRenderer();
    return <Block>{render(child)}</Block>;
  },
  Blockquote: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <Blockquote>{render(children)}</Blockquote>;
  },
  Break: function (_) {
    return <Break />;
  },
  CodeBlock: function (props) {
    return <CodeBlock>{props.value}</CodeBlock>;
  },
  Delete: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <Delete>{render(children)}</Delete>;
  },
  Emphasis: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <Emphasis>{render(children)}</Emphasis>;
  },
  FootnoteReference: function (props) {
    const { identifier } = props;
    const url = "#" + identifier;
    const label = "[" + identifier + "]";
    return <Link href={url}>{label}</Link>;
  },
  Heading: function (props) {
    const { id, depth, children, blockIndex } = props;
    const render = useChildrenRenderer();
    return (
      <Heading
        id={id}
        blockIndex={blockIndex}
        depth={depth}
      >
        {render(children)}
      </Heading>
    );
  },
  Html: function (props) {
    const { value, block } = props;
    const Tag = block ? "div" : "span";
    return (
      <Tag
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  },
  Slot: function (props) {
    return <>{props.value}</>;
  },
  Image: function (props) {
    const { url, title, alt } = props;
    return (
      <Image
        src={url}
        alt={alt ?? undefined}
        title={title ?? undefined}
      />
    );
  },
  InlineCode: function (props) {
    const { value } = props;
    return <InlineCode>{value}</InlineCode>;
  },
  Link: function (props) {
    const { url, children } = props;
    const render = useChildrenRenderer();
    return <Link href={url}>{render(children)}</Link>;
  },
  LinkReference: function (props) {
    const { identifier, children } = props;
    const render = useChildrenRenderer();
    return <Link href={identifier}>{render(children)}</Link>;
  },
  List: function (props) {
    const { children, ordered } = props;
    const render = useChildrenRenderer();
    return <List ordered={ordered ?? undefined}>{render(children)}</List>;
  },
  ListItem: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <ListItem>{render(children)}</ListItem>;
  },
  Paragraph: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <Paragraph>{render(children)}</Paragraph>;
  },
  Strong: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <Strong>{render(children)}</Strong>;
  },
  Text: function (props) {
    const { value } = props;
    return <>{value}</>;
  },
  ThematicBreak: function (_) {
    return <ThematicBreak />;
  },

  // TODO: implement these
  Definition: function (_) {
    return <Unknown type="Definition" />;
  },
  Footnote: function (_) {
    return <Unknown type="Footnote" />;
  },
  FootnoteDefinition: function (_) {
    return <Unknown type="FootnoteDefinition" />;
  },
  ImageReference: function (_) {
    return <Unknown type="ImageReference" />;
  },
  Table: function (_) {
    return <Unknown type="Table" />;
  },
  TableRow: function (_) {
    return <Unknown type="TableRow" />;
  },
  TableCell: function (_) {
    return <Unknown type="TableCell" />;
  },
  Yaml: function (_) {
    return <Unknown type="Yaml" />;
  },
};
