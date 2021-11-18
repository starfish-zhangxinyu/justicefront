<template>
    <!--单图上传-->
    <div>
        <div class="avatar">
            <div v-if="url" class="mask-module">
                <div class="mask">
                    <i class="el-icon-delete" style="color: white;font-size: 30px;line-height: 176px"
                       @click="handleDelete"></i>
                </div>
                <img :src="url" class="head-portrait">
            </div>
        </div>
        <el-upload
                action="#"
                :show-file-list="false"
                :on-change="handleChange"
                :auto-upload="false">
            <el-button size="small" type="primary">选择图片</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "SimpleUpload",
        props: ['model'],
        data() {
            return {
                url: '',
                file: this.model,
            }
        },
        methods: {
            handleChange(file, fileList) {
                this.file = file;
                this.url = URL.createObjectURL(file.raw);
            },
            handleDelete() {
                this.file = {};
                this.url = null;
            }
        },
        watch: {
            'model': function (newval, oldval) {
                this.file = newval;
                if (this.file) {
                    if (this.file.raw) {
                        this.url = URL.createObjectURL(this.file.raw);
                    } else {
                        this.url = this.file.url;
                    }
                } else {
                    this.url ='';
                }
            },
            file: function (newval, oldval) {
                this.$emit("update:model", newval);
            }
        },
        created: function () {
            if (this.model) {
                this.url = this.model.url;
            }
        }
    }
</script>

<style scoped lang="less">
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
        border-radius: 6px;
        border: 1px dashed #d9d9d9;
        margin-bottom: 10px;
        position: relative;
    }

    .mask {
        width: 176px;
        height: 176px;
        border-radius: 6px;
        background-color: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: 0;
        left: 0;
    }

    .head-portrait {
        width: 176px;
        height: 176px;
        border-radius: 6px;
    }

    .mask {
        display: none;
        text-align: center;
    }

    .mask-module:hover {
        .mask {
            display: block;
        }
    }
</style>
