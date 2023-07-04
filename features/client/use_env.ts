import { useEffect, useState } from "preact/hooks";

export function useEnv() {
  const [env, setEnv] = useState({
    isFirstRedraw: false,
    isBrowser: typeof globalThis.document !== "undefined",
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setEnv({
        isBrowser: true,
        isFirstRedraw: true,
      });
    });
  }, []);

  return env;
}
