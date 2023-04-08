/**
 * 自定义全局类型
 */

export as namespace Types;

export type Noop = (...args: unknown[]) => void;

export interface PlainObject {
  [key: string]: unknown;
}

/** 本地存储类型 */
export type LocalStoreType = 'localStorage' | 'sessionStorage';

export interface KeyMapAny<T> {
  [index: string]: T;
}
