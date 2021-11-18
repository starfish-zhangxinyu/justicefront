<template>
  <div id="cnas">
    <PageBar title1="基础数据" title2="CNAS"></PageBar>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="CNAS/CMA项目列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form  :model="searchForm" size="small" :inline="true" label-width="100px">

                <el-form-item label="专业类别" >
                  <select-from-table :model.sync="searchForm.professionCategoryId" port="profession" :clearable="true" :modelId="true" @keyup.enter.native="search">
                  </select-from-table>
                </el-form-item>

                <el-form-item label="委托事项名称" >
                 <el-input v-model.trim="searchForm.entrustingMatterName" @keyup.enter.native="search"></el-input>
                </el-form-item>

                <el-form-item label="项目/参数" >
                  <el-input v-model.trim="searchForm.name" @keyup.enter.native="search"></el-input>
                </el-form-item>

                <el-button type="primary" icon="el-icon-search" size="small">查询</el-button>

          </el-form>
        </div>
        <el-table
          :data="tableData"
          stripe
          fit
          border
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="CNAS/CMA项目/参数">
          </el-table-column>
          <el-table-column
            prop="entrustingMatter.professionCategory.name"
            label="专业类别">
          </el-table-column>
          <el-table-column
            prop="entrustingMatter.name"
            label="委托事项名称">
          </el-table-column>
          <el-table-column
            prop="traceMode.label"
            label="鉴定标准（方法）">
            <template slot-scope="scope">
              <span v-if="scope.row.standardList">
              {{transform(scope.row.standardList)}}
             </span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作" width="150px" align="center">
            <template slot-scope="scope">
              <el-button type="warning" plain icon="el-icon-edit" size="mini" @click="edit(scope.$index,scope.row)"></el-button>
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
            port="cnas"
          >
          </pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="isAdd?'CNAS/CMA项目添加':'CNAS/CMA项目修改'" :name="isAdd?'addlist':'changelist'">
      <el-form  :model="addForm" size="small" ref="cnasForm" label-width="160px">
          <el-row>
          <el-col :lg="{span:16,offset:4}">
              <el-form-item label="CNAS/CMA项目/参数" >
                  <el-input v-model.trim="addForm.name" ></el-input>
              </el-form-item>
          </el-col>
          <!--<el-col :lg="{span:16,offset:4}">-->
            <!--<el-form-item label="专业类别" :rules='required'>-->
                <!--<select-from-table :model.sync="addForm.professionCategory" port="profession" :clearable="true"></select-from-table>-->
            <!--</el-form-item>-->
          <!--</el-col>-->

          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="委托事项名" >
                <select-from-table
                        :model.sync="addForm.entrustingMatter"
                        port="entrustingMatter"
                        :filterable="true"
                        :clearable="true"></select-from-table>
            </el-form-item>
          </el-col>

          <el-col :lg="{span:16,offset:4}">
            <el-form-item label="鉴定标准（方法）">

                <select-from-table
                        :model.sync="addForm.standardList"
                        :multiple="true"
                        className="multiple-select"
                        :filterable="true"
                        port="standard"
                        :clearable="true"></select-from-table>
            </el-form-item>
          </el-col>
          </el-row>
      </el-form>
        <el-row><el-col :span="2"  :offset="11">
          <el-button type="success" size="mini" class="save-btn" @click="save('cnasForm')"><i class="fa fa-save"></i> 保存</el-button>
        </el-col></el-row>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Select2 from '../../components/common/Select2'
  import api from '../../api/index'
    export default {
        name: "Cnas",
      components:{'Select2':Select2},
      name: "InspectionEquipment",
      data(){
        return{
          activeName:'list',
          searchForm:{},
          isAdd:true,
          page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
          tablesort:null,
          searchdata:{},
          tableData:[],
          addForm:{standardList:[]},
          // matterCondition:{},
          //   standardCondition:{}
        }
      },
      methods:{
        transform(arr){
          var str='';
          for(let i=0;i<arr.length;i++){
            str+=arr[i].name+',';
          }
          return str.substr(0,str.length-1);
        },
        init(){
          this.$get(api.cnas,
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
          }).catch((err) => {
            console.log(err)
          })
        },
        transform(arr){
          var str='';
          for(let i=0;i<arr.length;i++){
            str+=arr[i].name+',';
          }
          return str.substr(0,str.length-1);
        },
        search(){
          var data=JSON.parse(JSON.stringify(this.searchForm));
          this.searchdata=data;
        },
        deleteRow(index,row){
            this.$confirmBox('确定删除项目'+row.name+'?').then((res)=>{
            this.$del(api.cnas +'/'+row.id).then((res) => {
              if(res.status==200){
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                });
                this.init();
              }
            }).catch((err)=>{console.log(err)});
          }).catch((err)=>{});
        },
        edit(index,row){
          this.isAdd=false;
          this.activeName='changelist';
          var data=JSON.parse(JSON.stringify(row));
          data.professionCategory=data.entrustingMatter.professionCategory;
          this.addForm=data;
        },
        save(formName){
          var data=JSON.parse(JSON.stringify(this.addForm));
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.activeName=='addlist'){
                this.$post(api.cnas, data).then((res) => {
                  if(res.status==200){
                    this.$message({
                      message: '新增成功！',
                      type: 'success'
                    });
                    this.init();
                    this.$refs[formName].resetFields();
                  }
                }).catch((err) => {console.log(err)})
              }else{
                this.$put(api.cnas + '/'+data.id,data).then((res) => {
                  if(res.status==200){
                    this.$message({
                      message: '修改成功！',
                      type: 'success'
                    });
                    this.init();
                    this.$refs[formName].resetFields();
                  }
                })
              }
            }
          })
        },
      },
      watch:{
        activeName:function (newval,oldval) {
          if(newval=='list'){
            this.isAdd=true;
          } else if(newval=='addlist'){
            this.addForm={}
          }
        },

        // professionCategoryChange(){
        //   delete this.addForm.entrustingMatter;
        //     this.standardCondition={'professionCategoryId':this.addForm.professionCategory.id};
        //     this.matterCondition={'professionCategoryId':this.addForm.professionCategory.id};
        // }
      },
      computed: {
        professionCategoryChange() {
          return this.addForm.professionCategory;
        }
      }
    }
</script>

<style scoped>

</style>
