import { split, stringify } from "../utils/time.ts";

/** MAIN **/

export type TimeProps = {
  value?: number;
  pad?: boolean | [boolean, boolean];
  max?: number;
};

export function Time(props: TimeProps) {
  const { value = 0, pad, max } = props;
  const [prefix, integer, fraction, suffix] = split(stringify(value, { max }));
  const [padPrefix, padSuffix] = pad === true
    ? [true, true]
    : pad || [false, false];
  return (
    <span>
      {prefix && padPrefix && (
        <span class="text-gray-300 dark:text-gray-700">
          {prefix}
        </span>
      )}
      <span>
        {integer}
      </span>
      {(fraction || padSuffix) && (
        <span
          style={{
            fontSize: "75%",
          }}
        >
          {fraction}
        </span>
      )}
      {suffix && padSuffix && (
        <span
          class="text-gray-300 dark:text-gray-700"
          style={{
            fontSize: "75%",
          }}
        >
          {suffix}
        </span>
      )}
    </span>
  );
}
