<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="案件统计类型列表" name="list">
            <el-table
                    v-loading="loading"
                    :data.sync="tableData"
                    @edit="edit"
                    row-key="id"
                    border
                    size="mini"
                    @deleteRow="deleteRow"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                    :max-height="tableHeight"
                    ref="table">
                <el-table-column
                        prop="name"
                        label="统计类别">
                </el-table-column>
                <el-table-column
                        prop="sort"
                        label="排序">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.type">
                            {{scope.row.sort}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="250px"
                        >
                    <template slot-scope="scope">
                        <div v-if="!scope.row.type">
                            <el-button type="warning" size="small" icon="el-icon-edit" plain
                                       @click="edit(scope.row)"/>
                            <el-button type="danger" size="small" icon="el-icon-delete" plain
                                       @click="deleteRow(scope.row)"/>
                            <el-button type="primary" size="small" icon="el-icon-plus" plain
                                       @click="addSubordinate(scope.row)"/>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="添加案件统计类型" name="form"></el-tab-pane>
    </el-tabs>
</template>

<script>
    import api from '../../../api'
    export default {
        name: "List",
        data() {
            return {
                activeName: 'list',
                tableData: [],
                isAdd: true,
                tableHeight: '100%',
                loading: true,
            }
        },
        methods: {
            init() {
                this.$get(api.caseStatType).then((res) => {
                    this.tableData = res.data;
                    this.loading = false;
                }).catch((err) => {
                    console.log(err)
                })
            },
            deleteRow(row) {
                this.$confirmBox('确定删除' + row.name + '与其子类型?').then((res) => {
                    this.$del(api.caseStatType + '/' + row.id).then((res) => {
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
            edit(row) {
                this.$router.push({
                    path: '/case-stat-type/form',
                    query: {caseStatType: row, isAdd: false}
                })
                    .catch(err => {
                        console.log(err)
                    });
            },
            addSubordinate(row) {
                this.isAdd = true;
                this.$router.push({
                    path: '/case-stat-type/form',
                    query: {
                        isAdd: this.isAdd,
                        parent: row
                    }
                }).catch(err => {
                    console.log(err)
                });
            },
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval != 'list') {
                    this.isAdd = true;
                    this.$router.push({
                        path: '/case-stat-type/form',
                        query: {
                            isAdd: this.isAdd,
                            parent: null
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 300;
        }
    }
</script>

<style scoped>

</style>