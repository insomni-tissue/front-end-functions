## 使用案例

#### 异步加载script文件
```html
<script setup lang="ts">
  import { asyncScript } from 'front-end-functions'
import { ref } from 'vue';
  const asyncScriptBool = ref(false)
  const setAsyncScript = async() => {
    const bool = await asyncScript('/src/assets/async.js') as boolean
    asyncScriptBool.value = bool
  }
  setAsyncScript()
</script>

<template>
  <div class="aMap">
    异步引用{{ asyncScriptBool }}
  </div>
</template>

<style scoped>
</style>
```