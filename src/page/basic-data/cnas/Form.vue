<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="CNAS/CMA项目列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'CNAS/CMA项目添加':'CNAS/CMA项目修改'" name="form">
            <el-form :model="addForm" size="small" ref="cnasForm" label-width="150px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="CNAS/CMA项目/参数" :rules="$filter_rules({required:true})" prop="name">
                            <el-input v-model.trim="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :lg="{span:16}">
                        <el-form-item label="委托事项名" :rules="$filter_rules({required:true})" prop="entrustingMatterList">
                            <select-from-table
                                    class-name="multiple-select"
                                    :model.sync="addForm.entrustingMatterList"
                                    :multiple="true"
                                    port="entrustingMatter"
                                    :filterable="true"
                                    :clearable="true"></select-from-table>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{span:16}">
                        <el-form-item label="专业类别" :rules="$filter_rules({required:true})" prop="professionCategory">
                            <select-from-table
                                    className="w100"
                                    :model.sync="addForm.professionCategory"
                                    port="profession"></select-from-table>
                        </el-form-item>
                    </el-col>
                    <el-col :lg="{span:16}">
                        <el-form-item label="鉴定标准（方法）">

                            <select-from-table
                                    :model.sync="addForm.standardList"
                                    :condition="standardCondition"
                                    :multiple="true"
                                    className="multiple-select"
                                    :filterable="true"
                                    port="standard"
                                    :clearable="true"></select-from-table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="success" size="mini" class="save-btn" @click="save('cnasForm')"><i
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
    import api from '../../../api/index.js'

    export default {
        name: "Form",
        data() {
            return {
                activeName: 'form',
                isAdd: true,
                addForm: {},
                standardCondition: {},
            }
        },
        methods: {
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            this.$post(api.cnas, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/cnas/list'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            this.$put(api.cnas + '/' + data.id, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/cnas/list'}).catch(err => {
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
            this.activeName = 'form';
            if (this.$route.query.id) {
                this.isAdd = false;
                this.$get(api.cnas + '/' + this.$route.query.id).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.addForm = data;
                })
            } else {
                this.isAdd = true;
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/auth/cnas/list'}).catch(err => {
                        console.log(err)
                    });
                }
            },
            'addForm.entrustingMatterList': {
                handler(newVal, oldVal) {
                    if (newVal) {
                    }
                },
                immediate: true
            },
            'addForm.professionCategory': {
                handler(newVal, oldVal) {
                    if (newVal) {
                        this.standardCondition = {'professionCategoryId': newVal.id};
                    }else {
                        this.standardCondition = {'professionCategoryId': '无'};
                    }
                },
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>