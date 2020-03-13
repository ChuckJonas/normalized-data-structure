export interface Normalized<T> {
  byId: { [id: string]: T };
  allIds: string[];
}

type KeySelector<T> = (item: T) => string;

export const normalized = {
  /**
   * Creates a new Empty normalized object
  */
  empty: <T>() => {
    const obj: Normalized<T> = {
      byId: {},
      allIds: [],
    };
    return obj;
  },

  forEach: <T>(normalizedObjs: Normalized<T>, callback: (obj: T, key?: string, i?: number) => void) => {
    normalizedObjs.allIds.forEach((id, i) => {
      callback(normalizedObjs.byId[id], id, i);
    });
  },
  map: <T, U>(normalizedObjs: Normalized<T>, callback: (obj: T) => U) => {
    const ret: U[] = [];
    normalizedObjs.allIds.forEach((id) => {
      ret.push(callback(normalizedObjs.byId[id]));
    });
    return ret;
  },
  filter: <T>(normalizedObjs: Normalized<T>, callback: (obj: T) => boolean): T[] => {
    const ret: T[] = [];
    normalizedObjs.allIds.forEach((id) => {
      const item = normalizedObjs.byId[id];
      if (callback(item)) {
        ret.push(item);
      }
    });
    return ret;
  },
  set: <T>(normalizedObjs: Normalized<T>, key: string, item: T): Normalized<T> => {
    const byId = { ...normalizedObjs.byId, [key]: item };
    let allIds = normalizedObjs.allIds;
    if (allIds.indexOf(key as string) === -1) {
      allIds = normalizedObjs.allIds.concat(key);
    }
    return { byId, allIds };
  },
  addItems: <T>(normalizedObjs: Normalized<T>, keySelector: keyof T | KeySelector<T>, items: T[]): Normalized<T> => {
    const newByIds = normalized.empty<T>().byId;
    const allIds = normalizedObjs.allIds.slice();
    for (const item of items) {
      let key = getKey(item, keySelector);

      newByIds[key] = item;
      if (allIds.indexOf(key) === -1) {
        allIds.push(key);
      }
    }
    return {
      byId: { ...normalizedObjs.byId, ...newByIds },
      allIds,
    };
  },
  removeItem: <T>(normalizedObjs: Normalized<T>, key: string): Normalized<T> => {
    const byId = { ...normalizedObjs.byId };
    delete byId[key];

    const allIds = normalizedObjs.allIds.filter((id) => {
      return id !== key;
    });
    return { byId, allIds };
  },
  fromArray: <T>(arr: T[], keySelector: keyof T | KeySelector<T>): Normalized<T> => {
    const allIds: string[] = [];
    const byId = normalized.empty<T>().byId;
    arr.forEach((item) => {
      let key = getKey(item, keySelector);
      allIds.push(key);
      byId[key] = item;
    });
    return {
      allIds,
      byId,
    };
  },
  toArray: <T>(normalizedObjs: Normalized<T>): T[] => {
    return normalizedObjs.allIds.map(id => normalizedObjs.byId[id]);
  }
};

function getKey<T>(item: T, keySelector: keyof T | KeySelector<T>): string {
  let index: string;
  if (keySelector instanceof Function){
    index = keySelector(item);
  }else{
    index = item[keySelector] as any as string;
  }
  return index;
}
