/** MAIN **/

export function getTime<
  T extends {
    time: number;
    span: number;
  },
>(array: T[]): number[] {
  const values = array
    .flatMap(({ time, span }) => [time, time + span]);
  const uniques = [...new Set(values)].sort((a, b) => a - b);
  return uniques.length ? uniques : [0];
}

export function getFreq<
  T extends {
    freq: number;
  },
>(notes: T[]): number[] {
  const values = notes
    .map((note) => note.freq);
  const uniques = [...new Set(values)].sort((a, b) => a - b);
  return uniques.length ? uniques : [0];
}

export function getNearest(array: number[], search: number) {
  const sorted = array.sort((a, b) => a - b);

  if (!sorted.length) return search;

  const i1 = sorted.findIndex((xi) => search <= xi);
  if (i1 < 0) return sorted[sorted.length - 1];
  if (i1 === 0) return sorted[0];
  const x0 = sorted[i1 - 1];
  const x1 = sorted[i1];
  const d0 = search - x0;
  const d1 = x1 - search;
  return d0 < d1 ? x0 : x1;
}
