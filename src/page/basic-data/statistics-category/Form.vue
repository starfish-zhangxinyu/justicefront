<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="案件统计类型列表" name="list"></el-tab-pane>
        <el-tab-pane :label="isAdd ? '添加案件统计类型' : '修改案件统计类型'" name="form">
            <el-form :model="formData" :rules="rules" size="small" ref="formData" label-width="150px"
                     style="margin-top: 10px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop="parent.parentName" label="父级">
                            <el-input :value="formData.parent.parentName" :readonly="true" size="small">
                                <el-button slot="append" icon="el-icon-close" @click="delParent"/>
                                <el-button slot="append" @click="selectParent" size="small">选择</el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item prop="name" label="名称">
                            <el-input type="text" v-model="formData.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="8">
                    <el-col :lg="{span:8}">
                        <el-form-item label="排序" prop="sort">
                            <el-input v-model.number="formData.sort"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="success" size="mini" class="save-btn" @click="saveOrUpdate('formData')"><i
                            class="fa fa-save"></i> 保存
                    </el-button>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" size="mini" class="save-btn" @click="activeName='list'"><i
                            class="el-icon-arrow-left"></i> 返回
                    </el-button>
                </el-col>
            </el-row>
            <el-dialog :visible.sync="dialogVisible"
                       width="30%">
                <el-tree
                        :data="treeData"
                        :props="defaultProps"
                        @node-click="handleNodeClick">
                </el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="readySelect">确 定</el-button>
                </span>
            </el-dialog>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api'

    export default {
        name: "Form",
        data() {
            return {
                activeName: 'form',
                formData: {
                    parent: {
                        id: '',
                        parentName: ''
                    },
                    name: '',
                    level: null,

                },
                temp: {},
                isAdd: Boolean,
                treeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                dialogVisible: false,
                rules: {
                    name: [{required: true, message: '请输入名称'}],
                    //"parent.parentName": [{validator: validateParentName, required: true, trigger: 'change'}]
                    // "parent.parentName": [{required: true, message: '请选择', trigger: "change"}]
                }
            }
        },
        methods: {
            saveOrUpdate(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!this.formData.level) {
                            if (this.formData.parent) {
                                this.formData.level = 1;
                            } else {
                                this.formData.level = this.formData.parent.level + 1;
                            }
                        }
                        this.$post(api.caseStatType, this.formData).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                this.activeName = 'list';
                            }
                        }).catch((err) => {
                            this.$message({
                                message: '保存失败！',
                                type: 'error'
                            });
                        })
                    }
                })
            },
            init() {
                this.activeName = 'form';
                this.isAdd = this.$route.query.isAdd;
                this.$get(api.caseStatType).then((res) => {
                    this.treeData = res.data;
                    if (this.isAdd) {
                        if (null !== this.$route.query.parent) {
                            this.formData.parent = this.$route.query.parent;
                            if (!this.$route.query.parent.type) {
                                this.formData.level = this.formData.parent.level + 1;
                                this.formData.parent.parentName = this.formData.parent.name;
                            }
                        }
                    } else {
                        this.formData = this.$route.query.caseStatType;
                        let id = this.formData.parent.id;
                        if (this.formData.level === 1) {
                            let p = {};
                            for (let item in this.treeData) {
                                if (this.treeData[item].id === id) {
                                    p = this.treeData[item];
                                    break;
                                }
                            }
                            this.formData.parent.parentName = p.name;
                        } else {
                            this.$get(api.caseStatType + "/" + id).then((res) => {
                                this.$set(this.formData.parent, "parentName", res.data.name);
                            })
                        }
                    }
                })
            },
            handleNodeClick(data) {
                this.temp = data;
            },
            selectParent() {
                this.dialogVisible = true;
            },
            readySelect() {
                this.formData.parent = this.temp;
                this.formData.parent.parentName = this.formData.parent.name;
                //上级如果有type的话，为一级
                if (this.formData.parent.type) {
                    this.formData.level = 1;
                } else {
                    this.formData.level = this.formData.parent.level + 1;
                }
                this.dialogVisible = false;
            },
            delParent() {
                this.formData.parent = {};
            }
        },
        created() {
            this.init();
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/case-stat-type/list'}).catch(err => {
                        console.log(err);
                    });
                }
            },
        },
        mounted() {

        },
    }
</script>

<style lang="stylus" scoped>

</style>