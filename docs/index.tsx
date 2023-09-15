import lit from "litdoc/lit.ts";

/** MAIN **/

export const doc = lit();
const { md } = doc;

md`
# :icons/cube: [Litdoc](#litdoc)

Litdoc is a library for literate programming in Deno.
You are currently viewing the documentation for Litdoc,
  which is written in Litdoc itself.

> - ### :icons/border-all: [Cards](/docs/features/cards.tsx) 
>   are a simple way to group related content. 
>   Use standard Markdown syntax to create a card.

> - ### :icons/font: [Font](/docs/features/headings.tsx)

> - ### :icons/smile: [Icons](/docs/features/icons.tsx)

> - ### :icons/link: [Links](/docs/features/links.tsx)

> - ### :icons/list: [Lists](/docs/features/lists.tsx)

> - ### :icons/tag: [Tags](/docs/features/tags.tsx)

> - ### :icons/code: [Templates](/docs/features/templates.tsx)

> - ### :icons/tags: [Tokens](/docs/features/tokens.md)
`;
