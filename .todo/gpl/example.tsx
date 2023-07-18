import { TwindColors } from "../theme/deps.ts";
import { Chart } from "./Chart.tsx";
import { create } from "./core.ts";
import Scatter2D from "./examples/scatter2d.ts";

export default function GplExample() {
  const recipe = create(Scatter2D);
  const isDark = theme.name === "dark";
  return (
    <Chart
      root={recipe}
      renderElement={({ geometry, aesthetics }) => {
        console.log(aesthetics);
        if (geometry.name === "point") {
          const x = 10;
          const y = 10;
          const color = isDark ? TwindColors.gray[200] : TwindColors.gray[800];
          return (
            <circle
              cx={x}
              cy={y}
              r="10"
              fill={color}
            />
          );
        }
        throw new Error(`Unknown geometry: ${geometry}`);
      }}
    />
  );
}
