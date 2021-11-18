<template>
    <div id="personal-contact">
        <!-- <PageBar title1="客户管理" title2="个人联系人管理"></PageBar> -->
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="个人联系人列表" name="list"  @tab-click="handleClick">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" label-width="100px" >
                        <el-row>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="姓名">
                                    <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" />
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="工作单位">
                                    <el-input v-model.trim="searchForm.company" @keyup.enter.native="search" />
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="手机号">
                                    <el-input v-model.trim="searchForm.phone" @keyup.enter.native="search" />
                                </el-form-item>
                            </el-col>
                            <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                                <el-form-item label="备注" class="margin0">
                                    <el-input v-model.trim="searchForm.remarks" @keyup.enter.native="search"/>
                                </el-form-item>
                            </el-col>
                            <el-button type="primary" icon="el-icon-search" size="small" style="color: white;float:right"
                                       @click="search">查询</el-button>
                        </el-row>
                    </el-form>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        fit
                        border
                        size="mini"
                        style="width: 100%"
                        :max-height="tableHeight">
                    <el-table-column
                            prop="name"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="sex"
                            label="性别">
                        <template slot-scope="scope">
                            <span v-if="scope.row.sex=='F'">女</span>
                            <span v-if="scope.row.sex=='M'">男</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号">
                    </el-table-column>
                    <el-table-column
                            prop="qq"
                            label="微信号/QQ">
                    </el-table-column>
                    <el-table-column
                            prop="company"
                            label="工作单位">
                    </el-table-column>
                    <el-table-column
                            prop="remarks"
                            label="备注">
                    </el-table-column>
                    <el-table-column
                            label="操作" width="150px" align="center">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index,scope.row)"></el-button>
                            <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                       @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
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
                            port="externalPerson">
                    </pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'个人联系人添加':'个人联系人修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="externalPersonForm" label-width="150px">
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="姓名" :rules='$filter_rules({required:true})' prop="name">
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="性别">
                                <el-radio-group v-model="addForm.sex">
                                    <el-radio label="M">男</el-radio>
                                    <el-radio label="F">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="手机号" :rules='$filter_rules({required:true,type:"mobile"})'
                                          prop="phone">
                                <el-input v-model.trim="addForm.phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="微信/QQ">
                                <el-input v-model.trim="addForm.qq"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="工作单位">
                                <el-input v-model.trim="addForm.company"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="状态" prop="status"
                                          :rules="$filter_rules({required:true, trigger: 'change'})">
                                <el-select class="w100" v-model="addForm.status" placeholder="请选择" size="small">
                                    <el-option label="等待审批" value="0"></el-option>
                                    <el-option label="正常" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="备注">
                                <el-input v-model="addForm.remarks" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('externalPersonForm')"><i
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
    import Test from '../../components/common/TreeSelect'
    import Select2 from '../../components/common/Select2'
    import api from '../../api/index'

    export default {
        name: "Personalcontact",
        data() {
            return {
                page: {pageSizes: [30, 50, 80, 100], pageSize: 30, total: 0, current: 1},
                tablesort: null,
                searchdata: {type: 'PERSONAL_CONTACT'},
                panClass: {
                    sm: { span: 12 },
                    md: { span: 8 },
                    xl: { span: 6, offset: 1 }
                },
                activeName: 'list',
                tableData: [],
                searchForm: {},
                isAdd: true,
                addForm: {}
            }
        },
        methods: {
             handleClick(tab, event) {
                if(sessionStorage.getItem("externalPersonSearchData")){
                    this.searchdata = JSON.parse(sessionStorage.getItem("externalPersonSearchData"));
                    this.searchForm = this.searchdata;
                }
                //重置表单
                this.$refs["externalPersonForm"].resetFields();
            },
            init() {
                let json = { 
                    "page.current": this.page.current,
                    "page.pageSize": this.page.pageSize
                    };
                this.$get(api.externalPerson,
                  Object.assign(json,this.searchdata)
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
                var data = JSON.parse(JSON.stringify(this.searchForm));
                data.type = 'PERSONAL_CONTACT';
                sessionStorage.setItem("externalPersonSearchData",JSON.stringify(data));
                this.searchdata = data;
            },
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                data.type = 'PERSONAL_CONTACT';
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.activeName == 'addlist') {
                            this.$post(api.externalPerson, data).then((res) => {
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
                            this.$put(api.externalPerson + '/' + data.id, data).then((res) => {
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
            },
            edit(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist';
                this.addForm = JSON.parse(JSON.stringify(row));
                sessionStorage.setItem("FormTemplate",JSON.stringify({
                    isAdd:this.isAdd,
                    activeName:this.activeName,
                    form:this.addForm
                }));
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除个人联系人' + row.name + '?').then((res) => {
                    this.$del(api.externalPerson + '/' + row.id).then((res) => {
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
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if(newval){
                    sessionStorage.setItem("Personalcontact",JSON.stringify({
                        isAdd:this.isAdd,
                        activeName:this.activeName,
                        form:this.addForm
                    }));
                }
                if (newval == 'list'||newval=="addlist") {
                    this.isAdd = true;
                    this.addForm = {};
                    this.$refs.externalPersonForm.resetFields();
                }
            }
        },
        created(){
            if(sessionStorage.getItem("Personalcontact")){
                let {activeName,isAdd,form} = JSON.parse(sessionStorage.getItem("Personalcontact"));
                this.activeName=activeName;
                this.isAdd=isAdd;
                this.addForm=form;  
            };
            this.$store.dispatch("login/headerTitleChange", "个人联系人管理")
            this.tableHeight = window.innerHeight - 365 + 'px';
        },
        beforeDestroy(){
            sessionStorage.removeItem("Personalcontact");
        }
    }
</script>

<style scoped>

</style>
