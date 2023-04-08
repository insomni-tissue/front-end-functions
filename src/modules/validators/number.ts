/**
 * 数字校验
 */

import { ERROR_MSG_MAP } from "./error";

class NumberValidator {
  /**
   * 数字范围校验, 在某个区间内
   * @param value
   * @param min
   * @param max
   * @param dot
   * @returns {boolean}
   */
   public static rangeMinMax(value: string | number, min = 0, max = 10000, dot = 2) {
    if (typeof value === 'undefined' || value === null || value === '') {
      return '';
    }
    const val = Number(value);
    const str = '' + value;
    const dotNum = str.split('.')[1];

    // 最多${dot}位小数
    if (dotNum && dotNum.length > dot) {
      return ERROR_MSG_MAP.rangeMinMax(min, max, dot);
    }

    // 应大于等于${min}小于等于${max}
    if (isNaN(val) || val > max || val < min) {
      return ERROR_MSG_MAP.rangeMinMax(min, max, dot);
    }
    return '';
  }
}

export default NumberValidator;