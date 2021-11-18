<template>
    <div id="file-wall">
        <div class="file-item" v-for="(v,i) in list" :key="i" v-if="!isType2">
            <img  :src="createUrl(v)" alt="" class="item" v-if="(v.fileType=='jpg'||v.fileType=='png')">
            <div class="item file" v-if="v.fileType!='jpg'&&v.fileType!='png'" >
                <i class="fa fa-folder" aria-hidden="true" style="font-size: 18px;margin: 0 5px;color: #DBC056"></i>
                <span>{{v.name}}</span>
            </div>
            <el-button type="danger" size="mini" style="width: 100%;" @click="deleteFile(i)">删除</el-button>
        </div>
            <div class="file-item" v-for="(v,i) in list" :key="i" v-if="isType2">
                <el-image v-if="v.url&&v.url.includes('jpg')||v.url&&v.url.includes('png')||v.url&&v.url.includes('jpeg')||v.fileType=='jpg'
                        ||v.fileType=='png' ||v.raw && v.raw.type.includes('png') || v.raw && v.raw.type.includes('jpg') || v.raw && v.raw.type.includes('jpeg')"
                          class="item" :src="createUrl(v)">
                </el-image>
                <div class="item file flexBox" v-else>
                    <i class="fa fa-folder" aria-hidden="true" style="font-size: 18px;margin: 0 5px;color: #DBC056"></i>
                    <span v-if="v.isNowUpload">{{v.name||`附件${i+1}`}}</span>
                    <a v-if="!v.isNowUpload" onclick="return false;" :href="createUrl(v)" target="_blank" :download="v.name||`附件${i+1}`" @click="handleClick(createUrl(v), v.name, i)" class="hover">{{v.name||`附件${i+1}`}}</a>
                </div>
                <el-button type="danger" size="mini" style="width: 100%;" @click="deleteFile(i)">删除</el-button>
            </div>
        </div >
</template>

<script>
    //base64Str name fileUrl fileType
    export default {
        name: "FileWall",
        props: {
            model:{
                type:Array,
                default:()=>[]
            },
            isType2:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                list: this.model,
            }
        },
        methods: {
            deleteFile(index){
               this.list.splice(index,1) ;
            },
            createUrl(file) {
                if (file.raw) {
                    return URL.createObjectURL(file.raw);
                } else {
                    return file.url;
                }

            },
            handleClick(url, name, i) {
                let fileName = name || `附件${i + 1}`;
                fetch(url)
                    .then((response) => {
                        if (response.status == 200)
                        // 返回的.blob()为promise，然后生成了blob对象，此方法获得的blob对象包含了数据类型，十分方便
                            return response.blob();
                        throw new Error(`status: ${response.status}.`);
                    })
                    .then((blob) => {
                        // 获取到blob对象
                        this.downloadBlobFile(fileName, blob);
                    })
                    .catch((error) => {
                        console.log("failed cause:", error);
                    });
            },
            downloadBlobFile(name, blob) {
                // 创建a标签
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                // download属性
                link.setAttribute("download", name);
                // href链接
                link.setAttribute("href", url);
                // 自执行点击事件
                link.click();
            },
        },
        watch: {
            'model': {
                handler(newVal, oldVal) {
                    this.list = newVal;
                },
                immediate: true,
                deep: true
            },
            list: {
                handler(newVal, oldVal) {
                    this.$emit("update:model", newVal);
                },
                immediate: true,
                deep: true
            }
        },
        created() {

        }
    }
</script>

<style scoped lang="less">
    .hover:hover {
        color:red;
    }
    #file-wall {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .file-item {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        width: 146px;
        margin: 10px 10px;
        box-sizing: content-box;
    }

    .item {
        border-radius: 6px;
        width: 146px;
        height: 146px;
        border-bottom: 1px solid #d9d9d9;
    }

    .file {
        display:table-cell;
        vertical-align:middle;
        text-align:center;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        font-size: 14px;
        color: #333;
    }
    .flexBox{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 7px;
    }
</style>