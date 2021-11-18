<template>
    <div id="accept-station">
        <!-- <PageBar title1="系统设置" title2="受理地点管理"/> -->
        <el-tabs type="border-card" v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="受理地点列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" label-width="110px" :inline="true">

                        <el-form-item label="受理地点名称">
                            <el-input v-model.trim="searchForm.name" @keyup.enter.native="search" class="w215"/>
                        </el-form-item>
                        <el-button
                                @click="search"
                                type="primary"
                                icon="el-icon-search" size="small"
                                style="color: white">查询
                        </el-button>
                    </el-form>
                </div>
                <el-table
                        :data="tableData"
                        fit
                        stripe
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            label="受理地点名称">
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序">
                    </el-table-column>
                    <el-table-column
                            prop="remarks"
                            label="备注">
                    </el-table-column>
                    <el-table-column
                            label="操作" align="center" width="150px">
                        <template slot-scope="scope">
                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                       @click="edit(scope.$index, scope.row)"></el-button>
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
                            port="acceptStation">
                    </pagination>
                </div>
            </el-tab-pane>

            <el-tab-pane :label="isAdd?'受理地点添加':'受理地点修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" :rules="rule" ref="stationForm" label-width="150px">
                    <el-row>
                        <el-col :lg="{span:16}">
                            <el-form-item label="受理地点名称" prop="name" >
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16}">
                            <el-form-item label="排序" prop="sort" >
                                <el-input v-model.number="addForm.sort"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16}">
                            <el-form-item label="备注">
                                <el-input v-model="addForm.remarks" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('stationForm')"><i
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
    import api from '../../api/index'

    export default {
        name: "Acceptstation",
        data() {
            var nameDistinct = (rule, value, callback) =>{
                var id = this.addForm.id;
                debugger
                this.$get(api.acceptStationNameDistinct, {"newName":value,"id":id}).then(res=>{
                    if(!res.data){
                        callback(new Error("'"+value+"'已经存在！"))
                    } else {
                        callback();
                    }
                }).catch(err=>{
                    callback(new Error('服务器错误！'));
                })
            };
            return {
                activeName: 'list',
                isAdd: true,
                searchForm: {},
                addForm: {name:'',sort:'',remarks:''},
                rule:{
                    name:[
                        { required: true, message: '该输入项为必填项!', trigger: 'blur'},
                        {min: 1, max: 50, message: '最多输入50个字符!', trigger:'blur'},
                        { validator: nameDistinct, trigger: 'blur'  }
                    ],
                    sort:[{required: true}]
                },
                tableData: [],
                page: {pageSizes: [30, 50, 80, 100], pageSize: 30, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
            }
        },
        methods: {
            handleClick(tab, event) {
                if(sessionStorage.getItem("acceptStationSearchData")){
                    this.searchdata = JSON.parse(sessionStorage.getItem("acceptStationSearchData"));
                    this.searchForm = this.searchdata;
                }
                sessionStorage.setItem("acceptStation",JSON.stringify({
                    isAdd:this.isAdd,
                    activeName:this.activeName,
                    form:this.addForm
                }));
                //重置表单
                this.$refs["stationForm"].resetFields();
            },
            init() {
                let json =  {
                        "page.current": this.page.current,
                        "page.pageSize": this.page.pageSize,
                    }
                this.$get(api.acceptStation,
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
                var json = JSON.parse(JSON.stringify(this.searchForm));
                sessionStorage.setItem("acceptStationSearchData",JSON.stringify(json));
                this.searchdata = json;
            },
            edit(index, row) {
                this.isAdd = false;
                this.activeName = 'changelist';
                Object.assign(this.addForm,JSON.parse(JSON.stringify(row)));
                sessionStorage.setItem("acceptStation",JSON.stringify({
                    isAdd:this.isAdd,
                    activeName:this.activeName,
                    form:this.addForm
                }));
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除受地理点' + row.name + '吗?').then((res) => {
                    this.$del(api.acceptStation + '/' + row.id).then((res) => {
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
            save(formName) {
                var data = JSON.parse(JSON.stringify(this.addForm));
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.activeName == 'addlist') {
                            console.log(data, '新增');
                            this.$post(api.acceptStation, data).then((res) => {
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
                            console.log(data, '修改');
                            this.$put(api.acceptStation + '/' + data.id, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '修改成功！',
                                        type: 'success'
                                    });
                                    // this.searchForm = {};
                                    this.init();
                                    this.$refs[formName].resetFields();
                                }
                            })
                        }
                    }
                })
            }
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.isAdd = true;
                    this.$refs.stationForm.resetFields();
                    Object.assign(this.addForm,{name:'',sort:'',remarks:''})
                }
            },
        },
        created(){
            this.$store.dispatch("login/headerTitleChange", "受理地点管理");
            if(sessionStorage.getItem("acceptStation")){
                let {activeName,isAdd,form} = JSON.parse(sessionStorage.getItem("acceptStation"));
                this.activeName=activeName;
                this.isAdd=isAdd;
                this.addForm=form;
            };
        },
        beforeDestroy(){
            sessionStorage.removeItem("acceptStation");
            
        }
    }
</script>

<style scoped>

</style>
