import { Options } from "$fresh/plugins/twind.ts";
import { TwindConfig } from "litdoc/ui/mod.ts";

export default {
  selfURL: import.meta.url,
  ...TwindConfig,
} as Options;
