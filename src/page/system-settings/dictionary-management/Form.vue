<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="字典列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'字典添加':'字典修改'" name="form">
            <el-form  :model="addForm" size="small" ref="dictForm" label-width="100px">
                <el-row>
                    <!--<el-col :lg="{span:16,offset:4}">-->
                        <!--<el-form-item label="键值" :rules="$filter_rules({required:true,maxLength:50})" prop="value">-->
                            <!--<el-input v-model.trim="addForm.value" ></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="标签" :rules="$filter_rules({required:true,maxLength:50})" prop="label">
                            <el-input v-model.trim="addForm.label" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="类型" :rules="$filter_rules({required:true,maxLength:50})" prop="type" >
                            <el-input v-model.trim="addForm.type"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="描述"  :rules="$filter_rules({required:true,maxLength:50})" prop="description">
                            <el-input v-model.trim="addForm.description"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="排序" label-width="10%" :rules="$filter_rules({required:true})" prop="sort">
                            <el-input v-model.number="addForm.sort" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="备注" label-width="10%" >
                            <el-input v-model="addForm.remarks" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row><el-col :span="2"  :offset="11">
                <el-button type="success" size="mini" class="save-btn" @click="saveDict('dictForm')"><i class="fa fa-save"></i> 保存</el-button>
            </el-col></el-row>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'
    export default {
        name: "Form",
        data(){
            return{
                activeName:'form',
                isAdd:true,
                addForm:{},
            }
        },
        methods:{
            //保存修改或者修改的内容
            saveDict(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        //新增
                        if(this.activeName=='addlist'){
                            var data=JSON.parse(JSON.stringify(this.addForm));
                            this.$post(api.dict,data).then((res)=>{
                                if(res.status==200){
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                }
                                this.dictInit();
                                this.$refs[formName].resetFields();
                            }).catch((err)=>{console.log(err)})
                            //修改
                        }else if(this.activeName=='changelist'){
                            var data=JSON.parse(JSON.stringify(this.addForm));
                            delete data.createBy;
                            delete data.updateBy;
                            console.log(data,'0000');
                            this.$put(api.dict + '/'+this.addForm.id,data,
                            ).then((res) => {
                                if(res.status==200){
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.dictInit();
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                });
            }
        },
        created(){
            this.$get('/api/dict/v1/dicts/types').then((res)=>{
                this.typeOpt=res.data;
            }).catch((err)=>{console.log(err)});
            this.activeName='form';
            if(this.$route.query.id){
                this.isAdd=false;

            }else{
                this.isAdd=true;
            }

        },
        watch:{
            activeName:function (newval,oldval) {
                if(newval=='list'){
                    this.$router.push({path:''}).catch(err => { console.log(err) });
                }
            }
        },
    }
</script>

<style scoped>

</style>