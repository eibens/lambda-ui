import { format } from "./format.ts";

export type Manifest = {
  routes: URL[];
  baseUrl: URL;
};

export async function generate(manifest: Manifest) {
  const { routes, baseUrl } = manifest;

  const offset = new URL("./", baseUrl).href.length;
  const routeFiles = routes.map((url) => {
    return url.href.substring(offset);
  });

  const output = `// DO NOT EDIT. This file is generated.
// This file SHOULD be checked into source version control.

${
    routeFiles
      .map((file, i) => `import * as $${i} from "./${file};`)
      .join("\n")
  }

export default {
  baseUrl: import.meta.url,
  routes: {
    ${
    routeFiles
      .map((file, i) => `${JSON.stringify(`./${file}`)}: $${i},`)
      .join("\n    ")
  }
  },
};
`;

  return await format(output);
}
