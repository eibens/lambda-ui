import lit from "litdoc/lit.ts";
import * as homepage from "./index.ts";

export const doc = lit();
const { md } = doc;

md`
# Contact

> Visit the homepage: [${homepage}]
`;
