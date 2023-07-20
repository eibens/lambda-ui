import { lit } from "litdoc";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# :folder: [Fresh](#fresh)

[Deno Fresh](https://fresh.deno.dev) is a web framework for Deno. 
This module provides helpers and wrappers for Fresh.

## \`dev\` function

This module provides a \`dev\` function 
  that works as a drop-in replacement for Fresh's \`dev\` function.

~~~ts
import { dev } from "@lambda-ui/fresh";

await dev(import.meta.url);
~~~

### The \`dev.ts\` file

A default Fresh project can be started by running the following command:

~~~bash
deno task start
~~~

This invokes the \`start\` task defined in the \`deno.json\` file:

~~~json
{
  "tasks": {
    "start": "deno run -A --watch=static/,routes/ dev.ts"
  }
}
~~~

It runs and restarts the \`dev.ts\` file 
whenever a relevant file changes. 
The \`dev.ts\` file looks like this:

~~~ts
import dev from "$fresh/dev.ts";

await dev(import.meta.url, "./main.ts");
~~~

### The \`dev\` function

Under the hood, the \`dev\` function does the following:

1. Check the current Deno version for compatibility.
2. Generate a Fresh manifest file called \`fresh.gen.ts\`.
3. Dynamically import the \`./main.ts\` file.

> **Note:** Step (2) must not trigger unnecessary file changes.
> Otherwise the program will restart in an infinite loop.

The separation between the \`dev.ts\` and \`main.ts\` files
  separates the development concerns of (1) 
  from the application concerns of (3).
It further allows \`main.ts\` 
  to statically depend on the generated \`fresh.gen.ts\` file.
In Fresh this manifest file is used 
  to implement routing and interactive islands.
This simplifies the \`main.ts\` file
  as the existence of the manifest file can be assumed.

### The Pattern

There is a useful pattern we can deduce from Fresh's \`dev\` function.
A more formal description of the pattern is as follows:

- A is a module that
  1. generates C 
  2. dynamically imports B
- B is a module that
  1. statically imports C
  2. runs application logic
- C is a module
`;
