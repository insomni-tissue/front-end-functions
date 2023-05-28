# 常用方法
- `removeNode`删除节点
- `htmlOpen`将html字符串打开成新页面
- `judgeEmptyObjects`判断是否为空对象
- `RandomNumber`随机生成数字
- `objectToFormData`对象转formData
- `objectToArray`对象转一维数组
- `arrayToObject`一维数组转对象
- `filterEmpty`是否空或者例外
- `filterEmptyValue`过滤空元素
- `arrToObj`数组转换对象（当前值作为key）
- `arrToObjTwo`数组转对象（指定顺序对应的key）
- `changeTableHead`表头数据切换
- `transferred`转义br和>
- `blobFileDown`删除节点

## excel下载方法
- `getFileUrl`根据文件流获取资源路径
- `formDataDownFile`根据接口获取文件并下载
- `exportExcel`导出excel内容
- `downloadTableToCSV`导出CSV


## 图片下载方法
- `blobFileDown`文件流下载文件
- `downloadImage`根据图片路径下载
- `downloadImageTwo`根据图片路径下载
- `downloadFile`创建 `a` 标签下载文件流格式图片
- `downloadFileUrl`文件流格式转为Base64格式下载

## 设备环境判断
- `isWx`是否微信
- `isAndroid`是否是安卓机
- `isIphone`是否是苹果机
- `isIphoneX`判断是否在IphoneX打开
- `isIphone678`是否苹果6~8
- `isIphone678Plus`是否苹果6plus~8plus
- `isIphone5`是否苹果5
- `iPhoneSystemVersion`获取苹果手机系统版本号
- `setProHost`设置生产环境Host
- `isPro`是否在生产环境


## 数字相关方法
```ts
  import { numberUtils } from 'front-end-functions';
  const a = 10;
  const b = 10.029;
  const precision = 4;
  console.log('加', numberUtils.add(a, b, precision));
  console.log('减', numberUtils.sub(a, b, precision));
  console.log('乘', numberUtils.mul(a, b, precision));
  console.log('除', numberUtils.div(a, b, precision));
  console.log('百分比', numberUtils.toPercent(a));
```

## 缓存相关方法
```ts
 import { StorageUtils } from 'front-end-functions';
  // StorageUtils.setItem('storageName', { test: '测试数据' }, 'sessionStorage', 150); // 第四个参数默认 6小时
  StorageUtils.setItem('storageName', { test: '测试数据' }); // 第三个参数默认 localStorage
  const sessionStorage = StorageUtils.getItem('storageName', 'sessionStorage');
  const localStorage = StorageUtils.getItem('storageName'); // 第二个参数默认 localStorage
  console.log('sessionStorage', sessionStorage);
  console.log('localStorage', localStorage);
  setTimeout(() => {
    StorageUtils.removeItem('storageName', 'sessionStorage');
    StorageUtils.removeItem('storageName'); // 第二个参数默认 localStorage
  }, 12000);
```