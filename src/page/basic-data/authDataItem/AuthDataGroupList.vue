<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="检验数据类型列表" name="groupList">
            <div class="search-box" style="overflow: hidden">
                <el-form :model="searchForm" size="small" label-width="100px" :inline="true">
                    <el-form-item label="专业类别">
                        <select-from-table
                                @keyup.enter.native="search"
                                :model.sync="searchForm.professionCategoryId"
                                port="profession"
                                :clearable="true"
                                :modelId="true"
                        />
                    </el-form-item>
                    <el-form-item label="检验数据类型名称" label-width="140px">
                        <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                    </el-form-item>
                    <el-form-item label="检验数据名称" label-width="120px">
                        <el-input v-model.trim="searchForm.itemName" @keyup.enter.native="search" class="w215"/>
                    </el-form-item>
                    <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="small"
                            style="color: white"
                            @click="search"
                    >查询
                    </el-button>
                </el-form>
            </div>
            <Table
                    :data.sync="tableData"
                    :page="page"
                    :search.sync="searchdata"
                    port="authDataGroup"
                    :hasPaging="true"
                    :selfDefinedBtn="true"
            >
                <template solt>
                    <el-table-column prop="name" label="检验数据类型名称"/>
                    <el-table-column prop="professionCategory.name" label="专业类别"/>
                    <el-table-column prop="authDataItemUnit.label" label="单位"/>
                    <el-table-column prop="sort" label="排列顺序"/>
                    <el-table-column label="操作" width="200%">
                        <template slot-scope="scope">
                            <el-button
                                    v-if="scope.row.children"
                                    type="warning"
                                    plain
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="edit(scope.$index,scope.row)"
                            />
                            <el-button
                                    v-if="scope.row.children"
                                    type="danger"
                                    plain
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="del(scope.$index, scope.row)"
                            />
                            <el-button
                                    v-if="!scope.row.children"
                                    type="warning"
                                    plain
                                    icon="el-icon-edit"
                                    size="mini"
                                    @click="editChilren(scope.$index,scope.row)"
                            />
                            <el-button
                                    v-if="!scope.row.children"
                                    type="danger"
                                    plain
                                    icon="el-icon-delete"
                                    size="mini"
                                    @click="delChilren(scope.$index, scope.row)"
                            />
                            <el-button
                                    v-if="!scope.row.children"
                                    type="primary"
                                    plain
                                    icon="el-icon-plus"
                                    size="mini"
                                    @click="addChildren(scope.$index,scope.row)"
                            />
                        </template>
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="检验数据类型添加" name="groupForm"></el-tab-pane>
        <!--<el-tab-pane label="检验数据列表" name="itemList"></el-tab-pane>-->
        <el-tab-pane label="检验数据添加" name="itemForm"></el-tab-pane>
        <el-tab-pane label="检验数据导入" name="itemImport"></el-tab-pane>
    </el-tabs>

</template>
<!-- 检验数据类型列表 -->
<script>
    import api from "../../../api/index.js";

    export default {
        name: "List",
        data() {
            return {
                activeName: "groupList",
                tableData: [],
                tablesort: null,
                searchdata: {}, 
                searchForm: {},
                page: {current: 1, pageSize: 30, total: 0}
            };
        },
        methods: {
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("authDataGroupSearchData", JSON.stringify(data));
                this.searchdata = data;
            },
            del(index, row) {
                this.$confirmBox("确定删除检验数据类型" + row.name + "?").then(res => {
                    this.$del(api.authDataGroup + "/" + row.id)
                        .then(res => {
                            if (res.status == 200) {
                                this.$message.success("删除成功！");
                                this.search();
                            }
                        })
                        .catch(err => console.log(err));
                });
            },
            edit(index, row) {
                this.$router.push({
                    path: "/auth/authDataItem/authDataGroupForm",
                    query: {id: row.id}
                });
            },
            addChildren(index, row) {
                this.$router.push({
                    path: "/auth/authDataItem/AuthDataItemForm",
                    query: {fId: row.authDataItemGroup.id}
                });
            },
            delChilren(index, row) {
                this.$confirmBox("确定删除检验数据" + row.name + "?").then(res => {
                    this.$del(api.authDataItem + "/" + row.id)
                        .then(res => {
                            if (res.status == 200) {
                                this.$message.success("删除成功！");
                                this.search();
                            }
                        })
                        .catch(err => console.log(err));
                });
            },
            editChilren(index, row) {
                this.$router.push({
                    path: "/auth/authDataItem/authDataItemForm",
                    query: {id: row.id}
                });
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == "groupList") {
                    this.$router.push({path: "/auth/authDataItem/AuthDataGroupList"});
                } else if (newval == "groupForm") {
                    this.$router.push({path: "/auth/authDataItem/AuthDataGroupForm"});
                } else if (newval == "itemForm") {
                    this.$router.push({path: "/auth/authDataItem/AuthDataItemForm"});
                } else if (newval == "itemImport") {
                    this.$router.push({path: "/auth/authDataItem/authDataItemImport"});
                } else if (newval == "groupImport") {
                    this.$router.push({path: "/auth/authDataItem/authDataGroupImport"});
                }
            }
        },
        created() {
            if (sessionStorage.getItem("authDataGroupSearchData")) {
                this.searchdata = JSON.parse(
                    sessionStorage.getItem("authDataGroupSearchData")
                );
                this.searchForm = this.searchdata;
            }
        }
    };
</script>

<style scoped>
</style>