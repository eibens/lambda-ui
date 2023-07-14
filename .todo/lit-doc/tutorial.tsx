import { lit } from "lit-doc";

const doc = lit();
const { md } = doc;

md`
# lit-doc Tutorial

This is the beginners tutorial for lit-doc.
Knowledge of TypeScript is assumed.

## Installation

You will need the following tools:

- Deno: TypeScript runtime for running lit-doc.
- lit-doc CLI: For generating lit-doc projects.
- Code editor: For editing lit-doc projects (VSCode recommended).

## Project setup

Create a new project using the lit-doc CLI.

~~~sh
lit-doc init
~~~

> Info: The command will ask for confirmation
> if the current directory is not empty.

Create a new file in the project root called \`index.ts\`. 
Import the \`lit\` function from \`lit-doc\` and call it.
Store the return value in a variable called ${doc}.

~~~ts
import { lit } from "lit-doc";

const doc = lit();
~~~

> Info: Calling the variable \`doc\` is just a convention.
> You can call it whatever you want.

lit-doc uses Markdown for writing text,
though it is not limited to Markdown and can be extended.

To write Markdown, use the \`md\` template literal tag.
It is, by default, available on the \`doc\` variable.

~~~ts
const { md } = doc;

md\`
# Heading

This is *Markdown* formatted text.
\`;
~~~

> # Heading
> 
> This is *Markdown* formatted text.

Finally, 
`;



md`
## Embed TypeScript

As a Markdown code block:

~~~ts
console.log("hello world")
~~~

Using a template literal tag:
`;

ts`
console.log("hello world II")
`;

md`

`;
