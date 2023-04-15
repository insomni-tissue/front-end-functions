## 使用案例


#### 获取当前经纬度
```html
<script setup lang="ts">
import { AMapInteractor } from 'front-end-functions';
import { ref } from 'vue';
let getLocationTime = 0;
const locationMap = ref({})
/** 自动定位 */
const handleAutoLocation = () => {
  if (getLocationTime === 5) {
    return;
  }
  AMapInteractor.getInstance().then((Amap) => {
    Amap.autolocation().then((location) => {
      console.log('location', location);
      locationMap.value = location
    }).catch((err) => {
      console.log('err_err', err);
      locationMap.value = err
      if (err.info === 'FAILED') {
        getLocationTime++;
        handleAutoLocation();
      }
    });
  });
};
handleAutoLocation();
</script>

<template>
  <div class="aMap">
    高德地图定位
    {{ locationMap }}
  </div>
</template>

<style scoped></style>
```