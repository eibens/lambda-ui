import lit from "litdoc/lit.ts";
import * as homepage from "./index.ts";

export const doc = lit({
  assets: {
    "": homepage,
  },
  routes: {
    "/": homepage,
  },
});

const { md } = doc;

md`
# Homepage

This is a page linking to itself.

> ## [Find us here](${homepage})
`;
