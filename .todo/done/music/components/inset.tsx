import { View, ViewProps } from "@litdoc/components";
import { JSX } from "preact";
import * as RectUtils from "../utils/rect.ts";

/** MAIN **/

export type InsetProps = ViewProps & {
  geometry: RectUtils.Rect;
  style?: JSX.CSSProperties;
};

export function Inset(props: InsetProps) {
  const { geometry, style = {}, ...rest } = props;

  const [[x0, x1], [y0, y1]] = RectUtils.bounds(geometry);

  const s = {
    position: "absolute",
    left: `${x0}px`,
    right: `${x1}px`,
    top: `${y0}px`,
    bottom: `${y1}px`,
    // FIXME: do not ignore non-object styles
    ...(typeof style === "object" ? style : {}),
  };

  return <View style={s} {...rest} />;
}
