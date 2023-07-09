import { cli } from "./packages/cli/mod.ts";

if (import.meta.main) {
  await cli();
}
