import lit from "litdoc/lit";

export const doc = lit();
const { md } = doc;

md`
# :link: Links

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
`;
