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
      if (value instanceof Object) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value)
      }
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


/**
 * 数组转换对象（当前值作为key）
 * @param arr 
 * @returns 
 */
export const arrToObj = (arr: Array<string>) => {
  let obj = {} as OBJ_STRING
  arr.forEach(item => {
    obj[item] = item
  })
  return obj
}
/**
 * 数组转对象（指定顺序对应的key）
 * @param arr 需转换的数组
 * @param arr2 需转换的数组对应的key列表
 * @returns 
 */
export const arrToObjTwo = (arr: Array<string>, arr2: Array<string>) => {
  let obj = {} as OBJ_STRING
  arr.forEach((item, index) => {
    obj[arr2[index]] = item
  })
  return obj
}
export interface OBJ_STRING {
  [key: string]: string;
}
//表头数据切换
export const changeTableHead = (tableData: Array<OBJ_STRING>, fieldName: OBJ_STRING) => {
  const list = tableData.map((item) => {
    const obj = {} as OBJ_STRING
    for (const k in item) {
      if (fieldName[k]) {
        obj[fieldName[k]] = item[k]
      }
    }
    return obj
  })
  return list
}


// 转义br和>
export const transferred = (data: string) => {
  return data.replace(/<br>/g, "rn").replace(/&gt;/g, ">");
}
