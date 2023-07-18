import { effect, signal } from "@preact/signals";
import Cookies from "https://esm.sh/js-cookie@3.0.5";

/** MAIN **/

const root = globalThis.document?.documentElement.classList;

const isDarkHtml = root?.contains("dark");

const isDarkCookie = Cookies.get("theme") === "dark";

const isDark = signal(isDarkCookie || isDarkHtml);

effect(() => {
  const value = isDark.value;
  if (!root) return;
  Cookies.set("theme", value ? "dark" : "light");
  root.toggle("dark", value);
});

export function useThemeSignal() {
  return isDark;
}
