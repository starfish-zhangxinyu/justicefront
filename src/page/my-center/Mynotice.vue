<template>
  <div id="my-notice">
    <PageBar title1="个人中心" title2="我的通知"></PageBar>
    <el-table
      :data="tableData"
      border
      size="small"
      style="width: 100%">

      <el-table-column
        prop="date"
        label="标题"
        width="">
      </el-table-column>
      <el-table-column
        prop="name"
        label="内容"
        width="">
      </el-table-column>
      <el-table-column
        prop="address"
        label="时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "Mynotice"
    }
</script>

<style scoped>

</style>
