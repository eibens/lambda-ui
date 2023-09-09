import { AppProps } from "$fresh/src/server/types.ts";
import { Dark } from "litdoc/ui/mod.ts";

export default function App({ Component }: AppProps) {
  return (
    <html class={Dark.getClassName()}>
      <Component />
    </html>
  );
}
