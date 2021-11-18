<template>
    <!--单文件上传-->
    <div style="width: 30%">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :auto-upload="false">
        <el-button size="small" type="primary">选取文件</el-button>
      </el-upload>
      <el-button size="small" type="success" @click="save" style="margin-top: 20px">保存</el-button>
    </div>
</template>

<script>
    export default {
        name: "Importfile",
      data(){
          return{
          filelist:[],
          }
      },
      methods:{
        getBase64(file) {
          return new Promise(function(resolve, reject) {
            let reader = new FileReader();
            let Result = "";
            reader.readAsDataURL(file);
            reader.onload = function() {
              Result = reader.result;
            };
            reader.onerror = function(error) {
              reject(error);
            };
            reader.onloadend = function() {
              resolve(Result);
            };
          });
        },
        handleChange(file, fileList){
          this.filelist=[];
          this.filelist.push(file);
        },
        handleRemove(file, fileList){
          let index = this.filelist.indexOf(file.key)
          this.filelist.splice(index, 1)
        },
        save(){
          let file = this.filelist[0].raw;
          let filename = file.name;
          let filetype=file.type;
          let data={'name':filename,'fileType':filetype,'base64Str':''};

            this.getBase64(file).then(res => {
             data.base64Str=res;
            });
          }
      },
    }
</script>

<style scoped>

</style>
