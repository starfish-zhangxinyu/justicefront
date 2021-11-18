<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="受理地点列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'受理地点添加':'受理地点修改'" name="form">
            <el-form  :model="addForm" size="small" ref="stationForm" label-width="100px">
                <el-row>
                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="受理地点" prop="name" :rules="$filter_rules({required:true})">
                            <el-input v-model.trim="addForm.name" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="排序" prop="sort" :rules="$filter_rules({required:true})">
                            <el-input v-model.number="addForm.sort" ></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16,offset:4}">
                        <el-form-item label="备注"  >
                            <el-input v-model="addForm.remarks" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row><el-col :span="2"  :offset="10">
                <el-button type="success" size="mini" class="save-btn" @click="save('stationForm')"><i class="fa fa-save"></i> 保存</el-button>
            </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                            class="el-icon-arrow-left"></i> 返回
                    </el-button>
                </el-col>
            </el-row>

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
                addForm:{name:'',sort:'',remarks:''},
            }
        },
        methods:{
            save(formName){
                var data=JSON.parse(JSON.stringify(this.addForm));
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.isAdd){
                            console.log(data,'新增');
                            this.$post(api.acceptStation, data).then((res) => {
                                if(res.status==200){
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {console.log(err)})

                        }else{
                            console.log(data,'修改');
                            this.$put(api.acceptStation + '/'+data.id,data).then((res) => {
                                if(res.status==200){
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                })
            }
        },
        created(){
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