<template>
<div id="all-invoice">
  <PageBar title1="报表统计" title2="开票统计汇总"></PageBar>
  <div class="search-box" style="overflow: hidden">
    <el-form  :model="searchForm1" size="small" >
      <el-row>
        <el-col :span="18"  :offset="2">
          <el-form-item label="统计维度" label-width="13%" :rules="required">
            <select-from-dict
              data_type="casetype"
              :model.sync="searchForm.weidu"
              :multiple=true
              :filterable="true"
              className="multiple-select"></select-from-dict>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="开票日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              v-model="searchForm.date1"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="发票状态" label-width="30%">
            <Select
              data_type="casetype"
              :model.sync="searchForm.type"
              className="multiple-select"></Select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="发放类型" label-width="30%">
            <Select
              data_type="casetype"
              :model.sync="searchForm.type"
              className="multiple-select"></Select>
          </el-form-item>
        </el-col>
        <el-col :span="1"  :offset="11">
          <el-button type="primary" icon="el-icon-search" size="mini" >查询</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-button type="primary" size="mini" style="margin-bottom: 10px"><i class="fa fa-sign-out"></i>导出</el-button>
  <el-table
    :data="tableData"
    border
    size="small"
    style="width: 100%">

    <el-table-column
      prop="date"
      label="专业类别"
      width="">
    </el-table-column>
    <el-table-column
      prop="name"
      label="开票量"
      width="">
    </el-table-column>
    <el-table-column
      prop="address"
      label="开票金额">
    </el-table-column>
  </el-table>
</div>
</template>

<script>
    export default {
        name: "AllInvoice",
      data(){
          return{
            searchForm:{weidu:[]},
            tableData:[]
          }
      }
    }
</script>

<style scoped>

</style>
