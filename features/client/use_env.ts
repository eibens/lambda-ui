import { useEffect, useState } from "preact/hooks";

export function useEnv() {
  const [env, setEnv] = useState({
    isBrowser: false,
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setEnv({
        isBrowser: true,
      });
    });
  }, []);

  return env;
}
