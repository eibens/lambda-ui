import {
  batch,
  useComputed,
  useSignal,
  useSignalEffect,
} from "@preact/signals";
import { PlayButton } from "icons/play_button.tsx";
import { PlayButtonO } from "icons/play_button_o.tsx";
import { PlayPauseO } from "icons/play_pause_o.tsx";
import { PlayStop } from "icons/play_stop.tsx";
import { PlayTrackNext } from "icons/play_track_next.tsx";
import { PlayTrackPrev } from "icons/play_track_prev.tsx";
import { View, ViewNode } from "../../theme/mod.ts";
import { usePropSignal } from "../hooks/use_prop_signal.ts";
import { Time } from "./time.tsx";

/** HELPERS **/

function Separator() {
  return (
    <View
      tag="span"
      class={[
        "relative border-l-1 h-8",
        "border-black dark:border-white border-opacity-10 dark:border-opacity-10",
      ]}
    />
  );
}

function Chip(props: {
  icon: ViewNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const { icon, onClick, disabled } = props;
  return (
    <View
      tag="button"
      onClick={onClick}
      disabled={disabled}
      children={
        <View class="icon-sm">
          {icon}
        </View>
      }
      class={[
        "button-sm",
        "surface",
        "rounded-full",
        disabled ? "button-disabled" : "button-interactive",
      ]}
    />
  );
}

/** MAIN **/

export type PlayerProps = {
  playing: boolean;
  domain: [number, number];
  disabled: boolean;
  cursor: number;
};

export function Player(props: PlayerProps) {
  const playing = usePropSignal(props.playing);

  const disabled = usePropSignal(props.disabled);

  const cursor = usePropSignal(props.cursor);

  const domain = usePropSignal(props.domain, (pair) => pair);

  const anchor = useSignal(0);

  const tick = useSignal(0);

  // COMPUTED

  const clock = useComputed(() => {
    tick.value; // subscribe
    return performance.now() / 1000;
  });

  const location = useComputed(() => {
    const [min, max] = domain.value;
    const pos = cursor.value;
    if (pos <= min) return "min";
    if (pos >= max) return "max";
    return "mid";
  });

  const stopped = useComputed(() => {
    const isMin = location.value === "min";
    const playingValue = playing.value;
    return isMin && !playingValue;
  });

  const jumpMinDisabled = useComputed(() => {
    const isMin = location.value === "min";
    return disabled.value || isMin && !playing.value;
  });

  const jumpMaxDisabled = useComputed(() => {
    const isMax = location.value === "max";
    return disabled.value || isMax && !playing.value;
  });

  const stopDisabled = useComputed(() => {
    return disabled.value || stopped.value;
  });

  function jump(value: number, setPlaying?: boolean) {
    batch(() => {
      cursor.value = value;
      anchor.value = clock.peek() - value;
      if (setPlaying != null) playing.value = setPlaying;
      if (value >= domain.peek()[1]) playing.value = false;
    });
  }

  // EFFECTS

  // Every tick update cursor (while playing) or anchor (while paused).
  useSignalEffect(() => {
    const time = clock.value;
    if (playing.peek()) {
      cursor.value = time - anchor.peek();
    } else {
      anchor.value = time - cursor.peek();
    }
  });

  // Stop when cursor reaches max.
  useSignalEffect(() => {
    clock.value; // subscribe to clock
    const stopping = playing.peek() && location.peek() === "max";
    if (stopping) {
      batch(() => {
        jumpMin();
        playing.value = false;
      });
    }
  });

  // After reaching max, playing jumps to min.
  useSignalEffect(() => {
    if (playing.value) {
      if (location.value === "max") {
        jumpMin();
      }
    }
  });

  useSignalEffect(() => {
    if (!globalThis.document) return;
    requestAnimationFrame(function loop() {
      tick.value++;
      requestAnimationFrame(loop);
    });
  });

  // METHODS

  function jumpMin() {
    jump(domain.peek()[0]);
  }

  function jumpMax() {
    jump(domain.peek()[1]);
  }

  function onJumpMin() {
    jumpMin();
  }

  function onJumpMax() {
    jumpMax();
  }

  function onToggle() {
    playing.value = !playing.value;
  }

  function onStop() {
    playing.value = false;
    jump(domain.value[0]);
  }

  return (
    <View
      class={[
        "pill-md gap-2 flex rounded-full",
        "bg-gray-100 dark:bg-gray-900",
        "shadow-lg",
      ]}
    >
      <Chip
        onClick={onJumpMin}
        disabled={jumpMinDisabled.value}
        icon={<PlayTrackPrev />}
      />
      <Chip
        onClick={onToggle}
        disabled={disabled.value}
        icon={playing.value
          ? <PlayPauseO />
          : disabled.value
          ? <PlayButton />
          : <PlayButtonO />}
      />
      <Chip
        onClick={onJumpMax}
        disabled={jumpMaxDisabled.value}
        icon={<PlayTrackNext />}
      />
      <Separator />
      <Chip
        disabled={stopDisabled.value}
        onClick={onStop}
        icon={<PlayStop />}
      />
      <View
        disabled={disabled.value}
        class={[
          "pill-sm",
          "surface-transparent",
          "flex items-center",
          "font-mono",
        ]}
      >
        <Time
          value={cursor.value}
          max={domain.value[1]}
          pad
        />
      </View>
    </View>
  );
}
