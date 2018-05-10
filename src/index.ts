export interface Normalized<T> {
    byId: { [id: string]: T };
    allIds: string[];
}

export const normalized = {
    empty: <T>() => {
      const obj: Normalized<T> = {
        byId: {},
        allIds: [],
      };
      return obj;
    },
    forEach: <T>(normalizedObjs: Normalized<T>, callback: (obj: T) => void) => {
      normalizedObjs.allIds.forEach((id) => {
        callback(normalizedObjs.byId[id]);
      });
    },
    map: <T>(normalizedObjs: Normalized<T>, callback: (obj: T) => any) => {
      const ret: any[] = [];
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
      if (allIds.indexOf(key) === -1) {
        allIds = normalizedObjs.allIds.concat(key);
      }
      return { byId, allIds };
    },
    addItems: <T, K extends keyof T>(normalizedObjs: Normalized<T>, keySelector: (item:T) => string, items: T[]): Normalized<T> => {
      const newByIds = normalized.empty<T>().byId;
      const allIds = normalizedObjs.allIds.slice();
      for (const item of items){
        const index = keySelector(item);
        newByIds[index] = item;
        if (allIds.indexOf(index) === -1) {
          allIds.push(index);
        }
      }
      return {
        byId: {...normalizedObjs.byId, ...newByIds},
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
    fromArray: <T>(arr: T[], idFunction: (obj: T) => string): Normalized<T> => {
      const allIds: string[] = [];
      const byId = normalized.empty<T>().byId;
      arr.forEach((item) => {
        const id = idFunction(item);
        allIds.push(id);
        byId[id] = item;
      });
      return {
        allIds,
        byId,
      };
    },
  };
