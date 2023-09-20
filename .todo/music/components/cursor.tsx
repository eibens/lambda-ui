import * as RectUtils from "../utils/rect.ts";
import { Inset } from "./inset.tsx";
import { Rect } from "./rect.tsx";

/** MAIN **/

export type CursorProps = {
  axis: "x" | "y";
  position?: number;
  scale: (value: number) => number;
  domain: [number, number];
  range: [number, number];
  focused: boolean;
  moving: boolean;
};

export function Cursor(props: CursorProps) {
  const { axis, position, scale, range, focused, moving } = props;

  const visible = position != null;

  const line = RectUtils.fromLine({
    axis,
    range,
    value: scale(position ?? 0),
  });

  const fill = RectUtils.fromLineFill({
    axis,
    range,
    thickness: 2,
    overflow: 12,
  });

  const color = focused ? "bg-blue-500" : "bg-gray-500";

  return (
    <Rect
      geometry={line}
      class={[
        !moving && "transition-[bottom, top, height] duration-200",
      ]}
    >
      <Inset
        class={[
          "rounded pointer-events-none",
          color,
        ]}
        geometry={fill}
        style={{
          opacity: visible ? "1" : "0",
        }}
      />
    </Rect>
  );
}
