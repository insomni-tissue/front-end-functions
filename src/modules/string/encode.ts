export const charLength = (param: string) => {
  try {
    const arr = param.match(/[\u4e00-\u9fa5]/gi) || [];
    return param.length + arr.length;
  } catch (e) {
    console.error(new Error('stringUtils.charLength parameter error'), e);
  }
};

/**
 * base64解码
 * @param param
 * @returns
 */
export const decodeParams64 = (param: string) => {
  let result = param;
  if (
    typeof param !== 'undefined' &&
    param !== null &&
    param !== '' &&
    param !== 'undefined' &&
    param !== 'null'
  ) {
    // 解码
    try {
      result = window.decodeURIComponent(window.atob(param));
    } catch (e) {
      console.warn(e);
    }
  }
  return result;
};

/**
 * base64编码
 * @param param
 * @returns
 */
export const encodeParams64 = (param: string) => {
  let result = param;
  if (
    typeof param !== 'undefined' &&
    param !== null &&
    param !== '' &&
    param !== 'undefined' &&
    param !== 'null'
  ) {
    // 编码
    try {
      result = window.btoa(window.encodeURIComponent(param));
    } catch (err) {
      console.error(err);
    }
  }
  return result;
};

/**
 * 数据脱敏
 * @param value
 * @returns
 */
export const desensitization = (value?: string | number) => {
  if (!value) {
    return value;
  }
  const targetValue = `${value}`;
  const length = targetValue.length;
  const maxLength = Math.min(Math.floor(length / 2), 4);
  const regex = new RegExp(`.{${maxLength}}$`, 'i');
  const replaceStr = '*'.repeat(maxLength);
  return targetValue.replace(regex, replaceStr);
};

