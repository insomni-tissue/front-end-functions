## 使用案例

```html
<template>
  <div class="aMap"></div>
</template>
<script setup lang="ts">
  import { getUrlQuerys, getUrlQuery, enCodeUrlParams, overrideMimeTypeXML, getUrlTemplateCode } from 'front-end-functions';
  console.log(getUrlQuerys('?fd=f&fdjk=43'));
  console.log(getUrlQuery('fd', '?fd=f&fdjk=43'));
  console.log(enCodeUrlParams(getUrlQuerys('?fd=开的f&fdjk=43')));
  
  overrideMimeTypeXML({
    url: '/index.html',
    charset: 'utf-8',
  }).then((stokenHtml) => {
    console.log('stokenHtml', stokenHtml)
  });
  
  console.log('getUrlTemplateCode', getUrlTemplateCode())
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