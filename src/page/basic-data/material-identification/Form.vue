<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="鉴定材料列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd?'鉴定材料添加':'鉴定材料修改'" name="form">
            <el-form :model="addForm" size="small" ref="materialForm" label-width="150px">
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="鉴定材料名称" prop="name" :rules="$filter_rules({required:true})">
                            <el-input v-model.trim="addForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="专业类别" prop="professionCategoryList"
                                      :rules="$filter_rules({required:true})">
                            <select-from-table :model.sync="addForm.professionCategoryList" port="profession"
                                               :multiple=true className="multiple-select">
                                <el-option label="全部专业" :value="{id:'ALL'}"></el-option>
                            </select-from-table>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="类型">
                            <select-from-dict data_type="material_type" :model.sync="addForm.materialType"
                                              className="multiple-select"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="材料性质" :rules="$filter_rules({required:true})">
                            <select-from-dict data_type="material_property" :model.sync="addForm.materialProperty"
                                              className="multiple-select"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="规格">
                            <select-from-dict data_type="unit_type" :model.sync="addForm.materialUnit"
                                              className="multiple-select"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="处理方式" :rules="$filter_rules({required:true})">
                            <select-from-dict data_type="handle_type" :model.sync="addForm.handleType"
                                              className="multiple-select"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="是否默认" prop="isDefault"
                                      :rules="$filter_rules({required:true})">
                            <el-radio-group v-model="addForm.isDefault">
                                <el-radio label="Y">是</el-radio>
                                <el-radio label="N">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :lg="{span:16}">
                        <el-form-item label="备注" prop="remarks">
                            <el-input v-model.trim="addForm.remarks"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="10">
                    <el-button type="success" size="mini" class="save-btn" @click="save('materialForm')"><i
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
            }
        },
        methods: {
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isAdd) {
                            this.$post(api.auth, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/inspectionmaterials/list'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })

                        } else {
                            this.$put(api.auth + '/' + data.id, data,).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: '/auth/inspectionmaterials/list'}).catch(err => {
                                        console.log(err)
                                    });
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        }
                    }
                })
            }
        },
        created() {
            this.activeName = 'form';
            if (this.$route.query.id) {
                this.isAdd = false;
                this.$get(api.auth + '/' + this.$route.query.id).then((res) => {
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
                    this.$router.push({path: '/auth/inspectionmaterials/list'}).catch(err => {
                        console.log(err)
                    });
                }
            },
            "addForm.professionCategoryList": {
                handler: function (newVal, oldVal) {
                    if (newVal) {
                        if (!this.$findArrFn(newVal, 'ALL')) {
                            if (newVal.length > 1) {
                                this.addForm.professionCategoryList = [{id: 'ALL'}];
                                this.$message.info('你已选择全部专业类别!');
                            }
                        }
                    }
                },
                deep: true,
            }
        },
    }
</script>

<style scoped>

</style>