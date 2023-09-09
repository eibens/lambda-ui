import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# Litdoc Example

The \`${greeting.name}\` function returns a friendly message:

Message: ${greeting()}
`;

export function greeting() {
  return "Hello, world!";
}
