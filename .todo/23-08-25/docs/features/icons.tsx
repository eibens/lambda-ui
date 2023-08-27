import lit from "litdoc/lit";

export const doc = lit();
const { md } = doc;

md`
# :face-smile: Icons

Icons can be specified using the following syntax:

~~~md
Can you see the :forest: for the :park:?
~~~

> Can you see the :forest: for the :park:?

> :circle-info: This is an info icon.

> # :circle-info: Heading 1
> ## :circle-info: Heading 2
> ### :circle-info: Heading 3
> #### :circle-info: Heading 4
> ##### :circle-info: Heading 5
> ###### :circle-info: Heading 6
`;
