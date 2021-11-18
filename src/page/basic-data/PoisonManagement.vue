<template>
    <div id="poison-management">
      <PageBar title1="基础数据" title2="毒物管理"></PageBar>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="毒物分类列表" name="classList">
          <div class="search-box" style="overflow: hidden">
            <el-form  :model="searchForm" size="small" >
              <el-row>
                <el-col :span="14"  :offset="2">
                  <el-form-item label="毒物分类名称" label-width="30%">
                    <el-input v-model.trim="searchForm.luser" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1"  :offset="5">
                  <el-button plain icon="el-icon-search" size="small" style="background-color: #5bc0de;color: white">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-table
            :data="tableData1"
            stripe
            border
            size="mini"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="毒物分类"
            >
            </el-table-column>
            <el-table-column
              label="操作" width="150%">
              <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editClass(scope.$index,scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click.native.prevent="deletePoisonRow(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="addClass?'毒物分类添加':'毒物分类修改'" :name="addClass?'addClassList':'changeClassList'">
          <el-form  :model="addClassForm" size="small" >
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="毒物分类名称" label-width="10%" :rules='required'>
                  <el-input v-model.trim="addClassForm.type" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row><el-col :span="2"  :offset="11">
            <el-button type="success" size="mini" class="save-btn" @click=""><i class="fa fa-save"></i> 保存</el-button>
          </el-col></el-row>
        </el-tab-pane>
        <el-tab-pane label="毒物列表" name="poisonList">
          <div class="search-box" style="overflow: hidden">
            <el-form  :model="searchPoison" size="small" >
              <el-row>
                <el-col :span="8"  :offset="2">
                  <el-form-item label="毒物类别" label-width="30%">
                    <select-from-dict :model.sync="searchPoison.department" :filterable="true" data_type="caseMark" :clearable="true"></select-from-dict>
                  </el-form-item>
                </el-col>
                <el-col :span="8"  :offset="2">
                  <el-form-item label="毒物名称" label-width="30%">
                    <el-input v-model.trim="searchPoison.luser"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1"  :offset="2">
                  <el-button plain icon="el-icon-search" size="small" style="background-color: #5bc0de;color: white">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>

          <el-table
            :data="tableData2"
            stripe
            border
            size="mini"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="毒物分类"
            >
            </el-table-column>
            <el-table-column
              label="操作" width="150%">
              <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editClass(scope.$index,scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click.native.prevent="deletePoisonRow(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="addList?'毒物添加':'毒物修改'"  :name="addList?'addPoison':'changePoison'">
          <el-form  :model="addClassForm" size="small" >
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="毒物名称" label-width="10%" :rules='required'>
                  <el-input v-model.trim="addPoisonForm.type" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="毒物类别" label-width="10%" :rules='required'>
                  <el-input v-model.trim="addPoisonForm.type" ></el-input>
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
        name: "PoisonManagement",
      data(){
          return{
            activeName:'classList',
            addClass:true,
            addList:true,
            searchForm:{},
            tableData1:[{'name':'8989'}],
            tableData2:[],
            addClassForm:{},
            searchPoison:{},
            addPoisonForm:{}
          }
      },
      methods:{
        editClass(index,row){

        },
        deletePoisonRow(index,row){

        }
      }
    }
</script>

<style scoped>

</style>
