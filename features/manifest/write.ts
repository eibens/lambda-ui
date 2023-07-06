import { collect } from "./collect.ts";
import { generate } from "./generate.ts";

export async function write(moduleUrl: string, options: {
  source?: string;
  output?: string;
  filter?: (path: string) => boolean;
} = {}) {
  const {
    output = "./manifest.gen.ts",
    source = "./routes",
    filter = () => true,
  } = options;

  const dir = new URL(moduleUrl);
  const manifestFile = new URL(output, dir);
  const routesDir = new URL(source, dir);

  const manifest = {
    baseUrl: manifestFile,
    routes: await collect(routesDir, {
      filter,
    }),
  };

  await Deno.writeTextFile(manifestFile, await generate(manifest));
  console.log(
    `%cThe manifest has been generated for ${manifest.routes.length} routes.`,
    "color: blue; font-weight: bold",
  );
}
