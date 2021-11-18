<template>
    <div id="form-template">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基因频率列表" name="list"></el-tab-pane>
            <el-tab-pane label="基因频率导入" name="import">
                <el-form :model="addForm" size="small" ref="ftForm" :rules="rule" label-width="150px"
                         v-loading="loading"
                         element-loading-text="导入中，请稍等...">
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="下载模板" >
                                <el-button type="primary" @click="dowmTemplete">下载模板<i class="el-icon-download"></i></el-button>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{span:16}">
                            <el-form-item label="基因频率分布名称" prop="dnaFrequencyTypeId" >
                                <el-select v-model="addForm.dnaFrequencyTypeId" class="w100" placeholder="请选择">
                                    <el-option
                                            v-for="item in options"
                                            :key="item.id"
                                            :label="item.label"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :lg="{span:16}">
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
                                <!--</el-col>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('ftForm')"><i
                                class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                                class="el-icon-arrow-left"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Test from '@/components/common/TreeSelect'
    import Select2 from '@/components/common/Select2'
    import api from '@/api/index'
    import common from '../../../../../static/js/common'

    export default {
        name: "FormTemplate",
        components: {'Select2': Select2, 'treeSelect': Test},
        data() {
            var nameDistinct=(rule, value, callback)=> {
                if(this.templateFile.name && this.templateFile.name.indexOf("xlsx")!=-1){
                    callback();
                }else {
                    callback(new Error("请上传excel格式的模板文件"))
                }
            }
            return {
                activeName: 'import',
                addForm: {dnaFrequencyTypeId: null},//新增模板
                templateFile: {},//模板文件
                options:[],
                rule:{
                    dnaFrequencyTypeId: [
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'},
                    ],
                    file:[{ validator: nameDistinct, trigger: 'change'  },]
                },
                loading: false
            }
        },
        methods: {
            transform(arr) {
                var str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].name + ',';
                }
                return str.substr(0, str.length - 1);
            },
            handleChange(file, filelist) {
                this.templateFile = file;
            },

            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let data = JSON.parse(JSON.stringify(this.addForm));
                        let p = new Promise((resolve, reject) => {
                            if (this.templateFile.raw) {
                                common.getBase64(this.templateFile.raw).then((res) => {
                                    var fileName = this.templateFile.name;
                                    data.file = {
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
                            this.loading = true;
                            this.$post(api.geneFreq+'/import', data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: res.data,
                                        type: 'success'
                                    });
                                    this.loading = false;
                                    this.activeName='list';
                                }
                            })
                        });
                    }
                })
            },
            handleClick(tab, event) {
                //重置表单
                this.$refs["ftForm"].resetFields();
            },
            download(data, name) {
                if (!data) {
                    return;
                }
                let url = window.URL.createObjectURL(new Blob([data]));
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                link.setAttribute("download", name);
                document.body.appendChild(link);
                link.click();
            },
            dowmTemplete(){
                this.$getFormData(api.template+'/download',{'templeleName':"基因频率导入模板.xlsx"}).then(res=>{
                    debugger;
                    this.download(
                        res.data,
                        "基因频率导入模板.xlsx"
                    );
                }).catch(err=>{

                })
            }
        },
        created(){
            this.$get(api.dict,{type:'dna_frequency_type'}).then(res=>{
                this.options = res.data.list
            }).catch(err=>{})
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/gene-freq/list'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },

    }
</script>

<style scoped lang="less">
    .upload-demo /deep/ .el-upload {
        width: 100% !important;
    }

</style>