<template>
<div id="recorded-data-type">
  <PageBar title1="基础数据" title2="鉴定评定参数类型"></PageBar>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="检测结果数据类型列表" name="dataTypeList">
      <div class="search-box" style="overflow: hidden">
        <el-form  :model="searchForm" size="small" >
          <el-row>
            <el-col :span="8"  :offset="2">
              <el-form-item label="专业类别" label-width="30%">
                <Select :model.sync="searchForm.department" :filterable="true" data_type="caseMark"></Select>
              </el-form-item>
            </el-col>
            <el-col :span="8"  :offset="2">
              <el-form-item label="检测结果数据类型名称" label-width="30%">
                <el-input v-model="searchForm.luser" @keyup.enter.native="search"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1"  :offset="2">
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
          label="检测结果数据类型顺序"
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
    <el-tab-pane :label="isAdd?'检测结果数据类型添加':'检测结果数据类型修改'" :name="isAdd?'addlist':'changelist'">
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
            <el-form-item label="参数类别名称" label-width="10%" :rules='required'>
              <el-input v-model="addForm.name" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16"  :offset="4">
            <el-form-item label="参数类别排序" label-width="10%" :rules='required'>
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
        name: "RecordedDataType",
      data(){
        return{
          activeName:'dataTypeList',
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
          if(newval=='dataTypeList'){
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
