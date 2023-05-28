import { useEffect, useState } from "preact/hooks";

/** MAIN **/

export function useTheme() {
  const storageKey = "app/theme";

  const [name, setName] = useState(() => {
    const stored = globalThis.localStorage.getItem(storageKey);
    if (stored != null) return stored;
    return "dark";
  });

  useEffect(() => {
    globalThis.document.documentElement.classList.toggle(
      "dark",
      name === "dark",
    );
  }, [name]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const { classList } = mutation.target as HTMLElement;
          const dark = classList.contains("dark");
          setName(dark ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, [setName]);

  return {
    name,
    toggle: () => {
      setName((name) => {
        const newName = name === "dark" ? "light" : "dark";
        globalThis.localStorage.setItem(storageKey, newName);

        return newName;
      });
    },
  };
}
