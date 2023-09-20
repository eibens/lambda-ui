import { useEffect, useState } from "preact/hooks";
import { View } from "@litdoc/components";

/** HELPERS **/

function draw(
  context: CanvasRenderingContext2D,
  options: {
    audioBuffer: AudioBuffer;
    color?: string;
    drawMode?: "top" | "bottom" | "symmetric";
    size: [number, number];
    domain?: [number, number];
  },
) {
  const {
    audioBuffer,
    size,
    domain,
    color = "#ffffff",
    drawMode = "symmetric",
  } = options;

  const drawLines = 500;
  const leftChannel = audioBuffer.getChannelData(0);

  context.save();
  context.clearRect(0, 0, size[0], size[1]);
  context.strokeStyle = color;
  context.globalCompositeOperation = "lighter";
  context.translate(0, size[1] / 2);
  context.lineWidth = 1;

  const secondsToSamples = (seconds: number) => {
    return Math.floor((seconds / audioBuffer.duration) * leftChannel.length);
  };

  const [time0, time1] = domain ?? [0, audioBuffer.duration];
  const [sample0, sample1] = [
    secondsToSamples(time0),
    secondsToSamples(time1),
  ];

  const totallength = sample1 - sample0;
  const eachBlock = Math.floor(totallength / drawLines);
  const lineGap = size[0] / drawLines;

  context.beginPath();
  for (let i = 0; i <= drawLines; i++) {
    const audioBuffKey = Math.floor(eachBlock * i);
    const x = i * lineGap;

    // TODO: aggregate samples
    const y = leftChannel[audioBuffKey + sample0] * size[1] / 2;

    const drawTop = drawMode === "top" || drawMode === "symmetric";
    const drawBottom = drawMode === "bottom" || drawMode === "symmetric";
    const a = Math.abs(y);
    context.moveTo(x, drawBottom ? a : 0);
    context.lineTo(x, drawTop ? -a : 0);
  }
  context.stroke();
  context.restore();
}

/** MAIN **/

export type WaveformProps = {
  audioBuffer: AudioBuffer | null;
  size: [number, number];
  domain: [number, number];
  color?: string;
  drawMode?: "symmetric" | "top" | "bottom";
};

export function Waveform(props: WaveformProps) {
  const { audioBuffer, size, domain, color, drawMode } = props;

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvas) return;
    setContext(canvas.getContext("2d"));
  }, [canvas]);

  useEffect(() => {
    if (!context || !audioBuffer) return;
    draw(context, { audioBuffer, color, drawMode, domain, size });
  }, [context, audioBuffer, color, drawMode, ...domain, ...size]);

  return (
    <View
      tag="canvas"
      onElement={(el) => setCanvas(el as HTMLCanvasElement)}
      class="absolute pointer-events-none"
      width={size[0]}
      height={size[1]}
      style={{
        top: -size[1] / 2,
        left: 32,
        width: size[0] - 64,
        height: size[1],
        opacity: 0.25,
      }}
    />
  );
}
