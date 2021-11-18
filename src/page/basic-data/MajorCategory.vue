<template>
<div id="major-category">
  <PageBar title1="基础数据" title2="专业类别"></PageBar>
  <el-tabs type="border-card" v-model="activeName">
    <el-tab-pane label="专业类别列表" name="list">
      <el-table
        :data="tableData"
        stripe
        fit
        border
        size="mini"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="类别名称">
        </el-table-column>
        <el-table-column
          prop="type.label"
          label="专业类别类型">
        </el-table-column>
        <el-table-column
          prop="office.name"
          label="职能部门">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排列顺序">
        </el-table-column>
        <el-table-column
          label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button type="warning" palin icon="el-icon-edit" size="mini" @click="edit(scope.$index,scope.row)"></el-button>
            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-footer">
        <pagination
          :pcurrent.sync="page.current"
          :page.sync="page"
          :data.sync="tableData"
          :search.sync="searchdata"
          :sort.sync="tablesort"
          port="profession"
        >
        </pagination>
      </div>
    </el-tab-pane>
    <el-tab-pane :label="isAdd?'专业类别添加':'专业类别修改'" :name="isAdd?'addlist':'changelist'">
      <el-form  :model="addForm" size="small" ref="majorForm" label-width="100px">
        <el-row>
          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="类别名称" prop="name" :rules="$filter_rules({required:true,maxLength:50})">
              <el-input v-model.trim="addForm.name" ></el-input>
            </el-form-item>
          </el-col>

          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="专业类别类型" prop="type" :rules="$filter_rules({required:true})">
              <!--<el-select v-model="addForm.type" placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in categoryOpt"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->

              <select-from-enum
                      :model.sync="addForm.type"
                      :clearable="true"
                      type="base.ProfessionType"></select-from-enum>
            </el-form-item>
          </el-col>

          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="归属部门" prop="office.name" :rules="$filter_rules({required:true})">
              <select-department data_type="person" :model.sync="addForm.office" className="multiple-select"></select-department>
            </el-form-item>
          </el-col>

          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="排列顺序"  prop="sort" :rules="$filter_rules({required:true})">
              <el-input v-model.number="addForm.sort"></el-input>
            </el-form-item>
          </el-col>

          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="备注" :lg="{span:16,offset:4}">
              <el-input v-model="addForm.value" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row><el-col :span="2"  :offset="10">
        <el-button type="success" size="mini" class="save-btn" @click="save('majorForm')"><i class="fa fa-save"></i> 保存</el-button>
      </el-col>
        <el-col :span="2">
          <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
            class="el-icon-arrow-left"></i> 返回
          </el-button>
        </el-col>
      </el-row>

    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
  import api from '../../api/index.js'
  import Test from '../../components/common/TreeSelect'
    export default {
    components:{'Test':Test},
        name: "MajorCategory",
      data(){
          return{
            activeName:'list',
            isAdd:true,
            tableData:[],
            tablesort:null,
            searchdata:{},
            page: {pageSizes: [30,50,80,100], pageSize: 1, total: 0, current: 1},
            addForm:{office:{name:''}},
            categoryOpt:[]
          }
      },
      methods:{
        professionInit(){
          this.$get(api.profession,
            {
              "page.current":this.page.current,
              "page.pageSize":this.page.pageSize,
            }
          ).then((res) => {
            this.tableData=res.data.list;
            this.page.total=res.data.total;
            this.page.pageSize=res.data.pageSize;
            this.page.current=res.data.current;
            this.activeName="list";
          }).catch((err) => {console.log(err)})
        },
        edit(index,row){
          console.log(row);
          this.isAdd=false;
          this.activeName='changelist';

            var data=JSON.parse(JSON.stringify(row));
          this.addForm=data;
        },
        deleteRow(index,row){
            this.$confirmBox('确定删除专业类别'+row.name+'?').then((res)=>{
            this.$del(api.profession +'/'+row.id).then((res) => {
              if(res.status==200){
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                });
                this.professionInit();
              }

            }).catch((err)=>{console.log(err)});
          }).catch((err)=>{});
        },
        save(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.activeName=='addlist'){
                var data=JSON.parse(JSON.stringify(this.addForm));
                this.$post(api.profession,data).then((res)=>{
                  if(res.status==200){
                    this.$message({
                      message: '新增成功！',
                      type: 'success'
                    });
                    this.professionInit();
                    this.$refs[formName].resetFields();
                  }
                }).catch((err)=>{console.log(err)})
              }else{
                var data=JSON.parse(JSON.stringify(this.addForm));
                delete data.createBy;
                delete data.updateBy;
                this.$put(api.profession + '/'+this.addForm.id,data
                ).then((res) => {
                  if(res.status==200){
                    this.$message({
                      message: '修改成功！',
                      type: 'success'
                    });
                    this.professionInit();
                    this.$refs[formName].resetFields();
                  }
                })
              }
            }
          })
        }
      },
      watch:{
        activeName:function (newval,oldval) {
          if(newval=='list'){
            this.isAdd=true;
          } else if(newval=='addlist'){
            this.addForm={office:{name:''}}
          }
        }
      },
      created:function () {
      }
    }
</script>

<style scoped>

</style>
