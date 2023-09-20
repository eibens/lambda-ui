import lit from "litdoc/lit.ts";
import * as contact from "./contact.ts";
import * as homepage from "./index.ts";
import * as sitemap from "./sitemap.ts";

export const doc = lit({
  routes: {
    "/": homepage,
    "/contact": contact,
    "/sitemap": sitemap,
  },
  assets: {
    "./contact.ts": contact,
    "./index.ts": homepage,
    "./sitemap.ts": sitemap,
  },
});

const { md } = doc;

md`
# Sitemap

> ${homepage}

> ${contact}

> ${sitemap}
`;
