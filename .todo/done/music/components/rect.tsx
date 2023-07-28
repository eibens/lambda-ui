import { View, ViewProps } from "@litdoc/components";
import * as RectUtils from "../utils/rect.ts";

/** MAIN **/

export type RectProps = ViewProps & {
  geometry: RectUtils.Rect;
};

export function Rect(props: RectProps) {
  const { geometry, style, ...rest } = props;

  const [[x0, x1], [y0, y1]] = RectUtils.bounds(geometry);

  const s = {
    position: "absolute",
    left: `${x0}px`,
    top: `${y0}px`,
    width: `${x1 - x0}px`,
    height: `${y1 - y0}px`,
    // FIXME: do not ignore non-object styles
    ...(typeof style === "object" ? style : {}),
  };

  return <View style={s} {...rest} />;
}
