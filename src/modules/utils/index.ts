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
 * 根据接口获取文件并下载
 * @param action 接口路径
 * @param method 接口请求方式
 * @param parent 生成form父级元素
 */
export const formDataDownFile = (action: string, method: string = 'post', parent: string = 'app') => {
    const App = document.getElementById(parent)
    const form = document.createElement("form")
    form.name = "download_form" + RandomNumber()
    form.id = "download_form" + RandomNumber()
    form.method = `${method}`
    form.target = "downloadBox"
    form.action = action
    App?.appendChild(form)
    form.submit()
    // App?.removeChild(form)
    removeNode(form)
}

/**
 * 根据图片路径下载
 * @param imgsrc 图片路径
 * @param name 下载图片名称
 * @param type 格式图片，可选，默认png
 */
export const downloadImage = (imgsrc: string, name: string, type: string = 'png') => {
    const image = new Image()
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous")
    image.onload = function () {
        const canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext("2d")
        context?.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL(`image/${type}`) //得到图片的base64编码数据
        let a = document.createElement("a") // 生成一个a元素
        let event = new MouseEvent("click") // 创建一个单击事件
        a.download = name || "pic" // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
        removeNode(canvas)
    }
    //将资源链接赋值过去，才能触发image.onload 事件
    image.src = imgsrc
}
/**
 * 根据图片路径下载
 * @param src 图片路径
 * @param name 下载图片名称
 * @param type 格式图片，可选，默认png
 */
export const downloadImageTwo = (src: string, name: string, type: string = 'png') => {
    const img = document.createElement('img')
    // 解决跨域 Canvas 污染问题
    img.setAttribute("crossOrigin", 'Anonymous')
    img.onload = function (e) {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        let context = canvas.getContext('2d')
        //绘制图片
        context?.drawImage(img, 0, 0, img.width, img.height)
        //将canvas转base64码，然后创建一个a连接自动下载图片
        canvas.toBlob((blob) => {
            let link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob as Blob)
            link.download = name
            link.click()
            removeNode(canvas)
        }, `image/${type}`)
    }
    //将资源链接赋值过去，才能触发img.onload事件
    img.src = src
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
