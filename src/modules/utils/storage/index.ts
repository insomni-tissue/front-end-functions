import dayjs from 'dayjs';

/** 本地存储类型 */
export type LocalStoreType = 'localStorage' | 'sessionStorage';

const LOCAL_STORAGE_NAME = 'localStorage';

/** 存储过期时间戳key */
export const LOCAL_STORAGE_OVERTIME_KEY = '_overtime_';

export const LOCAL_STORAGE_DATA_KEY = '_data_';

class StorageUtils {
  /** 缓存有效时间 小时 */
  private static _CACHE_EFFECTIVE_LIMIT_HOUR = 6;

  /**
   * 保存到本地
   * @param storeKey
   * @param value
   * @param type
   */
  public static setItem(storeKey: string, value: any, type: LocalStoreType = LOCAL_STORAGE_NAME, cacheEffectiveHour: number = this._CACHE_EFFECTIVE_LIMIT_HOUR) {
    if (!storeKey) {
      return;
    }
    const storage = this._getStorage(type);

    storage?.setItem(storeKey, JSON.stringify({
      [LOCAL_STORAGE_OVERTIME_KEY]: dayjs().add(cacheEffectiveHour, 'h').valueOf(),
      [LOCAL_STORAGE_DATA_KEY]: value,
    }));
  }

  /**
   * 获取本地存储
   * @param storeKey
   * @param type
   * @returns
   */
  public static getItem(storeKey: string, type: LocalStoreType = LOCAL_STORAGE_NAME, needTime = false) {
    const storage = this._getStorage(type);

    const value = storage?.getItem(storeKey);

    if (value) {
      const storeData = JSON.parse(value);

      if (!storeData?.[LOCAL_STORAGE_OVERTIME_KEY]) {
        return storeData;
      }

      if (dayjs(storeData[LOCAL_STORAGE_OVERTIME_KEY]).isBefore(dayjs())) {
        this.removeItem(storeKey, type);
        return null;
      }

      if (needTime) {
        return storeData
      }
      
      return storeData?.[LOCAL_STORAGE_DATA_KEY] ?? storeData;
    }

    return null;
  }

  /**
   * 设置hash对象缓存
   * @param storeKey
   * @param hashKey
   * @param value
   * @param type
   * @example
   *  StorageUtils.setHashItem('hashObject', 'hashKey1', 'value1'); >>> hashObject: {hashKey1: 'value1'}
   *  StorageUtils.setHashItem('hashObject', 'hashKey2', 'value'); >>> hashObject: {hashKey1: 'value1', hashKey2: 'value2'}
   */
  public static setHashItem(storeKey: string, hashKey: string, value: any, type: LocalStoreType = LOCAL_STORAGE_NAME) {
    if (!storeKey) {
      return;
    }
    const storage = this._getStorage(type);

    const storageItem = this.getItem(storeKey, type) || {};
    storageItem[hashKey] = value;

    storage?.setItem(storeKey, JSON.stringify(storageItem));
  }

  /**
   * 获取hash对象缓存
   * @param storeKey
   * @param hashKey
   * @param type
   */
  public static getHashItem(storeKey: string, hashKey: string, type: LocalStoreType = LOCAL_STORAGE_NAME) {
    if (!storeKey || !hashKey) {
      return;
    }
    const storageItem = this.getItem(storeKey, type);
    return storageItem?.[hashKey];
  }

  /**
   * 删除
   * @param key
   * @param type
   */
  public static removeItem(storeKey: string, type: LocalStoreType = LOCAL_STORAGE_NAME) {
    const storage = this._getStorage(type);

    storage?.removeItem(storeKey);
  }

  /**
   * 清空
   * @param type
   */
  public static clear(type: LocalStoreType = LOCAL_STORAGE_NAME) {
    const storage = this._getStorage(type);
    storage?.clear();
  }

  /**
   * 缓存数量
   * @param type
   * @returns
   */
  public static size(type: LocalStoreType = LOCAL_STORAGE_NAME) {
    const storage = this._getStorage(type);
    return storage?.length || 0;
  }

  public static key(index: number, type: LocalStoreType = LOCAL_STORAGE_NAME) {
    const storage = this._getStorage(type);
    return storage?.key(index) || '';
  }

  /**
   * 是否支持本地缓存
   * @param type
   * @returns
   */
  public static isSupport(type: LocalStoreType = LOCAL_STORAGE_NAME) {
    return !!this._getStorage(type);
  }


  private static _getStorage(type: LocalStoreType = LOCAL_STORAGE_NAME) {
    const storage = window[type];
    if (!storage) {
      console.warn(`当前环境不支持本地存储: ${type}`);
      return null;
    }

    return storage;
  }
}

export {
  StorageUtils
};
