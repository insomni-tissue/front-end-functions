## 使用案例

#### 解析 .csv 文件内容
```html
<template>
  <div class="aMap">
    <input id="excel-upload-input" ref="excel-upload-input" type="file" accept=".csv" @change="upload">
  </div>
</template>
<script setup lang="ts">
import { getXlsxFileData } from 'front-end-functions';
// import * as utils from 'front-end-functions';
const upload = (e: any) => {
  const files = e.target.files;
  const rawFile = files[0]; // only use files[0]
  if (!rawFile) return;
  console.log('rawFile', rawFile);
  getXlsxFileData(rawFile, {
    type: 'binary',
    dateNF: 'yyyy/MM/dd',
  }).then(async (res) => {
    console.log('res', res)
  })
}
</script>
<style scoped>
</style>
```