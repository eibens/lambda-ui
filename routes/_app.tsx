import { AppProps } from "$fresh/src/server/types.ts";
import { getClassName } from "litdoc/dark/mod.ts";

export default function App({ Component }: AppProps) {
  return (
    <html class={getClassName()}>
      <Component />
    </html>
  );
}
