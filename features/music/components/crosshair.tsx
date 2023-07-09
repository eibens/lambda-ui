import { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import * as PairUtils from "../utils/pair.ts";
import * as RectUtils from "../utils/rect.ts";
import * as TicksUtils from "../utils/ticks.ts";
import { Inset } from "./inset.tsx";
import { Rect } from "./rect.tsx";

/** MAIN **/

export type CrosshairProps = {
  renderLabel?: (props: CrosshairProps) => ComponentChildren;
  axis: "x" | "y";
  domain: [number, number];
  range: [number, number];
  scale: (value: number) => number;
  invert: (value: number) => number;
  ticks: number[];
  pointer: number;
  disabled?: boolean;
  threshold?: number;
  onTargetChange?: (value: number) => void;
};

export function Crosshair(props: CrosshairProps) {
  const {
    renderLabel,
    axis,
    domain,
    range,
    scale,
    invert,
    ticks,
    pointer,
    disabled = false,
    threshold = 12,
    onTargetChange,
  } = props;

  const target = useMemo(() => {
    const value = TicksUtils.getNearest(ticks, invert(pointer));

    // If there are ticks, rely on them without clamping the value.
    const target = ticks.length ? value : PairUtils.clamp(domain, value);

    onTargetChange?.(target);

    return target;
  }, [...domain, invert, pointer, ticks]);

  const targetOffset = scale(target);
  const distance = Math.abs(pointer - targetOffset);
  const proximity = distance <= threshold;
  const visible = !disabled && proximity;

  const line = RectUtils.fromLine({
    axis,
    range,
    value: scale(target),
  });

  const fill = RectUtils.fromLineFill({
    axis,
    range,
    thickness: 1,
    overflow: 12,
  });

  return (
    <Rect geometry={line}>
      <Inset
        class="absolute bg-gray-500 rounded transition-all duration-200 ease-in-out pointer-events-none"
        geometry={fill}
        style={{
          opacity: visible ? "1" : "0",
        }}
      >
        {renderLabel?.(props)}
      </Inset>
    </Rect>
  );
}
