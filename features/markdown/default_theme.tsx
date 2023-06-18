import {
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
import { View, ViewChildren } from "../theme/view.tsx";
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

function Block(props: {
  children: ViewChildren;
}) {
  const { children } = props;
  return (
    <View>
      {children}
    </View>
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
  // MISC

  Root: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <>{render(children)}</>;
  },
  Slot: function (props) {
    return <>{props.value}</>;
  },

  // BLOCK

  Blockquote: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return (
      <Block>
        <Blockquote>{render(children)}</Blockquote>
      </Block>
    );
  },
  CodeBlock: function (props) {
    return (
      <Block>
        <CodeBlock>{props.value}</CodeBlock>
      </Block>
    );
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
  List: function (props) {
    const { children, ordered } = props;
    const render = useChildrenRenderer();
    return (
      <Block>
        <List ordered={ordered ?? undefined}>{render(children)}</List>
      </Block>
    );
  },
  Paragraph: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return (
      <Block>
        <Paragraph isLead={props.isLead}>{render(children)}</Paragraph>
      </Block>
    );
  },
  ThematicBreak: function (_) {
    return (
      <Block>
        <ThematicBreak />
      </Block>
    );
  },
  Break: function (_) {
    return <Break />;
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
  Image: function (props) {
    const { url, title, alt } = props;
    return (
      <Block>
        <Image
          src={url}
          alt={alt ?? undefined}
          title={title ?? undefined}
        />
      </Block>
    );
  },
  Html: function (props) {
    const { value, blockIndex } = props;
    if (blockIndex != null) {
      return (
        <Block>
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </Block>
      );
    }
    return <span dangerouslySetInnerHTML={{ __html: value }} />;
  },

  // INLINE

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
  ListItem: function (props) {
    const { children } = props;
    const render = useChildrenRenderer();
    return <ListItem>{render(children)}</ListItem>;
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
