import { Options } from "$fresh/plugins/twind.ts";
import { TwindConfig } from "@litdoc/theme";

export default {
  selfURL: import.meta.url,
  ...TwindConfig,
} as Options;
