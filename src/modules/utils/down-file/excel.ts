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

import { HTMLAttributes } from "vue";

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
