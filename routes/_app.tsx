import { AppProps } from "$fresh/src/server/types.ts";
import * as Dark from "@litdoc/dark";

export default function App({ Component }: AppProps) {
  return (
    <html class={Dark.store.value ? "dark" : ""}>
      <Component />
    </html>
  );
}
