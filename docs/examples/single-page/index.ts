import lit from "litdoc/lit.ts";
import { server } from "litdoc/server.ts";
import * as homepage from "./index.ts";

export const doc = lit({
  url: import.meta.url,
  route: "/",
});

const { md } = doc;

md`
# Homepage

This is a page linking to itself.

> ## [Find us here](${homepage})
`;

const litdoc = server();
const route = litdoc.route(homepage, "");
const json = JSON.stringify(route, null, 2);

md`
This is a JSON representation of this page:

~~~json
${json}
~~~
`;
