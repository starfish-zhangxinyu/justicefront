<template>
    <div id="menu-management">
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="菜单列表" name="list">
                <el-table
                        :data="tableData"
                        style="width: 100%"
                        size="small"
                        row-key="id"
                        fit
                        border
                        :expand-row-keys="[`d90498f32c4e6dc33e680f9f058677b9`]"
                        :tree-props="{children: 'children'}">
                    <el-table-column
                            prop="name"
                            label="名称">
                    </el-table-column>
                    <el-table-column
                            prop="vipVersion"
                            label="系统版本"
                            width="80px"
                    >

                    </el-table-column>
                    <el-table-column
                            prop="href"
                            label="连接">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.sort" size="mini" @blur="saveSort(scope.row)"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                            width="50px"
                            prop="isShow"
                            label="可见">
                        <template slot-scope="scope">
                            <span>{{scope.row.isShow=='1'?'显示':'隐藏'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="permission"
                            label="权限标识">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="220px"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" plain type="warning" icon="el-icon-edit"
                                       @click="handleEditMenu(scope.$index, scope.row)">
                            </el-button>
                            <el-button size="mini" plain type="danger" icon="el-icon-delete" @click="deleteRow(scope.$index, scope.row)">
                            </el-button>
                            <el-button size="mini" plain type="primary" icon="el-icon-plus" @click="handleAdd(scope.$index, scope.row)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'菜单添加':'菜单修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="menuForm" label-width="100px">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="上级菜单">
                                <treeSelect name="menu" title="菜单" :model.sync="addForm.parent"></treeSelect>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="名称" :rules="$filter_rules({required:true,maxLength:50})" prop="name">
                                <el-input v-model="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="系统版本" :rules="$filter_rules({required:true,maxLength:50})" prop="name">

                                <template>
                                    <el-select v-model="addForm.vipVersionId" placeholder="请选择">
                                        <el-option
                                                v-for="item in vipVersion"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.id">
                                        </el-option>
                                    </el-select>
                                </template>

                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="连接">
                                <el-input v-model="addForm.href"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="图标名称">
                                <el-input v-model="addForm.icon"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="排序" :rules="$filter_rules({required:true})" prop="sort">
                                <el-input v-model.number="addForm.sort"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="可见" :rules="$filter_rules({required:true, trigger: 'change'})"
                                          prop="isShow">
                                <el-radio-group v-model="addForm.isShow">
                                    <el-radio label="1">可见</el-radio>
                                    <el-radio label="0">隐藏</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="权限标识">
                                <el-input v-model="addForm.permission"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="可见范围">
                                <select-from-enum
                                        :model-val="true"
                                        :model.sync="addForm.visibleScope"
                                        :clearable="true"
                                        :multiple="true"
                                        type="sys.MenuVisibleScope"></select-from-enum>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="备注">
                                <el-input v-model="addForm.remarks" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="11">
                        <el-button type="success" size="mini" class="save-btn" @click="save('menuForm')"><i
                                class="fa fa-save"></i> 保存
                        </el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane label="版本选择" name="list1" ref="menutree">
                <el-row type="flex">
                    <el-col :span="8">
                        <template>
                            <el-select v-model="vipVersionId" placeholder="请选择">
                                <el-option
                                        v-for="item in vipVersion"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-col>
                    <el-col :span="16">
                        <el-button plain icon="el-icon-refresh-right" @click="updateVipVersion"/>
                        <el-button
                                type="success"
                                size="primary"
                                class="save-btn"
                                @click="saveTree"
                        ><i class="fa fa-save"></i> 保存
                        </el-button>

                    </el-col>
                </el-row>
                <el-row>
                    <el-tree
                            :data="tableData1"
                            show-checkbox
                            default-expand-all
                            node-key="id"
                            @check="itemClick"
                            :default-checked-keys="defaultKeys"
                            ref="tree"
                            highlight-current
                            :props="defaultProps"
                    >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i
                            :class="[
                        hanveChild(node, data)
                          ? 'el-icon-folder-opened'
                          : 'el-icon-document'
                      ]"
                            style="margin-left: 5px;color: #3b7db6"
                    ></i
                    ><span style="margin-left: 5px">{{ node.label }}</span>
                  </span>
                    </el-tree>
                </el-row>
            </el-tab-pane>


        </el-tabs>

    </div>
</template>

<script>
    import Test from '../../components/common/TreeSelect'
    import api from '../../api/index'
    import {mapState} from "vuex";
    import {Loading} from 'element-ui';

    export default {
        name: "MenuManagement",
        components: {'treeSelect': Test},
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                tableData: [],
                tableData1: [],
                isAdd: true,
                activeName: 'list',
                addForm: {parent: {name: ''}, sort: '', vipVersionId: ''},
                defaultKeys: [],
                vipVersion: [],
                vipVersionId: '',
                resetType: true
            }
        },
        methods: {
            updateVipVersion(){
                let loadingService = Loading.service({fullscreen: true});
                let data = this.$refs.tree.getCheckedNodes();
                //在添加/修改vip版本后需要更新数据
                this.$get("/api/menu/v1/menus/vip/update").then((res) => {
                    if (res.status == '200'){
                        this.$message({
                            message: '版本更新成功！',
                            type: 'success'
                        });
                    }else {
                        this.$message.error({
                            message: '版本更新失败！'
                        });
                    }
                    this.$nextTick(() => {
                        loadingService.close();
                    });
                    this.init();

                }).catch((err) => {
                    console.log(err)
                });
            }
            ,
            saveTree() {
                if (this.vipVersionId == null || this.vipVersionId == ''){
                    this.$message("请先选择版本!");
                    return;
                }
                let loadingService = Loading.service({fullscreen: true});
                let data = this.$refs.tree.getCheckedNodes();
                data[0].vipVersionId = this.vipVersionId;
                this.$put(api.menu, data).then((res) => {
                    if (res.status == '200'){
                        this.$nextTick(() => {
                            loadingService.close();
                        });
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                    }
                    this.init();
                })
            }
            ,
            hanveChild(n, d) {
                if (n.childNodes.length == 0) {
                    return false;
                } else {
                    return true;
                }
            },
            init() {
                this.$get(api.menu).then((res) => {
                    this.tableData = res.data;
                    this.activeName = 'list';
                    this.getVipVersion();
                }).catch((err) => {
                    console.log(err)
                });
            },
            handleEditMenu(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist';
                var data = JSON.parse(JSON.stringify(row));
                if (data.visibleScope) {
                    data.visibleScope = data.visibleScope.split(",");
                }
                this.addForm = data;

            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除菜单' + row.name + '及其子菜单?').then((res) => {
                    this.$del(api.menu + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.init();
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });

            },
            handleAdd(index, row) {
                this.activeName = 'addlist';
                this.addForm.parent = JSON.parse(JSON.stringify(row));
                this.addForm.sort = row.sort;
            },
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
               /* data.vipVersionId = this.vipVersionId;*/
                data.parent = {'id': data.parent.id};
                if (data.visibleScope) {
                    var str = '';
                    data.visibleScope.forEach(v => {
                        str += (v + ",");
                    })
                    data.visibleScope = str.substr(0, str.length - 1);
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.activeName == 'addlist') {
                            this.$post(api.menu, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                        } else {
                            this.$put(api.menu + '/' + data.id, data).then((res) => {
                                if (res.status == 200) {
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
            },
            saveSort: function (row) {
                this.$post(api.menu, row).then(res => {
                    console.log("菜单序号修改成功！")
                }).catch(err => {
                })
            },
            itemClick(a, b) {
                this.addForm.menuList = [];
                let keys = [].concat(b.checkedKeys).concat(b.halfCheckedKeys);
                this.addForm.menuList = keys;
            },
            getVipVersion() {
                this.$get(api.dict + "/vip_version").then((res) => {
                    this.vipVersion = res.data;
                }).catch((err) => {
                    console.log(err)
                });
            },
            async getMenusByVersion(val) {
                await this.$get(api.menu + '/vip/', {vipVersionId: val}).then((res) => {
                    this.tableData1 = res.data;
                    //获取选中的菜单
                    this.$refs.tree.setCheckedKeys(res.data[0].defaultKeys);
                }).catch((err) => {
                    console.log(err)
                });
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list1'){
                    this.$refs.tree.setCheckedKeys([]);
                    this.vipVersionId = '';
                }
                if (newval == 'list') {
                    this.isAdd = true;
                    this.addForm = {parent: {name: ''}, sort: ''};
                    this.$refs.entrustingForm ? this.$refs.entrustingForm.resetFields() : null;
                }
            },
            'vipVersionId': {
                handler: function (newVal, oldVal) {
                    this.$nextTick(function () {
                        //获取对应版本的所有菜单
                        this.getMenusByVersion(newVal);
                    });
                },
                immediate: true,
            },

        },
        created: function () {
            this.$store.dispatch("login/headerTitleChange", "菜单管理")
            this.$get(api.menu).then((res) => {
                this.tableData = res.data;
            }).catch((err) => {
                console.log(err)
            })
            this.getVipVersion();
        },
        computed: {
            inputTypeChange() {
                return this.addForm.inputType;
            },
            ...mapState("login", ["orgId"])
        },
    }
</script>

<style scoped>

</style>
