## 使用案例

```html
<template>
  <div class="aMap">
  </div>
</template>
<script setup lang="ts">
import { WechatSdk } from 'front-end-functions';
WechatSdk.getInstance().then((wx) => {
  console.log(wx);
  wx.miniProgram.getEnv((res: any) => {
    console.log(res);
  });
})
</script>
<style scoped></style>
```