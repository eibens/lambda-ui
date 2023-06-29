export type Data = {
  id: string;
};

export function stringify(data: Data): string {
  return `<slot id="${data.id}"/>`;
}

export function parse(str: string): Data | null {
  const match = /^<slot id="([^"]+)"\/>$/.exec(str.trim());
  if (!match) return null;
  return { id: match[1] };
}
