import { Options } from "$fresh/plugins/twind.ts";
import { DefaultTwindConfig } from "@/features/theme/twind_config.ts";
import { apply } from "twind";

export default {
  selfURL: import.meta.url,
  ...DefaultTwindConfig,
  plugins: {
    ...DefaultTwindConfig.plugins,
    "editor-block": () => {
      return apply`px-4 py-2 my-4`;
    },
    "color-main": () => {
      return apply`color-fuchsia`;
    },
  },
} as Options;
