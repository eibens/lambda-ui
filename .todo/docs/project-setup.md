# Project Setup

Use Deno to install the lit-doc CLI.

```sh
deno install -A https://lambda-ui.deno.dev/lit-doc/cli.ts"
```

> Note: See the Deno website for more information about installing Deno.

## Create a new project

Use the `lit-doc init` command to create a new project in the current directory.
This will first create a [Deno Fresh] project, and then add the necessary files
for [lit-doc].

```sh
lit-doc init
```

> Note: It will ask you a few questions about your project. You can skip this by
> using the `--quiet` flag.

After successfully running the `init` command, you should see new files in your
project directory. 

Start the project with the `deno task start` command. It runs the `start` task defined in the `deno.json` file. The start task launches the development server, which will automatically reload when you make changes to the source code.

```sh
deno task start
```

