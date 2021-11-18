<template>
    <!--选择已经上传的图片-->
        <el-dialog title="选择照片" :visible.sync="dialogVisible" @close='closeDialog'>
            <div style="overflow: hidden">
                <div class="picture-card" v-for="(v,i) in images" @click="clickPicture(i)">
                    <i class="el-icon-success icon" v-if="v.active"></i>
                 <img :src="v.photo.imageUrl"  class="picture">
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="selectAll">全选</el-button>
                <el-button type="primary" @click="confirm">确定导入</el-button>
            </div>
        </el-dialog>
</template>

<script>
    export default {
        name: "SelectImages",
        props:['imagesSource','isShow','confirmList'],
        data(){
            return{
                dialogVisible:this.isShow,
                images:[],
                selectedImages:[],
            }
        },
        methods:{
            clickPicture(index){
            this.$set(this.images[index],'active',!this.images[index].active);
            if(this.images[index].active){
                this.selectedImages.push(this.images[index]);
            }
            },
            judgeActive(arr){
                for(var i=0;i<arr.length;i++){
                    if(!arr[i].active){
                        return false;
                    }
                }
                return true;
            },
            selectAll(){
               var flag=this.judgeActive(this.images);
               if(flag){
                   this.images.forEach((v,i)=>{
                       this.$set(v,'active',false);
                   });
                   this.selectedImages=[];
               }else{
                   this.images.forEach((v,i)=>{
                       this.$set(v,'active',true);
                       this.selectedImages.push(v);
                   });
               }
            },
            closeDialog(){
               this.selectedImages=[] ;
                this.images.forEach((v,i)=>{
                    this.$set(v,'active',false);
                });
            },
            confirm(){
                var data=[].concat(this.selectedImages);
                this.$emit("update:confirmList", data);
                this.dialogVisible=false;
            }
        },
        watch:{
            'isShow':{
                handler(newval,oldval){
                    this.dialogVisible=newval;
                },
                immediate: true
            },

            dialogVisible:{
                handler (newval,oldval) {
                    this.$emit("update:isShow", newval);
                },
                immediate: true,
            },

        },
        created(){
            this.images=[
                {photo:{
                        imageUrl:'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                    },active:false},
                {photo:{
                        imageUrl:' "http://images.qihelc.com/dingcheng/avatar/1451667769247.jpg"'
                    },active:false}

            ];
        }
    }
</script>

<style scoped lang="less">
.picture-card{
    height:150px;
    width: 150px;
    position: relative;
    float: left;
    margin: 10px;
}
 .picture{
     height:150px;
     width: 150px;
 }
 .icon {
     font-size: 32px;
     color: #67C23A;
     position: absolute;
     top: -10px;
     right: -10px;
     z-index: 99;
 }
</style>