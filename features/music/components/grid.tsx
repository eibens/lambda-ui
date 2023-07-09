import { useMemo } from "preact/hooks";
import * as RectUtils from "../utils/rect.ts";
import { Inset } from "./inset.tsx";
import { Rect } from "./rect.tsx";

/** MAIN **/

export type GridProps = {
  ticks: number[];
  axis: "x" | "y";
  scale: (value: number) => number;
  range: [number, number];
};

export function Grid(props: GridProps) {
  const { ticks, axis, scale, range } = props;

  const fill = useMemo(() => {
    return RectUtils.fromLineFill({
      axis,
      range,
      thickness: 1,
      overflow: 12,
    });
  }, [axis, ...range]);

  const lines = useMemo(() => {
    return RectUtils.fromLines({
      axis,
      range,
      // NOTE: Do not use ticks.map(s) here.
      // The scale function might take more than one argument.
      values: ticks.map((value) => scale(value)),
    });
  }, [axis, ...range, scale, ticks]);

  return (
    <>
      {lines.map((line) => {
        return (
          <Rect
            class="transition-all duration-200"
            geometry={line}
          >
            <Inset
              class="bg-gray-300 dark:bg-gray-700 rounded-full pointer-events-none"
              geometry={fill}
            />
          </Rect>
        );
      })}
    </>
  );
}
