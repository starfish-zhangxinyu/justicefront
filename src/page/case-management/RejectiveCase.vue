<template>
  <div id="rejective-case">
    <PageBar title1="案件管理" title2="不予受理"></PageBar>
    <div class="search-box" style="overflow: hidden">
      <el-form  :model="searchRejectiveCase" size="small" >
        <el-row>
          <el-col :span="7"  :offset="3">
            <el-form-item label="鉴定对象">
              <el-input v-model="searchRejectiveCase.object"  style="width: 80%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7"  :offset="3">
            <el-form-item label="委托单位" >
              <select-client :model.sync="searchRejectiveCase.client"></select-client>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="checkMore">
          <el-col :span="7"  :offset="3">
            <el-form-item label="专业类别">
              <Select data_type="majorType" :model.sync="searchRejectiveCase.professionalCategory"></Select>
            </el-form-item>
          </el-col>
          <el-col :span="7"  :offset="3">
            <el-form-item label="第一鉴定人" >
              <Select data_type="majorType" :model.sync="searchRejectiveCase.firstperson" filterable="true"></Select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="checkMore">
          <el-col :span="7"  :offset="3">
            <el-form-item label="联系人">
              <el-input v-model="searchRejectiveCase.object"  style="width: 80%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7"  :offset="3">
            <el-form-item label="登记时间" >
              <el-date-picker
                v-model="searchRejectiveCase.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 80%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row >
          <el-col :span="2" :offset="22">
            <el-button-group>
              <el-button plain size="small" @click="checkMoreInformation()"> <i :class="[checkMore?'fa fa-angle-double-up':'fa fa-angle-double-down']"></i>{{checkMore?'收拢':'更多'}}</el-button>
              <el-button plain icon="el-icon-search" size="small" style="background-color: #5bc0de;color: white">查询</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>

    </div>
    <el-table
      :data="tableData"
      border
      size="small"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="案件编号"
        width="">
      </el-table-column>
      <el-table-column
        prop="name"
        label="变更类型"
        width="">
      </el-table-column>
      <el-table-column
        prop="address"
        label="投诉类型">
      </el-table-column>
      <el-table-column
        prop="address"
        label="案件编号更改">
      </el-table-column>
      <el-table-column
        prop="address"
        label="状态">
      </el-table-column>
      <el-table-column
        prop="address"
        label="申请人">
      </el-table-column>
      <el-table-column
        prop="address"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="address"
        label="新案件编号">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    export default {
        name: "RejectiveCase",
      data(){
          return{
            searchRejectiveCase:{},
            checkMore:false,
            tableData:[]
          }
      },
      methods:{
        checkMoreInformation(){
          this.checkMore=!this.checkMore;
        }
      }
    }
</script>

<style scoped>

</style>
