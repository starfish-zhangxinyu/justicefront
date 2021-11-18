<template>
    <div id="gene-frequency">
      <PageBar title1="基础数据" title2="基因频率"></PageBar>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基因频率列表" name="geneList">
          <div class="search-box" style="overflow: hidden">
            <el-form  :model="searchForm" size="small" >
              <el-row>
                <el-col :span="8"  :offset="2">
                  <el-form-item label="基因频率类型" label-width="30%">
                    <Select :model.sync="searchForm.department" :filterable="true" data_type="caseMark"></Select>
                  </el-form-item>
                </el-col>
                <el-col :span="8"  :offset="2">
                  <el-form-item label="基因座名称" label-width="30%">
                    <el-input v-model.trim="searchForm.luser"></el-input>
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
              label="基因频率类型"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="基因座名称"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="基因座别名"
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
        <el-tab-pane :label="isAdd?'基因频率表添加':'基因频率表修改'" :name="isAdd?'addlist':'changelist'">
          <el-form  :model="addGeneForm" size="small" >
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="基因频率类型" label-width="10%" :rules='required'>
                  <el-input v-model.trim="addGeneForm.name" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="基因座名称" label-width="10%" :rules='required'>
                  <el-input v-model.trim="addGeneForm.name" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="基因座别名" label-width="10%" :rules='required'>
                  <el-input v-model="addGeneForm.name" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16"  :offset="4">
                <el-form-item label="排列序号" label-width="10%" :rules='required'>
                  <el-input v-model="addGeneForm.name" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>

          <div class="portlet">
            <div class="portlet-header">
              <span>基因频率</span>
              <el-button type="primary" icon="el-icon-plus" size="mini" style="float: right;margin-right: 10px;margin-top: 5px" @click="addRow">增加</el-button>
            </div>
            <div class="portlet-body" style="padding: 8px 8px 8px 8px">
              <el-table
                :data="addGeneForm.table"
                stripe
                border
                size="mini"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="等位基因"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="频率"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" size="mini"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作" width="150%">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-row><el-col :span="2"  :offset="11">
            <el-button type="success" size="mini" class="save-btn" @click=""><i class="fa fa-save"></i> 保存</el-button>
          </el-col></el-row>

        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "GeneFrequency",
      data(){
        return{
          activeName:'geneList',
          searchForm:{},
          isAdd:true,
          tableData:[{'name':'jackson'}],
          addGeneForm:{table:[]},
        }
      },
      methods:{
        edit(index,row){
          this.isAdd=false;
          this.activeName='changelist'
        },
        addRow(){
         this.addGeneForm.table.push({});

        }
      },
      watch:{
        activeName:function (newval,oldval) {
          if(newval=='geneList'){
            this.isAdd=true;
          } else if(newval=='addlist'){
            this.addGeneForm={table:[]}
          }
        }
      }
    }
</script>

<style scoped>

</style>
