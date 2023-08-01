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
## Templates

Templates in Litdoc can be created with template literals.
This allows interspersing text with runtime values,
which can be used to embed and generate dynamic content.

Strings are inlined into the template source code,
which means any Markdown formatting will also be applied.
Numbers are converted to strings using the default representation.
Nullish and logical values are converted to empty strings.
This enables the use of \`||\` and \`&&\` for optional content
and reflects how React renders such values.

- \`\${"text"}\`: ${"text"}
- \`\${"**markdown**"}\`: ${"**markdown**"}
- \`\${12345}\`: ${12345}
- \`\${null}\`: ${null} 
- \`\${undefined}\`: ${undefined}
- \`\${true}\`: ${true} 
- \`\${false}\`: ${false}
- \`\${{ type: "InlineCode", text: "some code" }}\`: ${{
  type: "InlineCode",
  text: "some code",
}}
- \`\${<button>html element</button>}\`: ${<button>html element</button>}
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

md`
### :smile-mouth-open: Icons

Icons can be specified using the following syntax:

~~~md
Can you see the forest for the :trees:?
~~~

> Can you see the forest for the :trees:?

> :info: This is an info icon.
`;
