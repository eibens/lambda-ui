import { DATA, ELEMENT, GUIDE } from "../mod.ts";

export default function () {
  const birth = [10, 20, 30, 40, 50];
  const death = [50, 40, 30, 20, 10];
  const country = ["A", "B", "C", "D", "E"];
  const bd = cross(birth, death);

  DATA(bd, cross(birth, death));

  ELEMENT(
    point(
      position(bd),
      size(0),
      label(country),
    ),
  );

  ELEMENT(
    contour(
      position(smooth(bd)),
    ),
  );

  GUIDE(
    form.line(
      position([0, 0], [30, 30]),
      label("Zero Population Growth"),
    ),
  );

  GUIDE(
    axis(dim(1), label("Birth Rate")),
    axis(dim(2), label("Death Rate")),
  );
}
