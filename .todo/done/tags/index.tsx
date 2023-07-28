import { tags as lit } from "@litdoc/tags";

/** MAIN **/

export const doc = lit();
const { md } = doc;

md`
# :folder: [Tags](#tags)

Tags are a way of adding documentation to TypeScript code.
`;

md`
Tags can be created using the \`tags\` function.
`;

import { tags } from "@litdoc/tags";

const colors = tags();

const { blue } = colors;
const red = colors["r" + "ed"];

red`This is red text.`;
blue`This is blue text.`;
blue`This is blue text with ${red`red text inside`}.`;

md`
## Typed Tags

A template function can be typed by using the generic parameter of the \`tags\` function.
`;

const types = tags<{
  str: string;
  num: number;
}>();

const { str, num } = types;

str`This is a ${"string"}.`;
num`This is the number ${123}.`;

// @ts-expect-error - The str tag only accepts strings as values.
str`This is an error: ${123}.`;

md`
## Middleware (TODO)

A middleware can be used to modify the behavior of the template function.

~~~ts
tags({
  foo: (context, next) => {
    console.log("Foo got called");
    next();
  },
  bar: (context, next) => {
    console.log("Bar got called");
    next();
  },
});
~~~
`;
