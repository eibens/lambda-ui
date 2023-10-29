

/** HELPERS **/



/** MAIN **/

export type ResourceTypeMap = {
  html: string;
};

export type ResourceType = keyof ResourceTypeMap;

export type ResourceResult<T> = {
  type: "pending";
  promise: Promise<T>;
} | {
  type: "resolved";
  value: T;
} | {
  type: "rejected";
  error: Error;
} | {
  type: "empty";
};

export type Bundler = {
  get<T extends ResourceType>(
    type: ResourceType,
    path: string,
  ): ResourceResult<ResourceTypeMap[T]>;
};

export function create(options: {}): Bundler {
  
  return {
    get: (type, path) => {
      throw new Error("Not implemented");
    }
  }
}
