
import { removeNode } from ".."
/**
 * 文件流下载文件
 * @param blob 
 * @param fileName 
 */
export const blobFileDown = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = fileName
    downloadLink.hidden = true
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
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
 * 创建 <a> 标签下载文件流格式图片
 * @param file 
 * @param fileName 
 */
export const downloadFile = (file: string, fileName?: string) => {
    const blob = new Blob([file]);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = (e) => {
        const a = document.createElement("a");
        a.download = fileName || '0123456.PNG';
        a.href = e.target?.result as string;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
}
/**
 * 文件流格式转为Base64格式下载
 * @param file 文件流数据
 */
export const downloadFileUrl = (file: Blob) => {
    const blob = new Blob([file]);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(blob);
    fileReader.onload = (e) => {
        const url = e.target?.result as string;
        downloadImage(`data:image/png;Base64,${url}`, 'testefd')
    };
}
