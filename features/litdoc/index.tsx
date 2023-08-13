import lit from "litdoc/lit";

export const doc = lit();
const { md } = doc;

md`
# :folder: [Litdoc](#litdoc)

Litdoc is a document generator for Deno.
You are currently viewing the documentation for Litdoc,
  which is written in Litdoc itself.
`;

md`
## [Templates](#templates)

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

> \`\${null}\`: ${null}  *:arrow_left_alt: empty*
>
> \`\${undefined}\`: ${undefined} *:arrow_left_alt: empty*
>
> \`\${true}\`: ${true} *:arrow_left_alt: empty*
>
> \`\${false}\`: ${false} *:arrow_left_alt: empty*

> ### :warning: TODO

> \`\${{ type: "InlineCode", text: "some code" }}\`: ${{
  type: "InlineCode",
  text: "some code",
}}
>
> \`\${<button>html element</button>}\`: ${<button>html element</button>}


`;

md`
### Hierarchy

> # Heading 1
> ## Heading 2
> ### Heading 3
> #### Heading 4
> ##### Heading 5
> ###### Heading 6
> Paragraph.
> - List item
> - List item
> - List item
`;

const t = "This is placeholder paragraph that is extra large.";

md`
### Cards

>> # :info: Heading 1
>> ${t}
>
>> ## :info: Heading 2
>> ${t}
>
>> ### :info: Heading 3
>> ${t}
>
>> #### :info: Heading 4
>> ${t}
>
>> ##### :info: Heading 5
>> ${t}
>
>> ###### :info: Heading 6
>> ${t}
`;

md`
### :mood: Icons

Icons can be specified using the following syntax:

~~~md
Can you see the :forest: for the :park:?
~~~

> Can you see the :forest: for the :park:?

> :info: This is an info icon.

> # :info: Heading 1
> ## :info: Heading 2
> ### :info: Heading 3
> #### :info: Heading 4
> ##### :info: Heading 5
> ###### :info: Heading 6
> :info: Paragraph.
> - :info: List item
>   - :info: List item
>     - :info: List item
`;
