<template>
    <div id="organization">
      <PageBar title1="系统设置" title2="机构管理"></PageBar>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="部门列表"  name="list">
          <el-table
            :data="tableData"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            stripe
            border
            size="mini"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="机构名称"

            >
            </el-table-column>
            <el-table-column
              prop="area.name"
              label="归属区域"
            >
            </el-table-column>
            <el-table-column
              prop="code"
              label="编码">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型">
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="备注">
            </el-table-column>
            <el-table-column
              label="操作" width="350%">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEdit(scope.$index, scope.row)">修改</el-link>
                <el-link type="primary" @click="handleDelete(scope.$index, scope.row)">删除</el-link>
                <el-link type="primary" @click="handleAdd(scope.$index, scope.row)">添加下级机构</el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane :label="isAdd?'机构添加':'机构修改'" :name="isAdd?'addlist':'changelist'">
          <el-form  :model="addForm" size="small" ref="organizationForm">

            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="上级部门" label-width="10%">
                  <select-department :model.sync="addForm.office"></select-department>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="归属区域" label-width="10%">
                  <treeSelect title="区域" :model.sync="addForm.area" name="area"></treeSelect>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="部门名称" label-width="10%" prop="name" :rules="$filter_rules({required:true,maxLength:50})">
                  <el-input v-model.trim="addForm.name" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="部门类型" label-width="10%">
                  <select-from-dict :model.sync="addForm.type"  data_type="	sys_office_type"></select-from-dict>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="部门负责人" label-width="10%">
                  <el-input v-model.trim="addForm.master"  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="部门级别" label-width="10%">
                  <el-input v-model="addForm.master"  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="是否可用" label-width="10%">
                  <el-input v-model="addForm.master"  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="联系地址" label-width="10%">
                  <el-input v-model="addForm.address" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="邮政编码" label-width="10%">
                  <el-input v-model="addForm.zipCode" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="电话" label-width="10%">
                  <el-input v-model="addForm.phone" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="传真" label-width="10%">
                  <el-input v-model="addForm.fax" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="邮箱" label-width="10%">
                  <el-input v-model="addForm.email"  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="16"  :offset="4" >
                <el-form-item label="备注/部门职能" label-width="10%">
                  <el-input v-model="addForm.remarks"  type="textarea"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
          <el-row>
            <el-col :span="2"  :offset="10">
              <el-button type="success" size="mini" class="save-btn" @click="saveDivision('organizationForm')"><i class="fa fa-save"></i> 保存</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                class="el-icon-arrow-left"></i> 返回
              </el-button>
            </el-col></el-row>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import Test from '../../components/common/TreeSelect'
  import api from '../../api/index'
    export default {
        name: "Organization",
      components:{'treeSelect':Test},
      data() {
        return {
          tableData:[],
          activeName:'list',
          flag:true,
          addForm:{office:{name:''},area:{name:''}},
          isAdd:true,
          disabled:false,
          fileList:[]
        }
      },
      methods:{
        handleEdit(index,row){

        },
        handleDelete(index,row){

        },
        handleAdd(index,row){

        },
        save(formName){

        }
      },
      watch:{
        activeName:function (newval,oldval) {
          if(newval!='changelist'){
            this.isAdd=true;
            this.addForm={office:{name:''},area:{name:''}};
          };
          if(this.flag){
            this.addForm={office:{name:''},area:{name:''}};
          }
        }
      },

    }
</script>

<style scoped>

</style>
