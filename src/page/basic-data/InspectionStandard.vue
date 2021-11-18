<template>
  <div id="inspection-standard">
    <PageBar title1="基础数据" title2="检验标准"></PageBar>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="检验标准列表" name="list">
        <div class="search-box" style="overflow: hidden">
          <el-form  :model="searchForm" size="small"  label-width="100px">
            <el-row>
              <el-col :lg="{span:7,offset:1}">
                <el-form-item label="检验标准名称">
                  <el-input v-model.trim="searchForm.name" placeholder="请输入内容" @keyup.enter.native="search"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="{span:7,offset:1}">
                  <el-form-item label="检验标准编号">
                    <el-input v-model.trim="searchForm.standardNo" placeholder="请输入内容" @keyup.enter.native="search"></el-input>
                  </el-form-item>
                </el-col>
              <el-col :lg="{span:7,offset:1}">
                <el-form-item label="标准发布日期" >
                <el-date-picker
                  @keyup.enter.native="search"
                  size="small"
                  v-model="searchForm.pubDate"
                  type="daterange"
                  value-format="yyyy-MM-dd"
                  range-separator="~"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :lg="{span:7,offset:1}">
                <el-form-item label="标准实施日期" >
                  <el-date-picker
                    @keyup.enter.native="search"
                    size="small"
                    v-model="searchForm.impDate"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :lg="{span:7,offset:1}">
                <el-form-item label="标准类型" >
                  <select-from-dict data_type="standard_type" :model.sync="searchForm.standardTypeId" className="multiple-select" :clearable="true" @keyup="search"></select-from-dict>
                </el-form-item>
              </el-col>
              <el-col :lg="{span:7,offset:1}">
                <el-form-item label="专业类别">
                  <select-from-table :model.sync="searchForm.professionCategoryId" port="profession" :modelId="true" @keyup="search"></select-from-table>
                </el-form-item>
              </el-col>
            </el-row>
              <el-col :span="1"  :offset="22">
                <el-button type="primary" icon="el-icon-search" size="small" style="color: white" @click="search">查询</el-button>
              </el-col>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          stripe
          border
          fit
          size="mini"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="检验标准名称"
          ></el-table-column>
          <el-table-column
            prop="standardNo"
            label="检验标准编号"
          ></el-table-column>
          <el-table-column
            prop="professionCategoryList"
            label="专业类别">
            <template slot-scope="scope">
              <span v-if="scope.row.professionCategoryList">
              {{transform(scope.row.professionCategoryList)}}
             </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="standardType.label"
            label="标准类型">
          </el-table-column>
          <el-table-column
            prop="pubDate"
            label="标准发布日期">
          </el-table-column>
          <el-table-column
            prop="impDate"
            label="标准实施日期">
          </el-table-column>
          <el-table-column
            prop="status.label"
            label="标准状态">
          </el-table-column>
          <el-table-column
            label="操作" width="150px">
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
            port="standard">
          </pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="isAdd?'检验标准添加':'检验标准修改'" :name="isAdd?'addlist':'changelist'">
        <el-form  :model="addForm" size="small" ref="standardForm" label-width="100px">
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="检验标准名称"  :rules='required'>
                <el-input v-model.trim="addForm.name" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="检验标准编号" >
                <el-input v-model.trim="addForm.standardNo" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="标准发布日期" >
                <el-date-picker
                  v-model="addForm.pubDate"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="标准实施日期" >
                <el-date-picker
                  v-model="addForm.impDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="标准类型" >
                <select-from-dict data_type="standard_type" :model.sync="addForm.standardType" className="multiple-select" :clearable="true"></select-from-dict>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="标准状态" >
                <select-from-enum
                        :model.sync="addForm.status"
                        :clearable="true"
                        type="base.StandardStatus"></select-from-enum>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="专业类别" >
                <select-from-table
                  :model.sync="addForm.professionCategoryList"
                  port="profession"
                  :multiple=true
                  className="multiple-select"></select-from-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row><el-col :span="2"  :offset="10">
          <el-button type="success" size="mini" class="save-btn" @click="save('standardForm')"><i class="fa fa-save"></i> 保存</el-button>
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
  import Select2 from '../../components/common/Select2'
  import api from '../../api/index'
    export default {
        name: "InspectionStandard",
      components:{'Select2':Select2},
      data(){
        return{
          activeName:'list',
          searchForm:{},
          isAdd:true,
          tableData:[],
          addForm:{},
          page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
          tablesort:null,
          searchdata:{},
          options:[]
        }
      },
      methods:{
        init(){
          this.$get(api.standard,
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
        console.log(this.searchForm);
       var data=JSON.parse(JSON.stringify(this.searchForm));
       if(data.pubDate){
         data.pubDateFrom=data.pubDate[0].replace(/-/g,"/");
         data.pubDateTo=data.pubDate[1].replace(/-/g,"/");
         delete data.pubDate;
       }
        if(data.impDate){
          data.impDateFrom=data.impDate[0].replace(/-/g,"/");
          data.impDateTo=data.impDate[1].replace(/-/g,"/");
          delete data.impDate;
        };
          this.searchdata=data;
        },

        edit(index,row){
          this.isAdd=false;
          this.activeName='changelist'
          var data=JSON.parse(JSON.stringify(row));

          this.addForm=data;

        },
        deleteRow(index,row){
            this.$confirmBox('确定删除'+row.name+'?').then((res)=>{
            this.$del(api.standard +'/'+row.id).then((res) => {
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
        save(formName){
          var data=JSON.parse(JSON.stringify(this.addForm));
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.activeName == 'addlist') {
                this.$post(api.standard, data).then((res) => {
                  if(res.status==200){
                    this.$message({
                      message: '新增成功！',
                      type: 'success'
                    });
                    this.init();
                    this.$refs[formName].resetFields();
                  }
                }).catch((err) => {console.log(err)})
              } else{
                this.$put(api.standard + '/'+data.id,data).then((res) => {
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
            this.addForm={}
          }
        }
      },
    }
</script>

<style scoped>

</style>
