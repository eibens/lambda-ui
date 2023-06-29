import { AppProps } from "$fresh/src/server/types.ts";
import { COOKIES } from "./_middleware.ts";

export default function App({ Component }: AppProps) {
  const isDark = COOKIES.theme === "dark";
  return (
    <html class={isDark ? "dark" : ""}>
      <Component />
    </html>
  );
}
