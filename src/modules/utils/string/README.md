## 使用案例

```html
<template>
  <div class="aMap"></div>
</template>
<script setup lang="ts">
  import { stringUtils } from 'front-end-functions';
  const a = 'fdffdfddsfdffdfdds';
  console.log(stringUtils.charLength(a));
  console.log(stringUtils.encodeParams64(a));
  console.log(stringUtils.decodeParams64('ZmRz'));
  console.log(stringUtils.desensitization(a));
  
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