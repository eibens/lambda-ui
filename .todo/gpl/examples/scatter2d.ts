import { funcs, refs, tags } from "../core.ts";

export default function Scatter2D() {
  const { DATA, TRANS, SCALE, COORD, GUIDE, ELEMENT } = tags;
  const { dim, position, rect, linear, range, calc, axis, point, cross } =
    funcs;

  const { x, y } = refs;

  DATA(x, range(10));
  DATA(y, range(10));
  TRANS(x, calc(x, (x) => x * 10));
  TRANS(y, y);
  SCALE(linear(dim(1)));
  SCALE(linear(dim(2)));
  COORD(rect(dim(1, 2)));
  GUIDE(axis(dim(1)));
  GUIDE(axis(dim(2)));
  ELEMENT(point(position(cross(x, y))));
}
