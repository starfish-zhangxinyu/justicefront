<template>
    <!--照片墙-->
    <div id="picture-wall" v-if="imageList.length">
        <div :class="[position!='table'?'avatar':'avatar-table']" v-for="(v,i) in imageList" v-if="hasTitle">
            <div  class="mask-module">
                <div class="mask">
                            <span>
                            <i class="el-icon-zoom-in"  @click="handlePreview(i)"></i>
                            <i class="el-icon-delete" @click="handleDelete(i)"></i>
                            </span>
                </div>
                <img :src="createUrl(v.photo || v)" class="head-portrait">
            </div>
            <el-input type="textarea" :rows="1" autosize size="mini" v-model.sync="v.photoName"></el-input>
        </div>
        <div :class="[position!='table'?'avatar':'avatar-table']" v-for="(v,i) in imageList" v-if="!hasTitle">
            <div  class="mask-module">
                <div class="mask">
                            <span>
                            <i class="el-icon-zoom-in" @click="handlePreview(i)"></i>
                            <i class="el-icon-delete" @click="handleDelete(i)"></i>
                            </span>
                </div>
                <img :src="createUrl(v)" class="head-portrait">
            </div>
        </div>
        <el-dialog  :visible.sync="imgPreviewVisible"  append-to-body>
            <div>
                <img :src="createUrl(previewSrc)" style="width: 100%">
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PictureWall",
        //hasTitle如果为true,绑定的数据格式[{photo:{name:'',type:'',...},photoName:''},...],如果为false,数据格式为[{name:'',type:'',...},...]
        //position照片墙如果位于表格中 样式class为avatar-table
        props:['model','hasTitle','position'],
        data(){
            return{
                imageList:this.model,
                imgPreviewVisible:false,
                previewSrc:'',
            }
        },
        methods:{
            createUrl(file){
                    if(file && file.raw){
                        return URL.createObjectURL(file.raw);
                    }else{
                        return file.url;
                    }
            },
            handleDelete(index){
                this.imageList.splice(index,1);
            },
            handlePreview(index){
                this.imgPreviewVisible=true;
                if(this.hasTitle){
                    this.previewSrc=this.imageList[index].photo;
                }else{
                    this.previewSrc=this.imageList[index];
                }

            }
        },
        watch:{
            'model':{
                handler(newval,oldval){
                    this.imageList=newval;
                },
                immediate: true,
                deep: true
            },

            imageList:{
                handler (newval,oldval) {
                    this.$emit("update:model", newval);
                },
                immediate: true,
                deep: true
            },

        },

    }
</script>

<style scoped lang="less">
    #picture-wall{
        width: 100%;
        margin: 0 auto;
        display:flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .avatar-table {
        width: 100px;
        position: relative;
        margin-right: 10px;
        .mask{
            width: 100px;
            height: 100px;
            background-color: rgba(0,0,0,0.3);
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            text-align: center;
            .el-icon-zoom-in{
                color: white;
                font-size: 25px;
                line-height: 100px;
                margin-right: 5px
            }
        .el-icon-delete{
            color: white;
            font-size: 25px;
            line-height: 100px
        }
        }
        .head-portrait{
            width: 100px;
            height: 100px;
        }
        .mask-module{
            width: 100px;
            height: 100px;
        }
        .mask-module:hover{
            .mask{
                display: block;
            }
        }
    }

    .avatar {
        width: 146px;
        margin: 10px 10px;
        position: relative;
        .mask{
            border: 1px dashed #d9d9d9;
            width: 146px;
            height: 146px;
            border-radius: 6px;
            background-color: rgba(0,0,0,0.3);
            position: absolute;
            top: 0;
            left: 0;
            display: none;
            text-align: center;
            .el-icon-zoom-in{
                color: white;
                font-size: 30px;
                line-height: 146px;
                margin-right: 5px
            }
            .el-icon-delete{
                color: white;
                font-size: 30px;
                line-height: 146px
            }
        }
        .head-portrait{
            border: 1px dashed #d9d9d9;
            width: 146px;
            height: 146px;
            border-radius: 6px;
            box-sizing: content-box;
        }
        .mask-module{
            width: 146px;
            /*height: 146px;*/
        }
        .mask-module:hover{
            .mask{
                display: block;
            }
        }
    }


</style>