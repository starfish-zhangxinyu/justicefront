<template>
    <div id="not-case-data">
      <PageBar title1="案件管理" :title2="activeName=='dataadd'?'归档':'非案件资料'"></PageBar>
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="非案件资料列表" name="datalist">
          <div class="search-box" style="overflow: hidden">
            <el-form  :model="searchNotCase" size="small" >
              <el-row>
                <el-col :span="7"  :offset="3">
                  <el-form-item label="资料名称">
                    <el-input v-model="searchNotCase.name"  style="width: 80%;"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7"  :offset="3">
                  <el-form-item label="资料上传人" >
                    <el-input v-model="searchNotCase.name"  style="width: 80%;" disabled>
                      <!--<el-button icon="el-icon-close" slot="append" @click="clearContent"></el-button>-->
                      <!--<el-button icon="el-icon-search" slot="append" @click="selectClientDialog= true"></el-button>-->
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="1"  :offset="2">
                  <el-button plain icon="el-icon-search" size="small" style="background-color: #5bc0de;color: white">查询</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <el-button-group style="margin-bottom: 10px">
            <el-button plain icon="el-icon-upload2" size="small" style="background-color: #5bc0de;color: white">上传</el-button>
            <el-button plain icon="el-icon-download" size="small" style="background-color: #5bc0de;color: white">下载</el-button>
          </el-button-group>
          <el-table
            border
            size="small"
            ref="multipleTable"
            :data="tableData"
            height="250px"
            style="width: 100%">
            <el-table-column  fixed width="55">
              <template slot-scope="scope" >
                <el-checkbox v-model="scope.row.checked" @change="checkChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="资料名称">
            </el-table-column>
            <el-table-column
              prop="address"
              label="资料上传人">
            </el-table-column>
            <el-table-column
              prop="address"
              label="资料上传时间">
            </el-table-column>
            <el-table-column
              label="操作">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="非案件资料添加" name="dataadd">
          <el-form  :model="AddNotCaseAdd" size="small">
            <el-row><el-col :span="12"  :offset="3">
              <el-form-item label="资料名称" :rules='required'>
                <el-input v-model="AddNotCaseAdd.name"  style="width: 80%"></el-input>
              </el-form-item>
            </el-col></el-row>
            <el-row><el-col :span="12"  :offset="3">
              <el-form-item label="资料文件" :rules='required'>
                <div style="margin-left: 80px">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :file-list="fileList"
                    list-type="picture"
                    :auto-upload="false">
                    <el-button  size="small" type="primary" slot="trigger">选取文件</el-button>
                  </el-upload>
                </div>
              </el-form-item>
            </el-col></el-row>
            <el-row><el-col :span="12"  :offset="3">
              <el-form-item label="备注" :rules='required'>
                <el-input type="textarea" v-model="AddNotCaseAdd.desc" style="width: 80%"></el-input>
              </el-form-item>
            </el-col></el-row>
          </el-form>
          <el-row><el-col :span="1"  :offset="4">
          <el-button type="success" size="mini" class="save-btn" @click=""><i class="fa fa-save"></i> 保存</el-button>
          </el-col></el-row>
        </el-tab-pane>
      </el-tabs>

    </div>
</template>

<script>
    export default {
        name: "NotCaseData",
      data(){
          return{
            searchNotCase:{},
            tableData:[],
            AddNotCaseAdd:{},
            fileList:[],
            activeName:'datalist'
          }
      },
      methods:{
        handleRemove(file,fileList){
          this.fileList=[];
        },
        handleChange(file,fileList){
          this.fileList=[];
          this.fileList.push(file);
        },
      }
    }
</script>

<style scoped >
.upload-demo{
  width: 80%
}
</style>
