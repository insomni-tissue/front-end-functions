/**
 * 小数位四舍五入
 * @param num
 * @param precision 默认保留2位小数点
 * @returns {number}
 */

type NumberOrString = number | string;

const roundNum = function (num: number, precision: number): number {
  const multiNo = Math.pow(10, precision || 2);
  return Math.round(num * multiNo) / multiNo;
};

// 处理科学计数法
const scientificNotationFormat = function (arg: NumberOrString) {
  try {
    if (arg?.toString().toLowerCase().indexOf('e') !== -1) {
      arg = Number(arg);
    }
  } catch (e) {
    console.error(e);
  }
  return arg;
};

/**
 * 浮点加
 * @param arg1
 * @param arg2
 * @returns
 */
const floatAdd = function (arg1: NumberOrString, arg2: NumberOrString) {
  let r1;
  let r2;
  try {
    arg1 = scientificNotationFormat(arg1);
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    arg2 = scientificNotationFormat(arg2);
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = Math.pow(10, Math.max(r1, r2));
  return (Number(arg1) * m + Number(arg2) * m) / m;
};

/**
 * 浮点减
 * @param arg1
 * @param arg2
 * @returns
 */
const floatSub = function (arg1: NumberOrString, arg2: NumberOrString) {
  let r1, r2;
  try {
    arg1 = scientificNotationFormat(arg1);
    r1 = arg1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    arg2 = scientificNotationFormat(arg2);
    r2 = arg2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  const m = Math.pow(10, Math.max(r1, r2));
  // use accurate one
  const n = r1 >= r2 ? r1 : r2;
  return Number(((Number(arg1) * m - Number(arg2) * m) / m).toFixed(n));
};

/**
 * 浮点乘
 * @param arg1
 * @param arg2
 * @returns
 */
const floatMul = function (arg1: NumberOrString, arg2: NumberOrString) {
  let m = 0;
  arg1 = scientificNotationFormat(arg1);
  arg2 = scientificNotationFormat(arg2);
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  if (s1.indexOf('.') !== -1) {
    m += s1.split('.')[1].length;
  }
  if (s2.indexOf('.') !== -1) {
    m += s2.split('.')[1].length;
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  );
};

/**
 * 浮点除
 * @param arg1
 * @param arg2
 * @returns
 */
const floatDiv = function (arg1: NumberOrString, arg2: NumberOrString) {
  let t1 = 0;
  let t2 = 0;
  let res;
  arg1 = scientificNotationFormat(arg1);
  arg2 = scientificNotationFormat(arg2);
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  if (s1.indexOf('.') !== -1) {
    t1 = s1.split('.')[1].length;
  }
  if (s2.indexOf('.') !== -1) {
    t2 = s2.split('.')[1].length;
  }

  const r1 = Number(s1.replace('.', ''));
  const r2 = Number(s2.replace('.', ''));

  res = (r1 / r2).toString();
  if (res.indexOf('.') !== -1) {
    t1 += res.split('.')[1].length;
    res = res.replace('.', '');
  }

  return Number(res) / Math.pow(10, t1 - t2);
};

/**
 * 精确浮点数 加减乘除
 * @param arg1
 * @param arg2
 * @param precision 保留小数点位数，不传则默认保留两位小数点
 * @returns {*}
 */
export const numberUtils = {
  // 加
  add: (arg1: NumberOrString, arg2: NumberOrString, precision = 2) =>
    roundNum(floatAdd(arg1, arg2), precision),
  // 减
  sub: (arg1: NumberOrString, arg2: NumberOrString, precision = 2) =>
    roundNum(floatSub(arg1, arg2), precision),
  // 乘
  mul: (arg1: NumberOrString, arg2: NumberOrString, precision = 2) =>
    roundNum(floatMul(arg1, arg2), precision),
  // 除
  div: (arg1: NumberOrString, arg2: NumberOrString, precision = 2) =>
    arg2 ? roundNum(floatDiv(arg1, arg2), precision) : 0,
  // 转百分比
  toPercent: (arg: number) => `${arg * 100}%`,
};
