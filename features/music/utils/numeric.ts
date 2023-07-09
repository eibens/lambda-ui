/** HELPERS **/

function formatDigit(num: number, format: DigitFormat): string {
  const { base, factor } = format;
  const value = Math.floor(num / factor);
  if (base === Infinity) return value.toString();
  const digits = format.digits ?? Math.ceil(Math.log10(base));
  const isFraction = factor < 1;
  return isFraction
    ? String(value).padEnd(digits, "0")
    : String(value).padStart(digits, "0");
}

/** MAIN **/

export type DigitFormat = {
  type: "DigitFormat";
  base: number;
  factor: number;
  unit: string;
  digits?: number;
};

export type Digit = {
  format: DigitFormat;
  value: number;
  string: string;
};

export type Format = (string | DigitFormat)[];

export function stringify(
  value: number,
  format: Format,
): string {
  let remaining = value;
  const str = format.map((token) => {
    if (typeof token === "string") return token;
    const str = formatDigit(remaining, token);
    remaining = remaining % token.factor;
    return str;
  }).join("");
  return str;
}
