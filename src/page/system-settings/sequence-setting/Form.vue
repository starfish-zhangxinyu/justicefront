<template>
    <div>
        <el-tabs type="border-card" v-model="activeName" >
            <el-tab-pane label="顺序号列表" name="listPage"></el-tab-pane>
            <el-tab-pane label="修改" name="formPage">

                    <el-form :model="formData" size="small" ref="formData" label-width="120px" :rules="rules">
                        <el-row>
                            <el-col :lg="{span:12,offset:6}">
                                <el-form-item label="机构" prop="name" >
                                    <el-input v-model.trim="formData.org.name" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:12,offset:6}">
                                <el-form-item label="鉴定意见类型" prop="reportTypeFlag" >
                                    <el-input v-model.trim="formData.reportTypeFlag" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:12,offset:6}">
                                <el-form-item label="案号标志" prop="caseNoFlag" >
                                    <el-input v-model.trim="formData.caseNoFlag" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :lg="{span:12,offset:6}">
                                <el-form-item label="顺序号" prop="sequence">
                                    <el-input v-model.number="formData.sequence" maxlength="10"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row>
                        <el-col :span="2" :offset="10">
                            <el-button type="success" size="mini" class="save-btn" @click="save('formData')"><i
                                    class="fa fa-save"></i> 保存
                            </el-button>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" size="mini" class="save-btn" @click="activeName='listPage'"><i
                                    class="el-icon-arrow-left"></i> 返回
                            </el-button>
                        </el-col>
                    </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import api from '@/api/index.js'
    import treeSelect from '@/components/common/TreeSelect.vue'
    export default {
        name: "Form",
        components:{treeSelect},
        data(){
            let validateSequence=(rule,value,callback)=>{
                if(value || value == 0){
                    if( typeof value !== 'number'){
                        callback(new Error("请输入数字"));
                    }
                    if((value+"").length>11){
                        callback(new Error("最多输入11个字符的数字"));
                    }

                }else {
                    callback(new Error("请输入顺序号"));
                }
                callback();
                };
            return{
                activeName:'formPage',
                formData:{
                    id:'',
                    org:{
                        id:'',
                        name:'',
                    },
                    reportTypeFlag:'',
                    caseNoFlag:'',
                    sequence:0
                },
                rules:{
                    sequence: [{validator:validateSequence,trigger:'blur'}
                    ],

                }
            }
        },
        methods:{
            save(form){
                this.$refs[form].validate((valid)=>{
                    if(valid){
                            console.log(this.formData,'formData')
                            this.$post(api.sequenceSetting,this.formData).then(res=>{
                                this.$message.success("操作成功！");
                                this.activeName='listPage';
                            }).catch(err=>{
                                console.log(err)
                                this.$message.error("操作失败，请联系管理员！")
                            })
                            console.log(this.formData)
                    }
                });
            },
        },
        created() {
            let queryId = this.$route.query.id
            if(queryId){
                this.formData.id=queryId;
                this.$get(api.sequenceSetting+'/'+queryId).then(res=>{
                    if(res.status=='200'){
                        this.formData=res.data;
                    }
                }).catch(err=>{})
            }

        },
        watch:{
            activeName:function (newVal,oldVal) {
                if(newVal=='listPage'){
                    this.$router.push({path:'/system/sequence-setting/list'}).catch(err=>{})
                }
            }
        }
    }
</script>

<style scoped>

</style>