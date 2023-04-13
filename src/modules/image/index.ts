declare type ImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
declare type Interceptor = (...args: any[]) => Promise<boolean> | boolean;
declare type UploaderFileListItem = {
  url?: string;
  file?: File;
  content?: string;
  isImage?: boolean;
  status?: '' | 'uploading' | 'done' | 'failed';
  message?: string;
  imageFit?: ImageFit;
  deletable?: boolean;
  previewSize?: number | string;
  beforeDelete?: Interceptor;
};
const SUPPORT_IMAGE_TYPE_LIST = ['image/png', 'image/jpeg', 'image/gif'];
/** 图片上传错误 */
export enum ImageUploadErrorCodeEnum {
  /** 不存在图片 */
  none,
  /** 文件类型不支持 */
  unSupportType,
  /** 仅支持单张照片 */
  onlyOne,
}

const TARGET_IPHONE_VERSION = 13.4;

export interface CompressFileType {
  dataURL: string;
  compressFile: Blob;
  fileName: string;
  fileType: string;
}

/**
 * 判断是否图片
 * @param files
 * @returns
 */
const checkType = (files: File[]) => {
  return files.every((file) => SUPPORT_IMAGE_TYPE_LIST.includes(file.type));
};

/**
 * 上传检查
 * @param files
 * @param isMultiple
 * @returns
 */
const checkUploadRules = (files: File[], isMultiple: boolean) => {
  return new Promise((resolve, reject) => {
    const fileLength = files.length;
    if (!isMultiple && fileLength > 1) {
      reject({
        code: ImageUploadErrorCodeEnum.onlyOne,
        message: '每次只能上传一张图片，请重新选择',
      });
      return;
    }

    if (!files || fileLength <= 0) {
      reject({
        code: ImageUploadErrorCodeEnum.none,
        message: '未获取到图片，请重新选择',
      });
      return;
    }

    if (!checkType(files)) {
      reject({
        code: ImageUploadErrorCodeEnum.unSupportType,
        message: '文件类型不支持, 请重新选择',
      });
      return;
    }

    resolve(true);
  });
};

export const base64toBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
* 图片链接转Base64
* @param url
* @returns
*/
export const urlToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    import('image-conversion').then(async (imageConversion) => {
      imageConversion.urltoBlob(url)
        .then((file) => {
          imageConversion.filetoDataURL(file)
            .then((base64Data) => {
              resolve(base64Data);
            }).catch(reject);
        }).catch(reject);
    });
  });
}

/**
 * base64转File
 * @param base64Data
 * @param imgName
 * @returns
 */
export const base64ToFile = (
  base64Data: string,
  imgName: string,
): File | null => {
  try {
    const blob = base64toBlob(base64Data);
    return new File([blob], imgName);
  } catch (err) {
    console.error(err);
    return null;
  }
};

/**
 * 获取图片的旋转方向
 * 兼容ios低版本
 * @param file
 * @returns
 */
export const getOrientation = (file: File): Promise<number | undefined> => {
  return new Promise((resolve, reject) => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const uaMatch = userAgent.match(/cpu iphone os (.*?) like mac os/);
    const iosVersion = uaMatch
      ? uaMatch[1].replace(/^(\d+)_(\d+)\S*/, '$1.$2')
      : '0';

    /** 低版本IOS需要判断是否需要旋转图片 */
    if (uaMatch && parseInt(iosVersion, 10) < TARGET_IPHONE_VERSION) {
      try {
        import('image-conversion').then(async (imageConversion) => {
          const dataURL = await imageConversion.filetoDataURL(file).catch(reject) ?? '';
          const image: unknown = await imageConversion.dataURLtoImage(dataURL).catch(reject);
          import('./exifjs/exif').then((EXIF) => {
            let orient;
            EXIF.default.getData(image as string, () => {
              orient = EXIF.default.getTag(image, 'Orientation');
              resolve(orient);
            });
          });
        });
      } catch (err) {
        resolve(undefined);
      }
    } else {
      return resolve(undefined);
    }
  });
};

/**
 * 压缩图片
 * @param file
 * @param size
 */
export const compressFileToDataURL = (
  file: File,
  size = 500,
): Promise<CompressFileType> => {
  return new Promise((resolve, reject) => {
    import('image-conversion').then(async (imageConversion) => {
      console.time('compressFileToDataURL');
      const orientation = await getOrientation(file).catch(reject) ?? 0;
      const compressFile = await imageConversion.compressAccurately(
        file,
        { size, orientation },
      ).catch(reject);

      if (compressFile) {
        const dataURL: string = await imageConversion.filetoDataURL(compressFile).catch(reject) ?? '';
        console.log(
          `%c压缩文件为base64 %c${file.size / 1024}KB >>> ${compressFile.size / 1024
          }KB`,
          'color:blue',
          'color:green',
        );
        console.timeEnd('compressFileToDataURL');
        resolve({
          dataURL,
          compressFile,
          fileName: file.name,
          fileType: file.type,
        });
      }
    });
  });
};

