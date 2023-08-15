import lit from "litdoc/lit";

export const doc = lit();
const { md } = doc;

md`
# :code: [Templates](#templates)

Templates in Litdoc can be created with template literals.
This allows interspersing text with runtime values,
which can be used to embed and generate dynamic content.

~~~ts
import { lit } from "litdoc/lit"

export const doc = lit();
const { md } = doc;

md\`
# :folder: [Litdoc](#litdoc)
\`
~~~

Strings are inlined into the template source code,
which means any Markdown formatting will also be applied.

> \`\${"plain text"}\`: ${"plain text"}
>
> \`\${"with **markdown**"}\`: ${"with **markdown**"}

Numbers are converted to strings using the default representation.

> \`\${12345}\`: ${12345}
>
> \`\${0.12345}\`: ${0.12345}


Nullish and boolean values are converted to empty strings.
This enables the use of \`||\` and \`&&\` for optional content
and reflects how React renders such values.

> \`\${null}\`: ${null}  *:arrow-left: empty*
>
> \`\${undefined}\`: ${undefined} *:arrow-left: empty*
>
> \`\${true}\`: ${true} *:arrow-left: empty*
>
> \`\${false}\`: ${false} *:arrow-left: empty*

> ### :warning: TODO

> \`\${{ type: "InlineCode", text: "some code" }}\`: ${{
  type: "InlineCode",
  text: "some code",
}}
>
> \`\${<button>html element</button>}\`: ${<button>html element</button>}
`;
