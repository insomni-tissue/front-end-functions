## 使用案例

#### 压缩图片并返回文件流
```html
<template>
  <div class="aMap">
    <input id="excel-upload-input" ref="excel-upload-input" type="file" accept="image/*" @change="upload">
  </div>
</template>
<script setup lang="ts">
import { getImageData } from 'front-end-functions';
const upload = (e: any) => {
  getImageData(e).then((res) => {
    console.log('res', res)
  })
}
</script>
<style scoped>
</style>
```