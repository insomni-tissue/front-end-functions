import { omitBy, isNil } from 'lodash-es';
import { KeyMapAny } from '../../interface';

/**
 *
 * @param value
 * @param isExclude 是否例外
 * @returns boolean
 */
const filterEmpty = (value: any, isExclude: boolean) => {
  if (isExclude) {
    return false;
  }

  if (isNil(value) || value === '') {
    return true;
  }

  return false;
};

/**
 * 过滤空元素
 * @param jsonValue
 * @param excludeKeys 排除字段
 * @returns object
 */
export const filterEmptyValue = (
  jsonValue: KeyMapAny<any>,
  excludeKeys: string[] = [],
) => {
  if (jsonValue && Object.keys(jsonValue).length > 0) {
    return omitBy(jsonValue, (value: any, key: string) =>
      filterEmpty(value, excludeKeys.includes(key)),
    );
  }

  return jsonValue;
};
