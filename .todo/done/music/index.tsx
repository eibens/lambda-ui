import { Timeline } from "@/features/music/components/timeline.tsx";
import { Player } from "@/features/music/mod.ts";
import { View } from "@litdoc/components";
import { lit } from "litdoc";
import { Crosshair } from "./components/crosshair.tsx";
import { Cursor } from "./components/cursor.tsx";
import { Grid } from "./components/grid.tsx";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# :folder: [music](#music)

Utilities for working with music.

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

### \`<Player>\`

${(
  <Player
    cursor={0}
    disabled={false}
    domain={[0, 1]}
    playing={false}
  />
)}


### \`<Timeline>\`

${(
  <Timeline
    domain={[0, 1]}
    playing={false}
    ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
    time={0}
  />
)}

`;
