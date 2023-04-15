## 使用案例

```html
<template>
  <div class="env">
    ENV
  </div>
</template>
<script setup lang="ts">
  import { envUtils } from 'front-end-functions';
import { ref } from 'vue';
  envUtils.setProHost('localhost:5173')
  console.log(envUtils.isPro())
  console.log(envUtils.proHost)
  const utils = ref(envUtils)
  console.log(utils);
</script>
<style scoped>
</style>
```