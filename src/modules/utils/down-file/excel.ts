/**
 * 获取文件流资源
 * 后台固定名字response,带headers等信息的返回结果
 * @param {*} res 
 * @param {*} down 是否下载
 * @param {*} errorFun 
 * @param {*} name 
 * @returns 
 */
// export function downloadFilefixName(res, down = false, errorFun, name) {
//     if (!res) return;
//     const filename = name || (res.headers && getFilename(res.headers['content-disposition']));
//     if (!(res.data instanceof ArrayBuffer)) {
//         res.data = new ArrayBuffer(res.data.length);
//         // return console.error('data 类型不是 ArrArrayBuffer');
//     }
//     if (res.data.byteLength === 0) {
//         vue.prototype.$message.error('该文件破损无法下载!');
//         return console.error('文件流长度为 0');
//     }
//     let resultType = arraybufferToJson(res.data);
//     if (resultType) return errorFun ? errorFun(resultType) : vue.prototype.$message.error(resultType.msg || '');
//     if (down) {
//         downloadFile(res.data, decodeURI(filename), true);
//     } else {
//         return getFileUrl(res.data)
//     }
// }
/**
 * 获取下载文件的filename
 * @param {String} cds requonse headers['Content-Disposition']
 */
// export function getFilename(cds, extname = '') {
//     const ms = (cds || '').match(/filename=([^;]*)?$/);
//     const filename = ms && ms[1];
//     if (!filename) return null;
//     return filename.replace(/[\'\"]/g, '') + extname;
// }

/**
 * 获取资源路径
 * @param {*} data 
 * @param {*} tranformmation 
 * @returns 
 */
export function getFileUrl(data: Blob, tranformmation = true) {
    if (!data) return false;
    const url = tranformmation ? window.URL.createObjectURL(new Blob([data])) : data;
    return url
}
/**
 * 下载文件
 * @param {*} data 数据
 * @param {*} filename 文件名。格式
 * @param {*} tranformmation 是否需要转换
 */
export function downloadFile(data: Blob, filename = 'export.xlsx', tranformmation = true) {
    const url = getFileUrl(data, tranformmation);
    if (!url) { return; }
    let a = document.getElementById('download-file') as any;
    if (!a) {
        a = document.createElement('a');
        a.setAttribute('id', 'download-file');
        document.body.appendChild(a);
        a.style.display = 'none';
    }
    a.setAttribute('download', filename);
    a.href = url;
    a.click();
}

/**
 * 尝试转换成json (如果文件流本身是json格式切勿使用该方法)
 * @param {*} arraybuffer
 */
export function arraybufferToJson(arraybuffer: Uint8Array) {
    const utf8decoder = new TextDecoder();
    const u8arr = new Uint8Array(arraybuffer);
    try {
        return JSON.parse(utf8decoder.decode(u8arr));
    } catch (error: any) {
        console.error(error.message);
        return false;
    }
}



/**
 * 根据接口获取文件并下载
 * @param action 接口路径
 * @param params 接口请求参数
 * @param method 接口请求方式
 * @param parent 生成form父级元素
 */

export const formDataDownFile = (action: string, params: any, method: string = 'post', parent: string = 'app') => {
    const App = document.getElementById(parent)
    const form = document.createElement("form")
    form.method = `${method}`
    form.target = "downloadBox"
    form.action = action
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            let element = params[key]
            if (typeof element !== 'string') {
                element = JSON.stringify(element)
            }
            // 将该输入框插入到 form 中
            form.appendChild(createInputElement(key, element))
        }
    }
    App?.appendChild(form)
    form.submit()
    App?.removeChild(form)
}
// 创建Input标签
export const createInputElement = (name: string, value: string, type: string = 'text') => {
    // 创建一个输入  
    const input = document.createElement("input");
    // 设置相应参数  
    input.name = name;
    input.value = value;
    input.type = type;
    return input
}

import * as xlsx from 'xlsx'
import { arrToObj, arrToObjTwo, changeTableHead, transferred } from "..";
import { blobFileDown } from './img';
/**
 * 导出excel内容
 * @param fileName 文件名称
 * @param pageName 工作表名称
 */
export const exportExcel = (fileName: string = "demo", pageName: string = "Sheet1") => {
    const table = getHtmlTableData()
    const fieldName = arrToObj(table.ths)
    const tableData = table.trs.map((tr) => {
        return arrToObjTwo(tr, table.ths)
    })
    const list = changeTableHead(tableData, fieldName);
    // 创建工作表
    const data = xlsx.utils.json_to_sheet(list);
    // 创建工作簿
    const wb = xlsx.utils.book_new();
    // 将工作表放入工作簿中
    xlsx.utils.book_append_sheet(wb, data, pageName);
    // 生成文件并下载
    xlsx.writeFile(wb, `${fileName}.xlsx`);
};
/**
 * 获取页面表格内容
 * @returns 
 */
export const getHtmlTableData = () => {
    const table__header = document.getElementsByClassName("el-table__header") as any // 获取表头
    const table__body = document.getElementsByClassName("el-table__body")[0] // 获取tbody
    const ths: string[] = table__header[0].innerText.split('\n\t\n')
    const trss = table__body.getElementsByTagName("tr")
    let trs = []
    for (let i = 0, l = trss.length; i < l; i++) {
        trs.push([])
        trs[i] = trss[i].innerText.split('\n\t\n')
    }
    return {
        ths,
        trs
    }
}
/**
 * 导出CSV
 * @param fileName 
 */
export const downloadTableToCSV = (fileName: string) => {
    // const fileName = Date.now() + ".csv" // 使用当前时间戳作为文件名
    const columnDelimiter = "," //列分割符
    const lineDelimiter = "\n\t" //行分割符
    let result = "" // 最终结果的字符串
    const table = getHtmlTableData()
    for (let i = 0, l = table.ths.length; i < l; i++) {
        result += transferred('"' + table.ths[i] + '"') + columnDelimiter // 每一列用逗号分隔
    }
    result += lineDelimiter // 每一行使用"rn"分隔
    for (let i = 0, l = table.trs.length; i < l; i++) {
        let spandata = table.trs[i]
        for (let i = 0, l = spandata.length; i < l; i++) {
            result += transferred('"' + spandata[i] + '"') + columnDelimiter
        }
        result += lineDelimiter
    }
    // uFEFF
    const blob = new Blob([result], { type: "text/csv" }) // 记得将编码格式设置一下，避免最终下载的文件出现乱码
    blobFileDown(blob, fileName)
}