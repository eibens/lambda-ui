import { build, start } from "./features/website/mod.ts";

const [command] = Deno.args;

if (command === "build" || command === "start") {
  const output = new URL("./docs/", import.meta.url);
  await build(output);

  if (command === "start") {
    await start(output);
  } else {
    // esbuild process in build function does not exit on its own
    Deno.exit(0);
  }
}
