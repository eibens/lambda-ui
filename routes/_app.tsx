import { AppProps } from "$fresh/src/server/types.ts";
import * as Dark from "../src/dark.ts";

export default function App({ Component }: AppProps) {
  return (
    <html class={Dark.getClassName()}>
      <Component />
    </html>
  );
}
