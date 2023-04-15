## 使用案例

#### 导出docs模版
[模板](./text.docx)
```html
<template>
    <div class="docx">
        <el-button @click="exportDocx">导出</el-button>
        <h2>{{ year }}年{{ month }}月</h2>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
    </div>
</template>
<script setup lang="ts">
import { ExportBriefDataDocx } from 'front-end-functions'
import { reactive, ref } from 'vue';
const year = ref('2023')
const month = ref('04')
const tableData = reactive([{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
}, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
}, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
}, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
}])
const exportDocx = () => {
    const docxData = {
        tableData,
        year: year.value,
        month: month.value
    }
    ExportBriefDataDocx('/text.docx', docxData, '文档导出.docx')
}
</script>

<style scoped></style>

```