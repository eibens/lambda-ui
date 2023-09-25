import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
Some Markdown.
`;

const half = 21;

const answer = 2 * half;

md`
More Markdown.
`;

md`
Even more Markdown.
`;

console.log(answer);
