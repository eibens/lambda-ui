import * as PairUtils from "./pair.ts";

/** MAIN **/

export type Rect = PairUtils.Pair<PairUtils.Pair>;

export type Size = {
  width: number;
  height: number;
};

export type Margin = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export function fromLine(options: {
  value: number;
  axis: "x" | "y";
  range: [number, number];
}): Rect {
  const { axis, range, value } = options;
  const rect: Rect = [[value, value], range];
  return PairUtils.swap(rect, axis === "y");
}

export function fromLineFill(options: {
  axis: "x" | "y";
  range: [number, number];
  thickness?: number;
  overflow?: number;
}) {
  const { axis, range, thickness = 1, overflow = 0 } = options;
  const a = -thickness / 2;
  const b = -overflow;
  return PairUtils.swap(
    fromPairs(a, PairUtils.empty(range) ? b : a),
    axis === "y",
  );
}

export function fromLines(options: {
  values: number[];
  axis: "x" | "y";
  range: [number, number];
}): Rect[] {
  const { axis, range, values } = options;
  return values.map((value) => {
    return fromLine({ axis, range, value });
  });
}

export function fromSize(size: number, height?: number): Rect;
export function fromSize(size: Size): Rect;
export function fromSize(size: number | Size, height?: number): Rect {
  if (typeof size === "object") {
    return [[0, size.width], [0, size.height]];
  }
  return [[0, size], [0, height ?? size]];
}

export function fromPairs(
  x: number | PairUtils.Pair,
  y: number | PairUtils.Pair,
): Rect {
  return PairUtils.from([
    PairUtils.from(x),
    PairUtils.from(y),
  ]);
}

export function getSize(rect: Rect): Size {
  const [[x0, x1], [y0, y1]] = rect;
  return {
    width: x1 - x0,
    height: y1 - y0,
  };
}

export function getMargin(rect: Rect, outer: Rect): Margin {
  return {
    left: rect[0][0] - outer[0][0],
    top: rect[1][0] - outer[1][0],
    right: outer[0][1] - rect[0][1],
    bottom: outer[1][1] - rect[1][1],
  };
}

export function inset(rect: Rect, margin: Margin): Rect {
  const { left, top, right, bottom } = margin;
  const [[x0, x1], [y0, y1]] = rect;
  return [
    [x0 + left, x1 - right],
    [y0 + top, y1 - bottom],
  ];
}

export function contains(rect: Rect, point: [number, number]): boolean {
  const [x, y] = point;
  const [[x0, x1], [y0, y1]] = rect;
  return (
    x >= x0 &&
    x <= x1 &&
    y >= y0 &&
    y <= y1
  );
}

export function bounds(rect: Rect): Rect {
  const xs = rect[0].map((x) => x ?? 0);
  const ys = rect[1].map((y) => y ?? 0);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const y0 = Math.min(...ys);
  const y1 = Math.max(...ys);
  return [[x0, x1], [y0, y1]];
}

export function translate(rect: Rect, [x, y]: [number, number]): Rect {
  const [[x0, x1], [y0, y1]] = rect;
  return [
    [x0 + x, x1 + x],
    [y0 + y, y1 + y],
  ];
}

/*
export function getWidgetOverlay(props: {
  size: Size;
  margin: Margin;
  isNarrow: boolean;
  isOpen: boolean;
  isSplit: boolean;
  padding: Margin;
}) {
  const { size, margin, isNarrow, isOpen, isSplit, padding } = props;

  const isSplitOpen = isSplit && isOpen;
  const isBottom = isSplitOpen && isNarrow;

  const inner = getfromMargin(margin, size);

  const top = isBottom ? size.height / 2 : margin.top;
  const width = isNarrow ? innerWidth : inner.width / 2;
  const height = isNarrow && isSplit ? inner.eight / 2 : innerHeight;
}

export function getWidgetContent(options: {
  size: Size;
  isNarrow: boolean;
  isOpen: boolean;
  isSplit: boolean;
  margin: Margin;
  padding: Margin;
}) {
  const { size, isNarrow, isOpen, isSplit, margin, padding } = options;

  const isSplitOpen = isSplit && isOpen;
  const isTop = isSplitOpen && isNarrow;
  const isRight = isSplitOpen && !isNarrow;

  const left = margin.left + padding.left;
  const top = margin.top + padding.top;
  const insetRight = isRight ? size.width / 2 : margin.right;
  const insetBottom = isTop ? size.height / 2 : margin.bottom;
  const right = insetRight + padding.right;
  const bottom = insetBottom + padding.bottom;
  const inner = { left, top, right, bottom };

  return fromMargin(inner, size);
}
*/
