import { lit } from "litdoc";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# :pen: [Litdoc](#litdoc)

Litdoc is a document generator for Deno.
You are currently viewing the documentation for Litdoc,
  which is written in Litdoc itself.
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
