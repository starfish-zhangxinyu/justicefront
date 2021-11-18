<template>
    <div>
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="流程用户列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" :inline="true">
                        <el-form-item label="流程用户名称">
                            <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>
                        <el-button class="save-btn" type="primary" icon="el-icon-search" size="small"
                                   @click="search">查询
                        </el-button>

                    </el-form>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            label="流程用户名称">
                    </el-table-column>
                    <el-table-column
                            prop="enName"
                            label="英文名称">
                    </el-table-column>
                    <el-table-column
                            prop="professionCategoryName"
                            label="专业类别">
                    </el-table-column>
                    <el-table-column
                            prop="type.label"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="sysUserList"
                            label="对应账号">
                        <template slot-scope="scope">
             <span v-if="scope.row.sysUserList">
              {{transform(scope.row.sysUserList)}}
             </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作" width="200%">
                        <template slot-scope="scope">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="edit(scope.$index,scope.row)" plain></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" plain
                                       @click.native.prevent="deleteRow(scope.$index, scope.row)">
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page.current"
                            :page.sync="page"
                            :data.sync="tableData"
                            :search.sync="searchdata"
                            :sort.sync="tablesort"
                            port="flowUsers">
                    </pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'流程用户新增':'流程用户修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="addForm" label-width="150px">
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="流程用户名称" prop="name"
                                          :rules="$filter_rules({required:true})">
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="英文名称" prop="enName"
                                          :rules="$filter_rules({required:true})">
                                <el-input v-model.trim="addForm.enName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="专业类别" prop="professionCategoryIds">
                                <select-from-table :model.sync="addForm.professionCategoryIds" port="profession"
                                                   :multiple="true" :model-id="true" className="multiple-select"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="类型" prop="type">
                                <select-from-dict data_type="flow_user_type" className="w100"
                                                  :model.sync="addForm.type"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="对应账号" prop="sysUserList"
                                          :rules="$filter_rules({required:true})">
                                <el-select class="w100" v-model="addForm.sysUserList" placeholder="请选择"
                                           :multiple="true" :filterable="true">
                                    <el-option
                                            v-for="item in accountOpt"
                                            :key="item.id"
                                            :label="item.hrStaff.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
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
        </el-tabs>
    </div>
</template>

<script>
    import Select2 from '../../components/common/Select2'
    import api from '../../api/index'

    export default {
        name: "ProcessUser",
        components: {'Select2': Select2},
        data() {
            return {
                activeName: 'list',
                isAdd: true,
                searchForm: {},
                tableData: [],
                addForm: {name: '', enName: '', sysUserList: [], type: null, professionCategoryIds: []},
                page: {pageSizes: [30, 50, 80, 100], pageSize: 30, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
                accountOpt: []
            }
        },
        methods: {
            transform(arr) {
                var str = '';
                for (let i = 0; i < arr.length; i++) {
                    str += arr[i].hrStaff.name + ',';
                }
                return str.substr(0, str.length - 1);
            },
            handleClick(tab, event) {
                if (sessionStorage.getItem("flowUsersSearchData")) {
                    this.searchdata = JSON.parse(sessionStorage.getItem("flowUsersSearchData"));
                    this.searchForm = this.searchdata;
                }
                //重置表单
                this.$refs["addForm"].resetFields();
            },
            init() {
                let json = {
                    "page.current": this.page.current,
                    "page.pageSize": this.page.pageSize
                };
                this.$get(api.flowUsers,
                    Object.assign(json, this.searchdata)
                ).then((res) => {
                    this.tableData = res.data.list;
                    this.page.total = res.data.total;
                    this.page.pageSize = res.data.pageSize;
                    this.page.current = res.data.current;
                    this.activeName = "list";
                }).catch((err) => {
                    console.log(err)
                })
            },
            search() {
                this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("flowUsersSearchData", JSON.stringify(this.searchdata));
            },
            edit(index, row) {
                var data = JSON.parse(JSON.stringify(row));
                data.sysUserList = data.sysUserList.map((v, i) => {
                    return v.id;
                });
                if (data.professionCategoryId) {
                    data.professionCategoryIds = data.professionCategoryId.split(",");
                }
                this.isAdd = false;
                this.activeName = 'changelist';
                Object.assign(this.addForm, data);
                sessionStorage.setItem("ProcessUser", JSON.stringify({
                    isAdd: this.isAdd,
                    activeName: this.activeName,
                    form: this.addForm
                }));
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除流程用户' + row.name + '?').then((res) => {
                    this.$del(api.flowUsers + '/' + row.id).then((res) => {
                        if (res.status == 200) {
                            this.$message({
                                message: res.data,
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
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                data.sysUserList = data.sysUserList.map((v, i) => {
                    return {id: v};
                })
                var professionCategoryId = '';
                for (let i = 0; i < data.professionCategoryIds.length; i++) {
                    professionCategoryId = professionCategoryId + data.professionCategoryIds[i] + ",";
                }
                professionCategoryId = professionCategoryId.substr(0, professionCategoryId.length - 1);
                data.professionCategoryId = professionCategoryId;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.activeName == 'addlist') {
                            this.$post(api.flowUsers, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            }).catch((err) => {
                                this.$message({
                                    message: err.errMsg,
                                    type: 'error'
                                });
                                console.log(err)
                            })
                        } else {
                            this.$put(api.flowUsers + '/' + data.id, data).then((res) => {
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
                });
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list' || newval == 'addlist') {
                    this.isAdd = true;
                    this.$refs.addForm.resetFields();
                    Object.assign(this.addForm, {name: '', enName: '', sysUserList: []})
                }
                if (newval == 'changelist' || newval == 'addlist') {
                    var data = {};
                    data['page.pageSize'] = 1000;
                    data['page.current'] = 1;
                    this.$get('/api/user/v1/users', data).then((res) => {
                        let arr = [];
                        res.data.list.forEach((v, i) => {
                            if (v.hrStaff) {
                                arr.push(v)
                            }
                        });
                        this.accountOpt = arr;
                    }).catch((err) => {
                        console.log(err)
                    });
                }
                if (newval) {
                    sessionStorage.setItem("ProcessUser", JSON.stringify({
                        isAdd: this.isAdd,
                        activeName: this.activeName,
                        form: this.addForm
                    }));
                }
            }
        },
        created() {
            if (sessionStorage.getItem("ProcessUser")) {
                let {activeName, isAdd, form} = JSON.parse(sessionStorage.getItem("ProcessUser"));
                this.activeName = activeName;
                this.isAdd = isAdd;
                this.addForm = form;
            }
            this.$store.dispatch("login/headerTitleChange", "流程用户")
            var professionCategoryIds = this.addForm.professionCategoryIds;
            if (professionCategoryIds.indexOf(null) != -1) {
                professionCategoryIds.splice(professionCategoryIds.indexOf(null), 1);
            }
        },
        beforeDestroy() {
            sessionStorage.removeItem("ProcessUser");
        }
    }
</script>

<style scoped>

</style>
