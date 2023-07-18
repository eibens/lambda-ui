import { View } from "@/features/theme/mod.ts";
import { lit } from "litdoc";
import { Crosshair } from "./components/crosshair.tsx";
import { Cursor } from "./components/cursor.tsx";
import { Grid } from "./components/grid.tsx";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# [music](#)

## Components

- [\`<Grid>\`](#grid)
- [\`<Cursor>\`](#cursor)
- [\`<Crosshair>\`](#crosshair)

### \`<Grid>\`

${(
  <View class="relative w-[200px] h-[200px] p-4 color-gray fill-10">
    <Grid
      axis="x"
      range={[0, 200]}
      ticks={[0, 1, 2]}
      scale={(x) => x * 100}
    />
    <Grid
      axis="y"
      range={[0, 200]}
      ticks={[0, 1, 2, 3, 4]}
      scale={(x) => x * 50}
    />
  </View>
)}

### \`<Cursor>\`

${(
  <View class="relative w-[200px] h-[200px] p-4 color-gray fill-10">
    <Grid
      axis="x"
      range={[0, 200]}
      ticks={[0, 1, 2]}
      scale={(x) => x * 100}
    />
    <Cursor
      axis="x"
      position={0.5}
      scale={(x) => x * 100}
      domain={[0, 1]}
      focused={true}
      moving={false}
      range={[0, 200]}
    />
  </View>
)}


### \`<Crosshair>\`

${(
  <View class="relative w-[200px] h-[200px] p-4 color-gray fill-10">
    <Grid
      axis="x"
      range={[0, 200]}
      ticks={[0, 0.5, 1]}
      scale={(x) => x * 200}
    />
    <Crosshair
      axis="x"
      scale={(x) => x * 200}
      invert={(x) => x / 200}
      domain={[0, 1]}
      range={[0, 200]}
      pointer={50}
      ticks={[]}
      threshold={12}
    />
  </View>
)}

`;
