export type ImportMap = {
  imports: Record<string, string>;
};

export type ImportMapRetain = {
  operation: "retain";
  value: string;
};

export type ImportMapInsert = {
  operation: "insert";
  value: string;
};

export type ImportMapUpdate = {
  operation: "update";
  value: string;
  previous: string;
};

export type ImportMapOperation =
  | ImportMapRetain
  | ImportMapInsert
  | ImportMapUpdate;

export type ImportMapDiff = {
  imports: Record<string, ImportMapOperation>;
};

export function diff(a: ImportMap, b: ImportMap): ImportMapDiff {
  const diff: ImportMapDiff = { imports: {} };

  // Iterate through all entries in the first import map
  for (const [key, aValue] of Object.entries(a.imports)) {
    const bValue = b.imports[key];

    if (bValue === undefined) {
      // Entry was removed, insert the value with an update operation
      diff.imports[key] = {
        operation: "update",
        value: "",
        previous: aValue,
      };
    } else if (aValue !== bValue) {
      // Entry was changed, insert the value with an update operation
      diff.imports[key] = {
        operation: "update",
        value: bValue,
        previous: aValue,
      };
    } else {
      // Entry was not changed, insert the value with a retain operation
      diff.imports[key] = {
        operation: "retain",
        value: aValue,
      };
    }
  }

  // Iterate through all entries in the second import map
  for (const [key, bValue] of Object.entries(b.imports)) {
    // Check if entry exists in the first import map, if not insert it with an
    // insert operation
    if (!(key in a.imports)) {
      diff.imports[key] = {
        operation: "insert",
        value: bValue,
      };
    }
  }

  return diff;
}
