import { Options } from "$fresh/plugins/twind.ts";
import { TwindConfig } from "./features/theme/mod.ts";

export default {
  selfURL: import.meta.url,
  ...TwindConfig,
} as Options;
