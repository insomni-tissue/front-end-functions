import { KeyMapAny } from '../../interface';

/**
 * 检查文件类型
 * @param file
 * @returns
 */
export const checkFileType = (file: File) => new Promise((resolve, reject) => {
  if (!file) {
    reject('请上传文件');
    return;
  }
  if (!/\.(xls|xlsx|csv)$/.test(file.name.toLowerCase())) {
    reject('文件上传失败，请检查你的文件格式');
    return false;
  }
  if (file.size >= 3145728) {
    reject('文件上传失败，大小不能超过3M');
    return false;
  }

  resolve(true);
});

/**
 * 读取文件内容
 * @param file
 * @param options
 * @returns
 */
export const readFile = (file: File, options?: any): Promise<any> => new Promise((resolve, reject) => {
  try {
    const fileReader = new FileReader();
    fileReader.onload = (ev: ProgressEvent<FileReader>) => {
      const result = ev.target?.result;
      if (!result) {
        resolve([]);
      }
      import('xlsx').then((XLSX) => {
        const workbook = XLSX.read(result, options);
        /**
         * 转成json格式
         */
        const fileData = workbook.SheetNames.map((sheepName) => XLSX.utils.sheet_to_json(workbook.Sheets?.[sheepName]));
        resolve(fileData);
      });
    };
    /**
     * 转成二进制字符串
     */
    fileReader.readAsBinaryString(file);
  } catch (err) {
    reject(err);
  }
});

/**
 * 获取文件内容
 * @param file
 * @param options
 * @returns Promise<KeyMapAny<unknown>[]>
 */
export const getXlsxFileData = (file: File, options?: any): Promise<KeyMapAny<unknown>[][]> => new Promise((resolve, reject) => {
  checkFileType(file)
    .then(() => {
      readFile(file, options).then((fileData: any[]) => {
        resolve(fileData); // TODO 导出后乱码待处理
      });
    }).catch((err) => reject(err));
});
