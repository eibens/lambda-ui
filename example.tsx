import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# Example Heading

This is an example of a litdoc document.
`;

const answer = (10 * 2 + 1) * 2;

md`
The answer to life, the universe, and everything is *${answer}*.
`;
