<template>
    <div id="charging-type" >
      <!-- <PageBar title1="基础数据" title2="收费类型"></PageBar> -->

      <el-button type="primary"  size="mini" v-if = "hasPermission('auth:chargeing:type:import')" style="float: left;margin-right: 10px;margin-bottom: 5px" @click="dialogFormVisible = !dialogFormVisible">导入收费类型</el-button>
        <el-table
        :data="tableData"
        :cell-style="cellStyle"
        fit
        stripe
        border
        size="mini"
        style="width: 100%"
        v-loading.fullscreen="initLoading">
        <el-table-column
          prop="key"
          label="关键字">
        </el-table-column>
        <el-table-column
          prop="name"
          label="收费类型名称">
          <template slot-scope="scope">
            <span v-if="scope.row.isEdit">{{scope.row.name}}</span>
            <el-input v-model.trim="scope.row.name" v-if="!scope.row.isEdit" size="small"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="warning"  plain size="mini" @click="edit(scope.$index,scope.row)" v-if="!parseInt(scope.row.delFlag)">{{scope.row.isEdit?'编辑':'保存'}}</el-button>
            <el-button type="danger"  plain size="mini" @click.native.prevent="deleteRow(scope.$index, scope.row)">{{parseInt(scope.row.delFlag)?'恢复':'删除'}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="导入收费项目" :visible.sync="dialogFormVisible">
        <el-form :model="templateFile" size="small" ref="importForm"  label-width="110px">
          <!--                    <el-row>-->
          <!--                        <el-col :lg="{span:16,offset:4}">-->
          <!--                            <el-form-item label="下载模板">-->
          <!--                                <el-button type="primary" @click="downTemplate">下载模板<i class="el-icon-download"></i>-->
          <!--                                </el-button>-->
          <!--                            </el-form-item>-->
          <!--                        </el-col>-->
          <!--                    </el-row>-->
          <el-row>
            <el-col :lg="{span:16,offset:4}">
              <el-form-item label="模板文件" prop="file">
                <el-upload
                        class="upload-demo"
                        action=""
                        :on-change="handleChange"
                        :auto-upload="false"
                        :show-file-list="false"
                        accept=".xlsx"
                        style="width:100%">
                  <el-input v-model="templateFile.name" style="width:100%">
                    <template slot="prepend">请选择文件</template>
                  </el-input>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveImport('importForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import api from '../../api/index'
  import common from "../../../static/js/common";
    export default {
        name: "Chargingtype",
      data(){
          return{
            tableData:[],
            initLoading:true,
            dialogFormVisible:false,
            templateFile: {},

          }
      },
      inject: ["hasPermission"],
      methods:{
            init(){
                this.$get(api.chargingType+'/all').then((res)=>{
                    this.tableData=[].concat(res.data);
                    this.tableData.forEach((v,i)=>{
                        this.$set(v,'isEdit',true);
                    })
                }).catch((err)=>{console.log(err)});
            },
        edit(index,row){
           if(row.isEdit){
             this.tableData[index].isEdit=false;
           }else{

             var data=JSON.parse(JSON.stringify(row));
             delete data.isEdit;
             delete data.createBy;
             delete data.updateBy;
             this.$put(api.chargingType+'/'+row.id,data).then((res)=>{
               if(res.status==200){
                 this.$message({
                   message: '保存成功！',
                   type: 'success'
                 });
                 this.init();
               }

             }).catch((err)=>{console.log(err)})

           }
          },
        saveImport(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = null;
            let p = new Promise((resolve, reject) => {
              if (this.templateFile.raw) {
                common.getBase64(this.templateFile.raw).then((res) => {
                  var fileName = this.templateFile.name;
                  data = {
                    'name': fileName,
                    'base64Str': res,
                    'fileType': fileName.substring(fileName.indexOf('.') + 1, fileName.length + 1)
                  };
                  resolve();
                })
              } else {
                resolve();
              }
            });
            p.then((res) => {
              this.$post(api.chargingType + '/import', data).then((res) => {
                if (res.status == 200) {
                  this.$message({
                    message: "导入成功！",
                    type: 'success'
                  });
                  this.dialogFormVisible = false;
                  this.$get(api.chargingType+'/all').then((res)=>{
                    this.initLoading = false;
                    this.tableData=[].concat(res.data);
                    this.tableData.forEach((v,i)=>{
                      this.$set(v,'isEdit',true);
                    })
                  }).catch((err)=>{console.log(err)});
                }
              }).catch(err=>{
                  this.$message.error(err.errMsg);
                  this.$getFormData('/api'+err.extraInfo).then(res=>{
                      this.download(res.data,res.headers["content-disposition"].split("=")[1])
                  }).catch(error=>{
                      this.$message({
                          message: '导入错误，请联系管理员',
                          type: 'error'
                      });
                  })
              })
            });
          }
        })
      },
        handleChange(file, fileList) {
          this.templateFile = file;
        },
        deleteRow(index,row){
            var delFlag=parseInt(row.delFlag);
          if(!delFlag){
              this.$confirmBox('确定删除收费类型'+row.name+'吗?').then((res)=>{
              this.$del(api.chargingType+'/'+row.id).then((res) => {
                if(res.status==200){
                  this.$message({
                    message: '删除成功！',
                    type: 'success'
                  });
                  this.init();
                }
              }).catch((err)=>{console.log(err)});
            }).catch((err)=>{});
          }else{
           this.$post(api.chargingType+'/'+row.id).then((res)=>{
             if(res.status==200){
               this.$message({
                 message: '恢复成功！',
                 type: 'success'
               });
                 this.init();
             }
           }).catch((err)=>{console.log(err)})
          }


        },

        cellStyle({row, column, rowIndex, columnIndex}) {
            var delFlag=parseInt(row.delFlag);
          if (delFlag) {
            return {
              "background-color": "#909399"
            };
          }else{
            return {
              "background-color": ""
            };
          }
        }

        },
      created:function () {
        this.$store.dispatch("login/headerTitleChange", "收费类型");
       this.$get(api.chargingType+'/all').then((res)=>{
         this.initLoading = false;
         this.tableData=[].concat(res.data);
         this.tableData.forEach((v,i)=>{
           this.$set(v,'isEdit',true);
         })
       }).catch((err)=>{console.log(err)});
      }
    }
</script>

<style scoped>

</style>
