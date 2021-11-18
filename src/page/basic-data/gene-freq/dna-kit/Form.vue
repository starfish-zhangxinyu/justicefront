<template>
    <el-tabs type="border-card" v-model="activeName" >
        <el-tab-pane label="试剂盒列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'试剂盒添加':'试剂盒修改'" name="form">
            <el-form  :model="addForm" size="small" ref="dnaKitForm" label-width="150px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="名字" prop="name">
                            <el-input type="text" v-model="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16}">
                        <el-form-item label="基因座" >
                            <el-checkbox-group v-model="addForm.dnaBaseLocusList">
                                <el-checkbox style="width:120px;" v-for="locus in allLocus" :label="locus.id" :key="locus.id">{{locus.name}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row><el-col :span="2"  :offset="11">
                <el-button type="success" size="mini" class="save-btn" @click="save('dnaKitForm')"><i class="fa fa-save"></i> 保存</el-button>
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
    import api from '../../../../api'
    export default {
        name: "Form",
        data(){
            return{
                activeName:'form',
                isAdd:true,
                addForm:{
                    dnaBaseLocusList: [],
                },
                allLocus: []
            }
        },
        methods:{
            save(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addForm.dnaBaseLocusList = this.addForm.dnaBaseLocusList.map((val) => {
                            return {id: val}
                        });
                        var data=JSON.parse(JSON.stringify(this.addForm));
                        if(this.isAdd){
                            this.$post(api.dnaKit, data).then((res) => {
                                if(res.status==200){
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path:'/dna/kit/list'}).catch(err => { console.log(err) });
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {console.log(err)})
                        }else{
                            this.$put(api.dnaKit + '/' + data.id, data).then((res) => {
                                if(res.status==200){
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path:'/dna/kit/list'}).catch(err => { console.log(err) });
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                })
            },
        },
        created(){
            this.activeName='form';
            this.$get(api.dnaKit + "/locus").then((res) => {
                this.allLocus = res.data;
            })
            if(this.$route.query.id){
                this.isAdd=false;
                this.$get(api.dnaKit+'/'+this.$route.query.id).then((res)=>{
                    var data=JSON.parse(JSON.stringify(res.data));
                    this.addForm=data;
                    this.addForm.dnaBaseLocusList = this.addForm.dnaBaseLocusList.map(item => item.id);
                })
            }else{
                this.isAdd=true;
            }
        },
        watch:{
            activeName:function (newval,oldval) {
                if(newval=='list'){
                    this.$router.push({path:'/dna/kit/list'}).catch(err => { console.log(err) });
                }
            }
        },
    }
</script>

<style scoped>

</style>