## 使用案例

#### 自定义浏览器缓存设置并设置过期时间
```html
<template>
  <div class="aMap"></div>
</template>
<script setup lang="ts">
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
</script>
<style scoped>
  .aMap{
    width: 100px;
    height: 100px;
    font-size: 26px;
    background: red;
  }
</style>
```