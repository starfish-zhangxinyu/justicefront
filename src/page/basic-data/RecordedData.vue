<template>
<div id="recorded-data">
  <PageBar title1="基础数据" title2="检测结果数据"></PageBar>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="检测结果数据列表" name="recordedDataList">
      <div class="search-box" style="overflow: hidden">
        <el-form  :model="searchForm" size="small" >
          <el-row>
            <el-col :span="6"  :offset=" 1">
              <el-form-item label="专业类别" label-width="30%">
                <select-department :model.sync="searchForm.department"></select-department>

              </el-form-item>
            </el-col>
            <el-col :span="6"  :offset="1">
              <el-form-item label="数据类型名称" label-width="30%">
                <el-input v-model.trim="searchForm.luser" @keyup.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6"  :offset="1">
              <el-form-item label="结果数据名称" label-width="30%">
                <el-input v-model="searchForm.name" @keyup.enter.native="search" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="1"  :offset="22">
              <el-button plain icon="el-icon-search" size="small" style="background-color: #5bc0de;color: white">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        stripe
        border
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="专业类别"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="检测结果数据类型名称"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="检测结果数据名称"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="检测结果数据单位"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="检测结果数据排序"
        >
        </el-table-column>
        <el-table-column
          label="操作" width="150%">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="edit(scope.$index,scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane :label="isAdd?'检测结果数据添加':'检测结果数据修改'" :name="isAdd?'addlist':'changelist'">
      <el-form  :model="addForm" size="small" >
        <el-row>
          <el-col :span="16"  :offset="4">
            <el-form-item label="专业类别" label-width="10%" :rules='required'>
              <el-input v-model="addForm.name" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16"  :offset="4">
            <el-form-item label="结果数据类别" label-width="10%" :rules='required'>
              <el-input v-model="addForm.name" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16"  :offset="4">
            <el-form-item label="结果数据名称" label-width="10%" :rules='required'>
              <el-input v-model="addForm.name" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16"  :offset="4">
            <el-form-item label="结果数据单位" label-width="10%" >
              <el-input v-model="addForm.name" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16"  :offset="4">
            <el-form-item label="结果数据排序" label-width="10%" :rules='required'>
              <el-input v-model="addForm.name" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row><el-col :span="2"  :offset="11">
        <el-button type="success" size="mini" class="save-btn" @click=""><i class="fa fa-save"></i> 保存</el-button>
      </el-col></el-row>

    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
    export default {
        name: "RecordedData",
      data(){
        return{
          activeName:'recordedDataList',
          searchForm:{},
          isAdd:true,
          tableData:[{'name':'jackson'}],
          addForm:{},
        }
      },
      methods:{
        edit(index,row){
          this.isAdd=false;
          this.activeName='changelist'
        },
      },
      watch:{
        activeName:function (newval,oldval) {
          if(newval=='recordedDataList'){
            this.isAdd=true;
          } else if(newval=='addlist'){
            this.addForm={}
          }
        }
      }
    }
</script>

<style scoped>

</style>
