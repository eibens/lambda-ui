import { useState } from "preact/hooks";
import { View } from "@litdoc/components";
import * as PairUtils from "../utils/pair.ts";
import { Crosshair } from "./crosshair.tsx";
import { Cursor } from "./cursor.tsx";
import { Grid } from "./grid.tsx";
import { Time } from "./time.tsx";

/** MAIN **/

export type TimelineProps = {
  time: number;
  ticks: number[];
  domain: [number, number];
  playing: boolean;
};

export function Timeline(props: TimelineProps) {
  const { ticks, domain, playing } = props;

  const focused = false;

  const [pointer, setPointer] = useState(0);
  const [crosshair, setCrosshair] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [time, setTime] = useState(0);

  const size = PairUtils.from([900, 64]);
  const outer = PairUtils.fromZero(size[0]);
  const range = PairUtils.inset(outer, 32);
  const emptyRange = PairUtils.fromZero(0);
  const scale = PairUtils.linear(domain, range);
  const invert = PairUtils.linear(range, domain);

  return (
    <View
      class="rounded py-12 border-1 border-gray-100 dark:border-gray-900 overflow-hidden"
      onPointerEnter={() => {
        setDisabled(false);
      }}
      onPointerLeave={() => {
        setDisabled(true);
      }}
      onPointerMove={(e: PointerEvent) => {
        setPointer(e.offsetX);
      }}
      onPointerDown={() => {
        setTime(crosshair);
      }}
    >
      <View
        class="relative"
        style={{
          width: size[0],
        }}
      >
        <Grid
          scale={scale}
          range={[-8, 8]}
          axis="x"
          ticks={ticks}
        />
        <Grid
          scale={(t) => t}
          range={range}
          axis="y"
          ticks={[0]}
        />
        <Crosshair
          axis="x"
          domain={domain}
          scale={scale}
          invert={invert}
          ticks={ticks}
          pointer={pointer}
          disabled={disabled}
          threshold={Infinity}
          range={emptyRange}
          onTargetChange={(value) => {
            setCrosshair(value);
          }}
          renderLabel={(props) => {
            return (
              <View class="relative w-24">
                <Time
                  value={props.scale(props.pointer)}
                />
              </View>
            );
          }}
        />
        <Cursor
          axis="x"
          domain={domain}
          scale={scale}
          position={time}
          focused={focused}
          moving={playing}
          range={emptyRange}
        />
      </View>
    </View>
  );
}
