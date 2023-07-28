import { effect, signal } from "@preact/signals-core";
import Cookies from "https://esm.sh/js-cookie@3.0.5";

const COOKIE = "dark";

enum Mode {
  Dark = "true",
  Light = "false",
}

function getInitial() {
  // On server-side, assume light mode by default.
  if (typeof document === "undefined") return false;

  // On client-side, rely on cookie or preference as fallback.
  // Ignore what the document class says.
  // The server would only set it in response to the cookie anyways.

  // Cover all cases, so that a "false" cookie does not fall back to preference.
  const cookie = Cookies.get(COOKIE);
  if (cookie === Mode.Dark) return true;
  if (cookie === Mode.Light) return false;

  const isPreference = matchMedia("(prefers-color-scheme: dark)").matches;
  return isPreference;
}

/** MAIN **/

export const store = signal(getInitial());

// Effect must be declared after creating the signal.
effect(() => {
  const value = store.value;

  // On client-side only, sync the current value to the cookie
  // and document class (for Tailwind).
  if (typeof document !== "undefined") {
    document.documentElement.classList.toggle("dark", value);
    Cookies.set(COOKIE, value ? Mode.Dark : Mode.Light);
  }
});

/**
 * Set the dark mode value by reading the cookie from a request.
 */
export function setFromRequest(request: Request) {
  const value = request.headers
    .get("Cookie")
    ?.split(";")
    .map((cookie) => cookie.trim().split("="))
    .find(([key]) => key === COOKIE)?.[1];

  store.value = value === Mode.Dark;
}
