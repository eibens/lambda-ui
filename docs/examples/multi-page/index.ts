import lit from "litdoc/lit.ts";
import * as contact from "./contact.ts";
import * as sitemap from "./sitemap.ts";

export const doc = lit();
const { md } = doc;

md`
# Homepage

> Find stuff: [${sitemap}]

> Find us: [${contact}]
`;
