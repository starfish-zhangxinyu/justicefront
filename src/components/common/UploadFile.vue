<template>
<!--文件上传-->
    <div style="display: inline-block;margin-left:10px">
        <el-button type="primary" size="mini" icon="el-icon-upload" @click="upload" :disabled="isDisabled || false"/>
        <el-dialog
                :append-to-body="appendToBody"
                :title="title"
                :visible.sync="uploadDialog"
                width="40%">

            <div style="overflow: hidden">
                <el-upload
                    action="#"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :multiple="multiple"
                    :limit="100"
                    :auto-upload="false"
                    :file-list="showFileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialog = false">取 消</el-button>
                <el-button type="primary" @click.native.prevent="confirmUpload">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "UploadFile",
        data() {
            return {
                uploadDialog: false,
                showFileList: this.model,
                timer:null,
            }
        },
        props:{
            title:{type:String},
            multiple:{type:Boolean},
            model:{type:Array,default:()=>[]},
            appendToBody:{type:Boolean,default:false},
            isDisabled:{type:Boolean,default:false},
            isUploadImg:{type:Boolean,default:false},
            limit:{type:Number,default:5}
        },
        methods: {
            handleRemove(file, fileList) {
                this.showFileList = [...fileList];
            },
            handleChange(file, fileList) {
                if(fileList.length > this.limit){
                    this.timer?clearTimeout(this.timer):null;
                    this.timer = setTimeout(()=>{
                         this.$message.error(`最多可上传${this.limit}个附件!`);
                    },300)
                    return
                }
                if(this.isUploadImg){//是否只上传图片
                    let arr = [];
                    fileList.forEach((item,index)=>{
                        if(!item.raw.type.includes('image')){
                            this.$message.error('请上传图片文件!');
                            return false
                        }else{
                            arr.push(item);
                        }
                    })
                    this.showFileList = [...arr];
                }else{
                    this.showFileList = [...fileList];
                }
                
            },
            confirmUpload() {
                this.$emit("update:model", [...this.showFileList]);
                this.uploadDialog = false;
            },
            upload() {
                this.uploadDialog = true;
            },
        },
        watch: {
            "model":function(newVal,oldVal){
                this.showFileList = newVal;
            }
        },
    }
</script>

<style scoped></style>
