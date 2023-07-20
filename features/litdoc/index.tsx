import { lit } from "litdoc";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# :folder: [Litdoc](#litdoc)

Litdoc is a document generator for Deno.
You are currently viewing the documentation for Litdoc,
  which is written in Litdoc itself.
`;

md`
### Hierarchy

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

md`
### :smile-mouth-open: Icons

Icons can be specified using the following syntax:

~~~md
Can you see the forest for the :trees:?
~~~

> Can you see the forest for the :trees:?

> :info: This is an info icon.
`;
