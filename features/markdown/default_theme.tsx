import { ViewNode } from "../theme/mod.ts";
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
import type { Theme } from "./types.ts";
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

/** MAIN **/

export const DefaultTheme: Theme<ViewNode> = {
  Root: function (props) {
    const { blocks } = props;
    const render = useMarkdownRenderer();
    return <>{blocks.map(render)}</>;
  },
  Block: function (props) {
    const { child } = props;
    const render = useMarkdownRenderer();
    return <Block>{render(child)}</Block>;
  },
  Blockquote: function (props) {
    const { children } = props;
    const render = useMarkdownRenderer();
    return <Blockquote>{children.map(render)}</Blockquote>;
  },
  Break: function (_) {
    return <Break />;
  },
  CodeBlock: function (props) {
    return <CodeBlock>{props.value}</CodeBlock>;
  },
  Delete: function (props) {
    const { children } = props;
    const render = useMarkdownRenderer();
    return <Delete>{children.map(render)}</Delete>;
  },
  Emphasis: function (props) {
    const { children } = props;
    const render = useMarkdownRenderer();
    return <Emphasis>{children.map(render)}</Emphasis>;
  },
  FootnoteReference: function (props) {
    const { identifier } = props;
    const url = "#" + identifier;
    const label = "[" + identifier + "]";
    return <Link href={url}>{label}</Link>;
  },
  Heading: function (props) {
    const { id, depth, children, blockIndex } = props;
    const render = useMarkdownRenderer();
    return (
      <Heading
        id={id}
        blockIndex={blockIndex}
        depth={depth}
      >
        {children.map(render)}
      </Heading>
    );
  },
  Html: function (props) {
    const { value } = props;
    return (
      <div
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
    const render = useMarkdownRenderer();
    return <Link href={url}>{children.map(render)}</Link>;
  },
  LinkReference: function (props) {
    const { identifier, children } = props;
    const render = useMarkdownRenderer();
    return <Link href={identifier}>{children.map(render)}</Link>;
  },
  List: function (props) {
    const { children, ordered } = props;
    const render = useMarkdownRenderer();
    return <List ordered={ordered ?? undefined}>{children.map(render)}</List>;
  },
  ListItem: function (props) {
    const { children } = props;
    const render = useMarkdownRenderer();
    return <ListItem>{children.map(render)}</ListItem>;
  },
  Paragraph: function (props) {
    const { children } = props;
    const render = useMarkdownRenderer();
    return <Paragraph>{children.map(render)}</Paragraph>;
  },
  Strong: function (props) {
    const { children } = props;
    const render = useMarkdownRenderer();
    return <Strong>{children.map(render)}</Strong>;
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
