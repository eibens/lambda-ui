import { assertEquals } from "$std/assert/assert_equals.ts";
import type { Manifest } from "./lit.ts";
import { Resolution, resolve } from "./router.ts";

const cases: {
  manifest: Manifest;
  tests: [string, Resolution | null][];
}[] = [{
  tests: [
    ["/", {
      type: "route",
      key: "./index.ts",
    }],
    ["/index.ts", {
      type: "asset",
      key: "./index.ts",
    }],
    ["/foo.ts", null],
  ],
  manifest: {
    calls: [],
    assets: {
      "./index.ts": 0,
    },
    routes: {
      "/": 0,
    },
  },
}];

for (const { manifest, tests } of cases) {
  for (const [path, expected] of tests) {
    Deno.test(`resolve: ${path}`, () => {
      assertEquals(resolve(manifest as Manifest, path), expected);
    });
  }
}
