<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="毒物列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'毒物添加':'毒物修改'" name="form">
            <el-form :model="addForm" size="small" ref="addForm" :rules="poisonRule" label-width="150px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="毒物名称" prop="name">
                            <el-input v-model.trim="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{span:16}">
                        <el-form-item label="毒物分类" prop="parent">
                            <el-col style="width:calc(100% - 44px)">
                                <template>
                                    <el-select v-model="addForm.parent" placeholder="请选择"
                                                class="w100"
                                               :clearable="true"
                                               value-key="id">
                                        <el-option
                                                v-for="item in poisonCategoryList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item"
                                        >
                                        </el-option>
                                    </el-select>
                                </template>
                            </el-col>
                            <el-col style="width:44px">
                                <el-button type="primary" size="small" icon="el-icon-plus" plain
                                           @click="addPoisonCategoryDialog = true">
                                </el-button>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="10">
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
        <el-tab-pane label="毒物导入" name="import"></el-tab-pane>
        <!--添加毒物分类-->
        <el-dialog title="添加毒物分类" :visible.sync="addPoisonCategoryDialog" width="30%">
            <el-form :model="addPoisonCategoryForm" ref="addPoisonCategoryForm" :rules="poisonCategoryRule" label-width="130px">
                <el-row>
                    <el-col :span="22" :offset="1">
                        <el-form-item label="毒物分类名称" prop="name">
                            <el-input v-model="addPoisonCategoryForm.name" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPoisonCategoryDialog = false">取 消</el-button>
                <el-button type="primary" @click="savePoisonCategory('addPoisonCategoryForm')">确 定</el-button>
            </div>
        </el-dialog>
    </el-tabs>

</template>

<script>
    import api from '../../../api/index.js'

    export default {
        name: "Form",
        data() {
            var poisonCategoryNameDistinct = (rule, value, callback) =>{
                       this.$get(api.poison+"/category/distinct/name", {name:value}).then(res=>{
                           if(!res.data){
                               callback(new Error("已存在名为'"+value+"'的毒物分类！"))
                           } else {
                               callback();
                           }
                       }).catch(err=>{
                           callback(new Error('服务器错误！'));
                       })

            };
            var poisonNameDistinct = (rule, value, callback) =>{
                    if(this.isAdd && this.addForm.parent){
                       this.$get(api.poison+"/distinct/name", {'name':value,'parent.id':this.addForm.parent.id}).then(res=>{
                            if(!res.data){
                                callback(new Error("所选毒物分类下已存在名为'"+value+"'的毒物！"))
                            } else {
                                callback();
                            }
                        }).catch(err=>{
                            callback(new Error('服务器错误！'));
                        })
                    }else {
                        callback();
                    }
            };
            return {
                activeName: '',
                poisonCategoryList: null,
                addPoisonCategoryForm: {},
                addPoisonCategoryDialog: false,
                isAdd: null,
                addForm: {},
                poisonCategoryRule:{
                    name: [
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        { validator: poisonCategoryNameDistinct, trigger: 'blur'  },
                    ],
                },
                poisonRule:{
                    name: [
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        { validator: poisonNameDistinct, trigger: 'blur'  },
                    ],
                    parent:[
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'},
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
                            this.$post(api.poison, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/poison/poisonList'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            var data = JSON.parse(JSON.stringify(this.addForm));
                            this.$put(api.poison + '/' + this.addForm.id, data
                            ).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/poison/poisonList'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                })
            },
            savePoisonCategory(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = this.addPoisonCategoryForm;
                        this.$post(api.poison, data).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '新增毒物分类成功！',
                                    type: 'success'
                                });
                                this.addPoisonCategoryDialog = false;
                                this.poisonCategoryList.push(res.data);
                                this.addForm.parent = res.data;
                            }
                        }).catch((err) => {
                            this.$message.error(err.errMsg);
                        });
                    }
                });
            },
        },
        created() {
            this.activeName = 'form';
            if (this.$route.query.id) {
                this.isAdd = false;
                this.$get(api.poison + '/' + this.$route.query.id).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.addForm = data;
                })
            } else {
                this.isAdd = true;
            }
            this.$get(api.poisonCategory).then((res) => {
                this.poisonCategoryList = JSON.parse(JSON.stringify(res.data));
            });
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/auth/poison/poisonList'}).catch(err => {
                        console.log(err)
                    });
                }
                if (newval == 'import') {
                    this.$router.push({path: '/auth/poison/import'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },

    }
</script>

<style scoped>

</style>