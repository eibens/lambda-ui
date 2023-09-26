import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# :^icons/font: Headings

> # Heading 1
> ## Heading 2
> ### Heading 3
> #### Heading 4
> ##### Heading 5
> ###### Heading 6
> Paragraph.
> - List item
> - List item
> - List item
`;
