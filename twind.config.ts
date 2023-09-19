import { Options } from "$fresh/plugins/twind.ts";
import { TwindConfig } from "litdoc/utils/twind.ts";

export default {
  selfURL: import.meta.url,
  ...TwindConfig,
} as Options;
