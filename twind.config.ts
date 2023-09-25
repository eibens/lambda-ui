import { Options } from "$fresh/plugins/twind.ts";
import { TwindConfig } from "./src/theme.ts";

export default {
  selfURL: import.meta.url,
  ...TwindConfig,
} as Options;
