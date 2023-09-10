import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# Example Heading

This is an example of a **Litdoc** document.
`;

const answer = 7 * 3 * 2;

md`
The answer to life, the universe, and everything is \`${answer}\`.
`;
