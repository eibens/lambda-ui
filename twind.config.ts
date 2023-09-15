import { Options } from "$fresh/plugins/twind.ts";
import config from "litdoc/theme/twind.ts";

export default {
  selfURL: import.meta.url,
  ...config,
} as Options;
