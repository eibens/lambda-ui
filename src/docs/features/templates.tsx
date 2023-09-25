import lit from "litdoc/lit.ts";

export const doc = lit();
const { md } = doc;

md`
# :icons/code: [Templates](#templates)

Templates in Litdoc can be created with template literals.
This allows interspersing text with runtime values,
which can be used to embed and generate dynamic content.

~~~ts
import { lit } from "litdoc/lit"

export const doc = lit();
const { md } = doc;

md\`
# :icons/folder: [Litdoc](#litdoc)
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

> \`\${null}\`: ${null}  *:icons/arrow-left: empty*
>
> \`\${undefined}\`: ${undefined} *:icons/arrow-left: empty*
>
> \`\${true}\`: ${true} *:icons/arrow-left: empty*
>
> \`\${false}\`: ${false} *:icons/arrow-left: empty*

> ### :warning: TODO

> \`\${{ type: "InlineCode", text: "some code" }}\`: ${{
  type: "Code",
  isInline: true,
  children: [{ type: "Text", text: "some code" }],
}}
>
> \`\${<button>html element</button>}\`: ${<button>html element</button>}
`;
