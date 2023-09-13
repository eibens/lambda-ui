export type Value<T> = {
  
}

export default function lit<T>(state: T) {
  function tag(name: string) {
    return (strings: TemplateStringsArray, ...values: Value<T>[]) => {
      return {
        strings,
        values,
        state,
        name,
      };
    };
  }
  return {
    md: tag("md"),
    fn: (fn: (state: T, ...args: any[]) => T) => {
      return tag("fn");
    },
  };
}