/**
 * 压缩图片
 * @param file
 * @param size
 */
export const compressFile = (file: File, size = 500): Promise<File> => {
  return new Promise((resolve, reject) => {
    import('image-conversion').then(async (imageConversion) => {
      const orientation = await getOrientation(file).catch(reject) ?? 0;
      const imageFile = await imageConversion.compress(file, { size, orientation }).catch(reject);
      if (imageFile) {
        console.log(
          `%c压缩文件 %c${file.size / 1024}KB >>> ${imageFile.size / 1024}KB`,
          'color:blue',
          'color:green',
        );

        resolve(new File([imageFile], file.name));
      }
    });
  });
};

/**
 * canvas图片
 * @param file
 * @param size
 */
export const compressCanvesToFile = (
  canvasEle: HTMLCanvasElement,
  filename = 'example.jpg',
  size = 500,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    import('image-conversion').then(async (imageConversion) => {
      console.time('compressFileToDataURL');
      imageConversion.canvastoFile(canvasEle, 0.8)
        .then((file) => {
          imageConversion.compress(file, size)
            .then((imageFile) => {
              console.log(
                `%c压缩文件 %c${file.size / 1024}KB >>> ${imageFile.size / 1024}KB`,
                'color:blue',
                'color:green',
              );
              console.timeEnd('compressFileToDataURL');

              resolve(new File([imageFile], filename));
            }).catch(reject)
        }).catch(reject)
    });
  });
};

export const compressUploader = async (
  items: UploaderFileListItem | UploaderFileListItem[],
): Promise<CompressFileType[]> => {
  if (!items) {
    throw Error('上传附件为空');
  }

  let files: File[], isMultiple: boolean;
  if ((isMultiple = Array.isArray(items))) {
    const uploaderFileList = items as UploaderFileListItem[];
    if (!uploaderFileList.every((item) => item.file)) {
      throw Error('上传附件存在空文件');
    }

    files = uploaderFileList.map((item) => item.file as File);
  } else {
    const uploaderFile = items as UploaderFileListItem;
    if (!uploaderFile.file) {
      throw Error('上传附件为空文件');
    }

    files = [uploaderFile.file];
  }

  const isChecked = checkUploadRules(files, isMultiple);
  if (!isChecked) {
    throw Error('附件检查无效');
  }

  const result: CompressFileType[] = [];
  for (const file of files) {
    const imageData = await compressFileToDataURL(file).catch(Promise.reject);
    result.push(imageData);
  }

  return result;
};

/**
 * 获取图片
 * @param e
 * @param isMultiple
 * @returns
 */
export const getImageData = (
  e: InputEvent,
  isMultiple = false,
): Promise<CompressFileType[]> => {
  const target = e.target as HTMLInputElement;
  const result: CompressFileType[] = [];
  const files = Array.prototype.slice.call(target.files);
  const fileLength = files.length;

  return new Promise((resolve, reject) => {
    checkUploadRules(files, isMultiple)
      .then(() => {
        files.forEach((file) => {
          compressFileToDataURL(file).then((imageData) => {
            result.push(imageData);
            if (result.length === fileLength) {
              resolve(result);
              target.value = '';
            }
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
/**
 * 根据图片路径下载
 * @param imgsrc 图片路径
 * @param name 下载图片名称
 * @param type 格式图片，可选，默认png
 */
export const downloadImage = (imgsrc: string, name: string, type: string = 'png') => {
  let image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    let canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    let context = canvas.getContext("2d");
    context?.drawImage(image, 0, 0, image.width, image.height);
    let url = canvas.toDataURL(`image/${type}`); //得到图片的base64编码数据
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "pic"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
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
  let img = document.createElement('img');
  // 解决跨域 Canvas 污染问题
  img.setAttribute("crossOrigin", 'Anonymous');
  img.onload = function (e) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let context = canvas.getContext('2d');
    //绘制图片
    context?.drawImage(img, 0, 0, img.width, img.height);
    //将canvas转base64码，然后创建一个a连接自动下载图片
    canvas.toBlob((blob) => {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob as Blob);
      link.download = name;
      link.click();
    }, `image/${type}`);
  }
  //将资源链接赋值过去，才能触发img.onload事件
  img.src = src
}