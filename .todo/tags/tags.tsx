import lit from "litdoc/lit.ts";

/** MAIN **/

export const doc = lit();
const { md } = doc;

md`
# :icons/tag: [Lit](#lit)

A lightweight mechanism for adding documentation to TypeScript files
using template literals. 
`;

md`
Tags can be created using the \`${create.name}\` function.
The returned value is a Proxy that returns a template function for each property.

> - :icons/info-circle: All common ways of accessing properties are supported,
although destructuring is the recommended way.
`;

const tags = create();
const { blue, red } = tags;

red`This is red text.`;
blue`This is blue text.`;
blue`This is blue text with ${red`red text inside`}.`;

md`
The only exception is the \`state\` property,
which is used to store the state of the template function.
`;

md`
## Typed Tags

A template function can be typed by using the generic parameter of the \`tags\` function.
`;

const types = create<{
  str: string;
  num: number;
}>();

const { str, num } = types;

str`This is a ${"string"}.`;
num`This is the number ${123}.`;

// @ts-expect-error - The str tag only accepts strings as values.
str`This is an error: ${123}.`;