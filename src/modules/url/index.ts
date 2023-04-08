import { KeyMapAny } from "../../interface";

/**
 * 获取Url参数
 * @param search
 *
 * @return UrlParamsType
 */
export const getUrlQuerys = (search?: string) => {
  let queryString = search || window?.location.search;

  if (!queryString) {
    return {};
  }

  if (queryString[0] === '?') {
    queryString = queryString.slice(1);
  }

  const queryArr = queryString.split('&');
  const urlParams: KeyMapAny<string> = {};
  queryArr.forEach((item: string) => {
    const params = item.split('=');
    if (params[1] && params[1] !== 'undefined') {
      try {
        urlParams[params[0]] = decodeURIComponent(params[1]);
      } catch (e: any) {
        console.error(e.message);
      }
    }
  });

  return urlParams;
};

/**
 * 获取单个Url参数
 * @param key
 * @param search
 *
 * @return string
 */
export const getUrlQuery = (key: string, search?: string) => {
  const params = getUrlQuerys(search);

  return params[key] || '';
};

/**
 * 链接参数转义
 * @param params
 * @returns
 */
export const enCodeUrlParams = (
  params: KeyMapAny<string | undefined>,
  excules: string[] = [],
) => {
  const paramsArray: string[] = [];
  Object.keys(params).forEach((key) => {
    const exculesKeys = [...excules, 'returnShopProductUrl'];
    if (exculesKeys.includes(key)) {
      return key;
    }

    if (params[key]) {
      paramsArray.push(
        encodeURIComponent(key) +
          '=' +
          encodeURIComponent(params[key] as string),
      );
    } else {
      if (typeof params[key] === 'number' && !isNaN(Number(params[key]))) {
        paramsArray.push(
          encodeURIComponent(key) +
            '=' +
            encodeURIComponent(params[key] as string),
        );
      } else {
        paramsArray.push(encodeURIComponent(key) + '=');
      }
    }
  });

  return paramsArray.join('&');
};
/**
 * @params
 * params:
 * url: 拼接部分的文件地址
 * @Description: xml获取类似gbk格式的html进行转编码 'utf-8'/'gbk'
 */
export const overrideMimeTypeXML = (params: {
  url: string;
  charset: string;
}): Promise<string> =>
  new Promise((resolve) => {
    let xmlHttp: XMLHttpRequest;
    if (window.XMLHttpRequest) {
      xmlHttp = new XMLHttpRequest();
    } else {
      xmlHttp = new (window.ActiveXObject as any)('Microsoft.XMLHTTP');
    }
    xmlHttp.open('GET', window.location.origin + params.url, true);
    xmlHttp.overrideMimeType(`text/html;charset=${params.charset}`);
    xmlHttp.send(null);
    xmlHttp.onreadystatechange = () => {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          resolve(xmlHttp.response as string);
        } else {
          resolve('');
        }
      }
    };
  });

/**
 * 获取Url上的模板
 * @returns
 */
export const getUrlTemplateCode = () => {
  if (
    /.*\/product\/([a-zA-Z_]+)\/index.html/gi.test(window?.location.pathname)
  ) {
    const templateCode = window?.location.pathname.replace(
      /.*\/product\/([a-zA-Z_]+)\/index.html/gi,
      '$1',
    );

    return templateCode;
  }
  return getUrlQuery('_from') || '';
};
