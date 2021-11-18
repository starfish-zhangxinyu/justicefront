<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="试剂盒列表" name="list"></el-tab-pane>
        <el-tab-pane label="试剂盒添加" name="form"></el-tab-pane>
        <el-tab-pane label="基因座排序修改" name="locusSortForm">
            <el-form :model="addForm" ref="addForm">
                <el-table
                        fit
                        stripe
                        border
                        size="mini"
                        :data="addForm.dnaBaseLocusList"
                        height="800">
                    <el-table-column label="序号">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="基因座名称">
                    </el-table-column>
                    <el-table-column label="排序">
                        <template slot-scope="scope">
                            <el-form-item :prop="'dnaBaseLocusList.' + scope.$index + '.sort'" :rules="$filter_rules({required:true})">
                                <el-input v-model="scope.row.sort" type="number"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>

            </el-form>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="success" size="mini" class="save-btn" @click="save('addForm')"><i
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
</template>

<script>
    import api from '../../../../api'

    export default {
        name: "LocusSortForm",
        data() {
            return {
                activeName: 'locusSortForm',
                addForm:{},
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                       var data = this.addForm;
                       if (data.dnaBaseLocusList.length!=0) {
                           this.$put(api.dnaKit + '/locusSort', data).then((res) => {
                               if(res.status==200){
                                   this.$message({
                                       message: '修改成功！',
                                       type: 'success'
                                   });
                                   this.activeName='locusSortForm';
                                   this.$get(api.dnaKit+'/sort/'+this.$route.query.id).then((res)=>{
                                       var data=JSON.parse(JSON.stringify(res.data));
                                       this.addForm=data;
                                   })
                               }
                           })
                       }
                    }else {
                        this.$message({message:"排序为必填,且只能填数字",type:"error"})
                    }
                })
            },
        },
        created(){
            this.activeName='locusSortForm';
            this.$get(api.dnaKit+'/sort/'+this.$route.query.id).then((res)=>{
                var data=JSON.parse(JSON.stringify(res.data));
                this.addForm=data;
            })

        },
        watch:{
            activeName:function (newval,oldval) {
                if(newval=='list'){
                    this.$router.push({path:'/dna/kit/list'}).catch(err => { console.log(err) });
                }else if (newval == 'form') {
                    this.$router.push({path: '/dna/kit/form'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
    }
</script>

<style scoped>

</style>