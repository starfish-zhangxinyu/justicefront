<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="区域列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'区域添加':'区域修改'" name="form">
            <el-form  :model="addForm" size="small" ref="areaForm" label-width="100px">
                <el-row>
                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="上级区域" label-width="10%" >
                            <treeSelect title="区域" :model.sync="addForm.area" name="area"></treeSelect>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="区域名称" label-width="10%" :rules="$filter_rules({required:true,maxLength:50})" prop="name">
                            <el-input v-model.trim="addForm.name" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="区域编码" label-width="10%" prop="code">
                            <el-input v-model.trim="addForm.code"></el-input>
                        </el-form-item>
                    </el-col>

                    <!--<el-col :lg="{span:16,offset:4}">-->
                        <!--<el-form-item label="区域类型"  label-width="10%" >-->
                            <!--<select-from-dict :model.sync="addForm.areaType" data_type="sys_area_type" :clearable="true"></select-from-dict>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="备注" label-width="10%" >
                            <el-input v-model="addForm.remarks" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>

                </el-row>
            </el-form>
            <el-row><el-col :lg="{span:16,offset:4}">
                <el-button type="success" size="mini" class="save-btn" @click="save('areaForm')"><i class="fa fa-save"></i> 保存</el-button>
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
                addForm:{area:{name:''}},
                flag:true,
            }
        },
        methods:{
            save(formName){
                var data=JSON.parse(JSON.stringify(this.addForm));
                data.parent={'id':data.area.id};
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.activeName=='addlist'){
                            if(this.flag){
                                console.log(data,'新增')
                                this.$post(api.area,data).then((res)=>{
                                    if(res.status==200){
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success'
                                        });
                                    }
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }).catch((err)=>{console.log(err)})
                            }else{
                                console.log(data,'添加下级区域')
                                this.$post(api.area,data).then((res)=>{
                                    if(res.status==200){
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success'
                                        });
                                    }
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }).catch((err)=>{console.log(err)})
                            }

                        }else{
                            console.log(data,'修改')
                            this.$put(api.area + '/'+data.id,data).then((res)=>{
                                if(res.status==200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }

                            }).catch((err)=>{console.log(err)})
                        }
                    }
                })
            },
        },
        created(){
            this.activeName='form';
            if(this.$route.query.id){
                this.isAdd=false;

            }else{
                if(this.$route.query.parentId){
                    this.flag=false;
                }
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