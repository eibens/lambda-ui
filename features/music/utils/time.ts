import {
  DigitFormat,
  Format,
  stringify as stringifyNumeric,
} from "./numeric.ts";

/** HELPERS **/

const HOUR: DigitFormat = {
  type: "DigitFormat",
  base: Infinity,
  factor: 3600,
  unit: "hour",
};

const MINUTE: DigitFormat = {
  type: "DigitFormat",
  base: 60,
  factor: 60,
  unit: "minute",
};

const SECOND: DigitFormat = {
  type: "DigitFormat",
  base: 60,
  factor: 1,
  unit: "second",
};

const MILLISECOND: DigitFormat = {
  type: "DigitFormat",
  base: 1000,
  factor: 1 / 1000,
  unit: "millisecond",
  digits: 3,
};

const TIME: Format = [HOUR, ":", MINUTE, ":", SECOND, ".", MILLISECOND];

function bounded(string: string, max: string): string {
  if (max.length < string.length) return string;
  const padded = string.padStart(max.length, "0");
  const [prefix] = split(max);
  return padded.slice(prefix.length);
}

/** MAIN **/

export function stringify(
  value: number,
  options: {
    max?: number;
  } = {},
): string {
  const { max } = options;
  const str = stringifyNumeric(value, TIME);
  if (max == null) return str;
  return bounded(str, stringifyNumeric(max, TIME));
}

export function split(string: string) {
  const match = string.match(/^([^1-9]*)(.*)\.(.*?)(0*)?$/);
  if (!match) throw new Error(`Invalid time string: ${string}`);
  const [, lefter = "", left = "", right = "", righter = ""] = match;
  const isZero = !left && !right;
  const integer = isZero ? "0" : left;
  const fraction = right ? "." + right : "";
  const prefix = isZero ? lefter.slice(0, -1) : lefter;
  const suffix = fraction ? righter : "." + righter;
  return [prefix, integer, fraction, suffix];
}
