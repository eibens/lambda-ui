import {
  ReadonlySignal,
  Signal,
  useSignal,
  useSignalEffect,
} from "@preact/signals";

/** MAIN **/

export type AudioOptions = {
  cursor: ReadonlySignal<number>;
  audio: ReadonlySignal<ArrayBuffer | null>;
  playing: ReadonlySignal<boolean>;
  duration: Signal<number>;
  buffer: Signal<AudioBuffer | null>;
};

export type AudioResult = ReturnType<typeof useAudio>;

export function useAudio(props: AudioOptions) {
  const { cursor, audio, playing, duration, buffer } = props;

  const ac = useSignal<AudioContext | null>(null);

  const source = useSignal<AudioNode | null>(null);

  function getContext() {
    if (ac.peek()) return ac.peek() as AudioContext;
    const context = new AudioContext();
    ac.value = context;
    return context;
  }

  // Private
  function play() {
    if (!globalThis.document) return;
    if (!audio.peek()) return;
    const ac = getContext();
    const newSource = ac.createBufferSource();
    newSource.buffer = buffer.peek();
    newSource.connect(ac.destination);
    newSource.start(0, cursor.peek());
    source.value = newSource;
  }

  function stop() {
    if (!source.value) return;
    source.value.disconnect();
    source.value = null;
  }

  // Decode audio data when audio is received.
  useSignalEffect(() => {
    if (!audio.value) return;
    const ac = getContext();
    ac.decodeAudioData(audio.value)
      .then((data) => {
        buffer.value = data;
        duration.value = data.duration;
        if (playing.value) {
          stop();
          play();
        }
      });
  });

  // Play/stop audio playback when playing state changes.
  useSignalEffect(() => {
    if (playing.value) {
      play();
    } else {
      stop();
    }
  });

  return {
    jump: () => {
      if (!source.value) return;
      source.value.disconnect();
      source.value = null;
      play();
    },
  };
}
