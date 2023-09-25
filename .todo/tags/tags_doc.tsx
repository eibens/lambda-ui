import lit from "litdoc/lit.ts";
import { create } from "litdoc/utils/tags.ts";

export const doc = lit();
const { md } = doc;

md`
# Tags

This module exports a \`${create.name}\` function,
which returns a tags object.
`;

const tags = create();

md`
Any property on the tags object can be used as a template tag.
`;

const { red, green } = tags;

md`
Using a tag function adds an entry to the internal state of the tags object.
`;

red`apple`;
green`grape`;

md`
The state can be accessed by invoking the tags object as a function.
`;

const state = tags();

md`
~~~json
${JSON.stringify(state, null, 2)}
~~~
`;

md`
## Typed Tags

A template function can be typed 
by using the generic parameter of the \`tags\` function.
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
