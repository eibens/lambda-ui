import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# :icons/face-smile: Icons

Icons can be specified using the following syntax:

~~~md
The :icons/tree: is making :icons/music:.
~~~

> The :icons/tree: is making :icons/music:.

> :icons/circle-info: This is an info icon.

> # :icons/circle-info: Heading 1
> ## :icons/circle-info: Heading 2
> ### :icons/circle-info: Heading 3
> #### :icons/circle-info: Heading 4
> ##### :icons/circle-info: Heading 5
> ###### :icons/circle-info: Heading 6
`;
