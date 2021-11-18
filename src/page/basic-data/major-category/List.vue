<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="专业类别列表" name="list">
            <Table :data.sync="tableData"
                   :page.sync="page"
                   port="profession"
                   @edit="edit"
                   :hasPaging="true"
                   @deleteRow="deleteRow"
                   :isDragdrop="true"
                   @dragdropCb="dragdropCb"
                   :selfDefinedBtn="false">
                <template solt>
                    <el-table-column
                            prop="name"
                            label="类别名称">
                    </el-table-column>
                    <el-table-column
                            prop="type.label"
                            label="专业类别类型">
                    </el-table-column>
                    <!-- 新需求添加 -->
                    <el-table-column
                            prop="typeNo"
                            label="类别代码">
                    </el-table-column>
                    <!-- 止 -->
                    <el-table-column
                            prop="office.name"
                            label="职能部门">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排列顺序">
                    </el-table-column>
                </template>
            </Table>
        </el-tab-pane>
        <el-tab-pane label="专业类别添加" name="form"></el-tab-pane>
    </el-tabs>

</template>

<script>
    import api from '../../../api/index.js'

    export default {
        name: "List",
        data() {
            return {
                activeName: 'list',
                tableData: [],
                tablesort: null,
                searchdata: {},
                page: {current: 1, pageSize: 30, total: 0}
            }
        },
        methods: {
            dragdropCb(json) {
                this.$put(api.tablesSortApi, {...json, ...{tableName: 'base_profession_category'}})
                    .catch(err => console.log(err));
            },
            professionInit() {
                this.$get(api.profession,
                    {
                        "page.current": this.page.current,
                        "page.pageSize": this.page.pageSize,
                    }
                ).then((res) => {
                    this.tableData = res.data.list;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.page.total = res.data.total;
                }).catch((err) => {
                    console.log(err)
                })
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除专业类别' + row.name + '?').then((res) => {
                    this.$del(api.profession + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            this.professionInit();
                        }

                    }).catch((err) => {
                        console.log(err)
                    });
                }).catch((err) => {
                });
            },
            edit(index, row) {
                this.$router.push(
                    {path: '/auth/professioncategories/form', query: {'id': row.id}}
                ).catch(err => {
                    console.log(err)
                });
            },
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/auth/professioncategories/list'}).catch(err => {
                        console.log(err)
                    });
                } else {
                    this.$router.push({path: '/auth/professioncategories/form'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
        created() {

        }
    }
</script>

<style scoped>

</style>