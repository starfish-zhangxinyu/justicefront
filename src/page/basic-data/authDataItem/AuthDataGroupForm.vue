<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="检验数据类型列表" name="groupList"></el-tab-pane>
        <el-tab-pane :label="isAdd?'检验数据类型添加':'检验数据类型修改'" name="groupForm">
            <el-form :model="addForm" size="small" ref="authDataGroupForm" :rules="rules" label-width="150px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="检验数据类型名称" prop="name">
                            <el-input v-model.trim="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{span:16}">
                        <el-form-item label="专业类别"  prop="professionCategory">
                            <select-from-table
                                    className="w100"
                                    :model.sync="addForm.professionCategory"
                                    port="profession"
                                    :clearable="true"></select-from-table>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{span:16}">
                        <el-form-item label="排序" prop="sort" >
                            <el-input v-model.number="addForm.sort"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="10">
                    <el-button type="success" size="mini" class="save-btn" @click="save('authDataGroupForm')"><i
                            class="fa fa-save"></i> 保存
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="mini" class="save-btn" @click="activeName='groupList'"><i
                            class="el-icon-arrow-left"></i> 返回
                    </el-button>
                </el-col>
            </el-row>
        </el-tab-pane>
        <!--<el-tab-pane label="检验数据列表" name="itemList"></el-tab-pane>-->
        <el-tab-pane label="检验数据添加" name="itemForm"></el-tab-pane>
        <el-tab-pane label="检验数据导入" name="itemImport"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api/index.js'

    export default {
        name: "AuthDataItemGroupForm",
        data() {
            var nameDistinct = (rule, value, callback) => {
                if(this.isAdd && this.addForm.professionCategory){
                    if (!value) {
                        callback(new Error('该输入项为必填项!'));
                    } else {

                        this.$get(api.authDataGroup+"/distinct/name", {name:value,professionCategoryId:this.addForm.professionCategory.id}).then(res=>{
                            if(!res.data){
                                callback(new Error("所选专业类别下已存在名为'"+value+"'的检验数据类型！"))
                            } else {
                                callback();
                            }
                        }).catch(err=>{
                            callback(new Error('服务器错误，请联系管理员！'));
                        })
                    }
                }else {
                    callback();
                }
            };
            return {
                activeName: '',
                isAdd: null,
                addForm: {},
                rules: {
                    name: [
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        { validator: nameDistinct, trigger: 'blur'  },
                    ],
                    professionCategory: [
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'}
                    ],
                    sort: [
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            var data = JSON.parse(JSON.stringify(this.addForm));
                            this.$post(api.authDataGroup, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/authDataItem/authDataGroupList'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            var data = JSON.parse(JSON.stringify(this.addForm));
                            this.$put(api.authDataGroup + '/' + this.addForm.id, data
                            ).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/authDataItem/authDataGroupList'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                })
            },
        },
        created() {
            this.activeName = 'groupForm';
            if (this.$route.query.id) {
                this.isAdd = false;
                this.$get(api.authDataGroup + '/' + this.$route.query.id).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.addForm = data;
                })
            } else {
                this.isAdd = true;
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'groupList') {
                    this.$router.push({path: '/auth/authDataItem/AuthDataGroupList'}).catch(err => {
                        console.log(err)
                    });
                } else if(newval == 'groupImport'){
                    this.$router.push({path: '/auth/authDataItem/authDataGroupImport'}).catch(err => {
                        console.log(err)
                    });
                }else if (newval == 'itemList') {
                    this.$router.push({path: '/auth/authDataItem/AuthDataItemList'}).catch(err => {
                        console.log(err)
                    });
                }
                else if (newval == 'itemForm') {
                    this.$router.push({path: '/auth/authDataItem/AuthDataItemForm'}).catch(err => {
                        console.log(err)
                    });
                }else if (newval == 'itemImport') {
                    this.$router.push({path: '/auth/authDataItem/authDataItemImport'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },

    }
</script>

<style scoped>

</style>