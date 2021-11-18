<template>
    <div id="alcohol-parameter">
      <PageBar title1="系统设置" title2="酒精参数"></PageBar>
      <el-table
        :data="tableData"
        style="width: 100%"
        size="small"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children'}">
        <el-table-column
          prop="date"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="参数名"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="参数值">
          <template slot-scope="scope">
            <el-input v-model.trim="scope.row.address" size="mini"></el-input>
          </template>
        </el-table-column>

      </el-table>
    </div>
</template>

<script>
    export default {
        name: "AlcoholParameters",
      data(){
          return{
            tableData:[]
          }
      }
    }
</script>

<style scoped>

</style>
