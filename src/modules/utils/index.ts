import { KeyMapAny } from "../../interface"
import { omitBy, isNil } from 'lodash-es';

/**
 * 删除节点
 * @param {删除节点父级} el
 */
export function removeNode(el: Element) {
    const parent = el.parentNode
    if (parent) {
        parent.removeChild(el)
    }
}
/**
* 将html字符串打开成新页面
* @param {html的字符串} info
*/
export function htmlOpen(info: string) {
    let myWindow = window.open('', '', 'width:100%,height:100%')
    if (!myWindow) return
    myWindow.document.write(info)
    myWindow.document.close() // 必须关闭流，否则表单不生效
    myWindow.focus()
}
/**
 * 判断是否为空对象
 * @param obj 
 */
export const judgeEmptyObjects = (obj: Object) => {
    return !Object.keys(obj).length
    // Object.getOwnPropertyNames()
    // return JSON.stringify(obj) === '{}'
    // for in 
    // jquery 的 isEmptyObject()
}
/**
 * 随机生成数字
 * @param length 生成数字长度 （默认为10）
 * @returns 
 */
export const RandomNumber = (length: number = 10) => {
    // 10e10 等于 10 乘于 10的10次方
    const pow = Math.pow(10, length)
    return Math.floor(Math.random() * pow)
}
/**
 * 对象转formData
 * @param data
 */
export const objectToFormData = (data: object): FormData => {
    let formData = new FormData()
    for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
            formData.append(key, value)
        } else {
            formData.append(key, '')
        }
    }
    return formData
}
/**
 * 对象转一维数组
 * @param data
 */
export const objectToArray = (data: object): Array<Object> => {
    let arr: Array<Object> = []
    for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
            arr.push(value)
        }
    }
    return arr
}
/**
 * 一维数组转对象
 * @param data
 */
export const arrayToObject = (data: Array<string>): KeyMapAny => {
    let arr: KeyMapAny = {}
    data.forEach((val) => {
        arr[val] = val
    })
    return arr
}
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

