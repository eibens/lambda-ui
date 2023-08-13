/** MAIN **/

import { useSignalEffect } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
import { load, store } from "../utils/load.ts";
import { Monaco } from "../utils/types.ts";

export function useMonaco(): Monaco | undefined {
  const [instance, setInstance] = useState<Monaco | undefined>(undefined);

  useEffect(() => {
    // Auto-load monaco if not already loaded.
    load();
  }, []);

  useSignalEffect(() => {
    setInstance(store.value);
  });

  return instance;
}
