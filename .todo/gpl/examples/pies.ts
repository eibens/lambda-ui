import { funcs, refs, tags } from "../core.ts";

export default function Pies() {
  const {
    COORD,
    DATA,
    ELEMENT,
    SCALE,
  } = tags;

  const {
    range,
    generate,
    randomItem,
    cat,
    dim,
    values,
    intervalStack,
    position,
    label,
    color,
    summaryProportion,
    rect,
    polarTheta,
    nanoid,
    cross,
  } = funcs;

  const userValues = values(
    "anonymous",
    "known",
  );

  const responseValues = values(
    "Rarely",
    "Infrequently",
    "Occasionally",
    "Frequently",
    "Not Sure",
  );

  const { index, user, response } = refs;

  DATA(index, generate(range(1000), nanoid()));
  DATA(user, generate(index, randomItem(userValues)));
  DATA(response, generate(index, randomItem(responseValues)));
  SCALE(cat(dim(1), userValues));
  SCALE(cat(dim(2), responseValues));
  COORD(rect(dim(2), polarTheta(dim(1))));
  ELEMENT(intervalStack(
    position(summaryProportion(cross(response, user))),
    label(response),
    color(response),
  ));
}
