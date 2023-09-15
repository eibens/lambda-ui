import { Blockquote } from "litdoc/theme/components/Blockquote.tsx";
import { Break } from "litdoc/theme/components/Break.tsx";
import { Code } from "litdoc/theme/components/Code.tsx";
import { Delete } from "litdoc/theme/components/Delete.tsx";
import { Emphasis } from "litdoc/theme/components/Emphasis.tsx";
import { FootnoteReference } from "litdoc/theme/components/FootnoteReference.tsx";
import { Heading } from "litdoc/theme/components/Heading.tsx";
import { Html } from "litdoc/theme/components/Html.tsx";
import { Image } from "litdoc/theme/components/Image.tsx";
import { Link } from "litdoc/theme/components/Link.tsx";
import { LinkReference } from "litdoc/theme/components/LinkReference.tsx";
import { List } from "litdoc/theme/components/List.tsx";
import { ListItem } from "litdoc/theme/components/ListItem.tsx";
import { Paragraph } from "litdoc/theme/components/Paragraph.tsx";
import { Root } from "litdoc/theme/components/Root.tsx";
import { Strong } from "litdoc/theme/components/Strong.tsx";
import { Text } from "litdoc/theme/components/Text.tsx";
import { ThematicBreak } from "litdoc/theme/components/ThematicBreak.tsx";
import { Unknown } from "litdoc/theme/components/Unknown.tsx";
import { renderers } from "litdoc/utils/renderers.ts";

/** MAIN **/

export function create() {
  return renderers({
    Blockquote,
    Break,
    Code,
    Delete,
    Emphasis,
    FootnoteReference,
    Heading,
    Html,
    Image,
    Link,
    LinkReference,
    List,
    ListItem,
    Paragraph,
    Root,
    Strong,
    Text,
    ThematicBreak,
    Unknown,
  });
}
