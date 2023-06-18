import Cookies from "https://esm.sh/js-cookie@3.0.5";
import { useEffect, useState } from "preact/hooks";

/** MAIN **/

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (!globalThis.document) return false;
    return globalThis.document.documentElement.classList.contains("dark");
  });

  function update(isDark: boolean) {
    if (!globalThis.document) {
      throw new Error("Cannot set theme outside of browser context.");
    }
    Cookies.set("theme", isDark ? "dark" : "light");
    globalThis.document.documentElement.classList.toggle("dark", isDark);
  }

  useEffect(() => {
    if (Cookies.get("theme") === "dark") {
      setIsDark(true);
    }
  }, []);

  return {
    isDark,
    name: isDark ? "dark" : "light",
    set: (isDark: boolean) => {
      setIsDark(isDark);
      update(isDark);
    },
    toggle: () => {
      setIsDark((isDark) => !isDark);
      update(!isDark);
    },
  };
}
