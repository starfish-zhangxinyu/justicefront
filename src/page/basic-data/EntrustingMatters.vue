<template>
  <div id="entrusting-matters">
    <PageBar title1="基础数据" title2="委托事项"></PageBar>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="委托事项列表"  name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form  :model="searchForm" size="small" :inline="true" label-width="100px">

                <el-form-item label="专业类别">
                  <select-from-table :model.sync="searchForm.professionCategoryId" port="profession" :clearable="true" :modelId="true" @keyup="search"></select-from-table>
                </el-form-item>

                <el-form-item label="委托事项名" >
                  <el-input v-model.trim="searchForm.name" @keyup.enter.native="search"></el-input>
                </el-form-item>

                <el-button type="primary" icon="el-icon-search" size="small" style="color: white" @click="search">查询</el-button>

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
            label="委托事项名称"></el-table-column>
          <el-table-column
            prop="key.label"
            label="类型">
          </el-table-column>
          <el-table-column
            prop="professionCategory.name"
            label="专业类别">
            <template slot-scope="scope">
              <span v-if="scope.row.professionCategory">
              <span>{{scope.row.professionCategory.name?scope.row.professionCategory.name:'全部类别'}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingItemList"
            label="收费项目">
            <template slot-scope="scope">
              <span v-if="scope.row.chargingItemList">
              {{transform(scope.row.chargingItemList)}}
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
            port="entrustingMatter"
          >
          </pagination>
        </div>
      </el-tab-pane>

      <el-tab-pane :label="isAdd?'委托事项添加':'委托事项修改'" :name="isAdd?'addlist':'changelist'">
        <el-form  :model="addForm" size="small" ref="matterForm" label-width="100px">

          <el-row >
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="委托事项名">
                <el-input v-model.trim="addForm.name" ></el-input>
              </el-form-item>
            </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="类型" >
                <select-from-enum
                        :model.sync="addForm.key"
                        :clearable="true"
                        type="base.EntrustingMatterKey"></select-from-enum>
              </el-form-item>
            </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="专业类别" :rules='required'>
                <select-from-table
                        :model.sync="addForm.professionCategory"
                        port="profession"
                        :clearable="true"></select-from-table>
              </el-form-item>
            </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="收费项目">
                <select-from-table
                        :model.sync="addForm.chargingItemList"
                        port="chargeItem"
                        :multiple="true"
                        className="multiple-select"
                        :condition="chargingItemCondition"
                        :clearable="true"></select-from-table>
              </el-form-item>
            </el-col>
          <!--</el-row>-->
          <!--<el-row >-->
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="默认标准" >
                <select-from-table
                        :model.sync="addForm.standardList"
                        :multiple="true"
                        className="multiple-select"
                        port="standard"
                        :condition="standardCondition"
                        :clearable="true"></select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="portlet">
          <div class="portlet-header">
            <span>委托事项细项</span>
            <el-button type="primary" icon="el-icon-plus" size="mini" style="float: right;margin-right: 10px;margin-top: 5px" @click="addSubMatter">增加</el-button>
          </div>
          <div class="portlet-body" style="padding: 8px 8px 8px 8px">
            <el-table
              :data="addForm.entrustingSubMatterList"
              stripe
              border
              size="mini"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="细项名称">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.name" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作" width="100px" align="center">
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSubMatter(scope.$index, scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <el-row><el-col :span="2"  :offset="11">
          <el-button type="success" size="mini" class="save-btn" @click="save('matterForm')"><i class="fa fa-save"></i> 保存</el-button>
        </el-col></el-row>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
  import Select2 from '../../components/common/Select2'
  import api from '../../api/index'
    export default {
        name: "EntrustingMatters",
      components:{'Select2':Select2},
      data(){
          return{
            page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
            tablesort:null,
            searchdata:{},
            searchForm:{},
            tableData:[],
            activeName:'list',
            isAdd:true,
            isAddDetail:true,
            addForm:{entrustingSubMatterList:[]},
            disabled:false,
            standardOpt:[],
            chargingItemCondition:{},
              standardCondition:{}
          }
      },
      methods:{
        init(){
          this.$get(api.entrustingMatter,
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
        edit(index,row){
          this.isAdd=false;
          this.activeName='changelist'
          var data=JSON.parse(JSON.stringify(row));
            this.addForm=data;


        },
        deleteRow(index,row){
            this.$confirmBox('确定删除委托事项'+row.name+'?').then((res)=>{
            this.$del(api.entrustingMatter +'/'+row.id).then((res) => {
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
        addSubMatter(){
          this.addForm.entrustingSubMatterList.push({})
        },
        deleteSubMatter(index,row){
          this.addForm.entrustingSubMatterList.splice(index,1);
        },
        save(formName){
          var data=JSON.parse(JSON.stringify(this.addForm));
          console.log(data,'aaaa')
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.activeName=='addlist'){
                this.$post(api.entrustingMatter, data).then((res) => {
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
                this.$put(api.entrustingMatter + '/'+data.id,data).then((res) => {
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
        }
      },
      watch:{
        activeName:function (newval,oldval) {
          if(newval=='list'){
              this.isAdd=true;
            this.addForm={entrustingSubMatterList:[]}
          }
        },
          'addForm.professionCategory':{
            handler(newVal,oldVal){
                console.log(newVal,oldVal);
                if(oldVal){
                    this.addForm.chargingItemList=[];
                    this.addForm.standardList=[];
                }
                if(this.addForm.professionCategory){
                    this.chargingItemCondition={'professionCategoryId':this.addForm.professionCategory.id};
                    this.standardCondition={'professionCategoryId':this.addForm.professionCategory.id};
                }
            },
              immediate:false,
          }

      },
      computed: {

      },
      created:function () {

      }
    }
</script>

<style scoped>

</style>
