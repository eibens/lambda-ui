import { useEffect, useState } from "preact/hooks";

/** MAIN **/

export function useScrollOffset() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY;
      setOffset(offset);
    };
    addEventListener("scroll", onScroll);
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return offset;
}
