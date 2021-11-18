<template>
<!--多图上传（按钮上传）-->
    <div style="display: inline-block;margin: 0 10px" class="upload11">
        <el-button type="primary" size="mini" icon="el-icon-upload" @click="upload" :disabled="isDisabled || false"></el-button>
        <el-dialog
                :append-to-body="appendToBody"
                :title="title"
                :visible.sync="uploadDialog"
                :accept="isUploadPdf ? '':'image/png, image/jpeg,image/jpg'"
                width="40%">
            <div style="overflow: hidden">
                <el-upload
                        style="float: left"
                        :multiple="multiple"
                        list-type="picture-card"
                        action="#"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :on-change="handleChange"
                        :show-file-list="true"
                        :file-list="showFileList"
                        :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">{{isUploadPdf ? '选取文件': '选取图片'}}</el-button>
                </el-upload>
            </div>


            <el-dialog :visible.sync="dialogVisible" size="tiny" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog = false">取 消</el-button>
                <el-button type="primary" @click.native.prevent="confirmUpload">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Uploadpictures",
        data() {
            return {
                uploadDialog: false,
                showFileList: [],
                confirmList: [],
                dialogImageUrl: '',
                dialogVisible: false,
            }
        },
        props: ['title', 'multiple', 'model', 'appendToBody','isDisabled','isUploadImg','isUploadPdf'],
        methods: {
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleRemove(file, fileList) {
                this.showFileList = [];
                this.showFileList = [].concat(fileList);
            },
            handleChange(file, fileList) {
                if(this.isUploadImg && !this.isUploadPdf){//是否只上传图片
                    let arr = [];
                    fileList.forEach((item,index)=>{
                        if(!item.raw.type.includes('image')){
                            this.$message.error(`请上传图片文件!`);
                            return false
                        }else{
                            arr.push(item);
                        }
                    })
                    this.showFileList = [...arr];
                }else{
                    this.showFileList = [...fileList];
                }

                if(this.isUploadImg && this.isUploadPdf){//是否上传pdf或图片
                    let arr = [];
                    fileList.forEach((item,index)=>{
                        if(!item.raw.type.includes('image') && !item.raw.type.includes('pdf')){
                            this.$message.error('请上传图片或pdf文件!');
                            return false
                        }else{
                            arr.push(item);
                        }
                    })
                    this.showFileList = [...arr];
                }else{
                    
                    /* this.showFileList = [...fileList]; */
                }
                
            },
            confirmUpload() {
                this.confirmList = [].concat(this.showFileList);
                this.uploadDialog = false;
            },
            upload() {
                this.uploadDialog = true;
                this.showFileList = this.model;
            }
        },
        watch: {
            confirmList: {
                handler(newval, oldval) {
                    this.$emit("update:model", newval);
                },
                immediate: true
            },
            'model': {
                handler(newval, oldval) {
                    if(newval){
                        this.confirmList = newval;
                        var arr=[].concat(newval);
                        this.showFileList=arr;

                    }else{
                        this.confirmList=[];
                    }

                },
                immediate: true
            }
        },
        created() {
            var arr=[].concat(this.model);
            this.showFileList=arr;

        }
    }
</script>

<style scoped>

</style>
