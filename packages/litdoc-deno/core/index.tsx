import lit from "litdoc/lit.ts";

export const _doc = lit();
const { _md } = _doc;

const version = "0.0.0";

_md`
# Litdoc

A TypeScript library for building rich websites and documentation.

## Example

This is a TypeScript module that serves as the input for our website.
It exports a greeting function, and a \`doc\` object that contains
documentation for the module.

[Litdoc Page Example](?embed=example/index.tsx)

In order to transform the documentation into a pretty website,
it first needs to be parsed.

:./example/parse.ts?embed:
`;

_md`
## Usage

Add the following entry to your import map:

~~~json
{
  "imports": {
    "litdoc/": "https://deno.land/x/litdoc@${version}/"
  }
}
~~~
`;
