import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

/** MAIN **/

export function usePropSignal<T>(
  value: T,
  deps: (value: T) => unknown[] = () => [value],
) {
  const signal = useSignal(value);
  useEffect(() => {
    signal.value = value;
  }, deps(value));
  return signal;
}
