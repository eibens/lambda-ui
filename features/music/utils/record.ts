/** HELPERS **/

function toBase64(buffer: Uint8Array): string {
  // Convert to base64 and resolve
  const binary: string[] = [];
  for (let i = 0; i < buffer.length; i++) {
    binary.push(String.fromCharCode(buffer[i]));
  }
  const base64 = btoa(binary.join(""));
  return base64;
}

function encodeChunk(
  buffer: Uint8Array,
  offset: number,
  data: Float32Array,
) {
  let counter = 0;
  for (const sample of data) {
    // encode float to 16-bit PCM little-endian
    const sampleInt = Math.trunc(sample * 0x7fff);
    buffer[offset + counter++] = sampleInt & 0xff;
    buffer[offset + counter++] = (sampleInt >> 8) & 0xff;
  }
  return counter;
}

/** MAIN **/

export async function record(options: {
  duration: number;
}): Promise<string> {
  if (!AudioContext) {
    throw new Error("AudioContext is not supported");
  }

  const { duration } = options;

  const sampleRate = 44100;
  const chunkSampleCount = 1024;
  const sourceChunkSize = 4 * chunkSampleCount;
  const targetChunkSize = 2 * chunkSampleCount;
  const targetChunkCount = Math.ceil(duration * sampleRate / chunkSampleCount);
  const targetBufferSize = targetChunkSize * targetChunkCount;
  const targetBuffer = new Uint8Array(targetBufferSize);

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });

  const audioContext = new AudioContext({
    sampleRate,
  });

  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(sourceChunkSize, 1, 1);
  source.connect(processor);
  processor.connect(audioContext.destination);

  let offset = 0;
  let chunkIndex = 0;

  return new Promise((resolve) => {
    const startTime = Date.now();
    processor.addEventListener("audioprocess", (event) => {
      // Terminate when buffer is full
      if (offset >= targetBufferSize) {
        // Clean up
        processor.disconnect();
        source.disconnect();

        resolve(toBase64(targetBuffer));

        // Log total progress
        console.log(`[RECORD] done in ${Date.now() - startTime}ms`);

        return;
      }

      // Log chunk progress
      console.log(`[RECORD] ${++chunkIndex}/${targetChunkCount} chunks`);

      // Encode audio data
      const data = event.inputBuffer.getChannelData(0);
      offset += encodeChunk(targetBuffer, offset, data);
    });
  });
}
