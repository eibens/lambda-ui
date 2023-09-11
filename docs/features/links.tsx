import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# :icons/link: Links

Links

> [local link](#local-link) with text after
> 
> [home link](/) with text after
> 
> [top link](#top) with text after
>
> [internal link](./) with text after
> 
> [external link](https://example.com) with text after

## Sizes

> # [Heading 1](#h1)
> ## [Heading 2](#h2)
> ### [Heading 3](#h3)
> #### [Heading 4](#h4)
> ##### [Heading 5](#h5)
> ###### [Heading 6](#h6)
> [Paragraph](#p)

`;
