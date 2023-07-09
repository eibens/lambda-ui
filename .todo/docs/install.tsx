import { lit } from "lit-doc";

const doc = lit();
const { md } = doc;

md`
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

`;
