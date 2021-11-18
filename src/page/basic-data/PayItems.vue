<template>
    <div id="pay-items">
        <PageBar title1="基础数据" title2="收费项目"></PageBar>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="收费项目列表" name="list">
                <div class="search-box" style="overflow: hidden">
                    <el-form :model="searchForm" size="small" label-width="100px" :inline="true">

                        <el-form-item label="专业类别">
                            <select-from-table
                                    @keyup="search"
                                    :model.sync="searchForm.professionCategoryId"
                                    port="profession" :clearable="true" :modelId="true"></select-from-table>
                        </el-form-item>

                        <el-form-item label="项目名称">
                            <el-input v-model.trim="searchForm.name" placeholder="请输入"
                                      @keyup.enter.native="search"></el-input>
                        </el-form-item>

                        <el-form-item label="收费类型">
                            <el-select v-model="searchForm.chargingTypeKey" placeholder="请选择" clearable
                                       @keyup.enter.native="search">
                                <el-option
                                        v-for="item in opt"
                                        :key="item.key"
                                        :label="item.name"
                                        :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" style="color: white"
                                   @click="search">查询
                        </el-button>
                    </el-form>
                </div>
                <el-table
                        :data="tableData"
                        stripe
                        fit
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="name"
                            label="收费项目名称">
                    </el-table-column>
                    <el-table-column
                            prop="professionCategory.name"
                            label="专业类别">
                        <template slot-scope="scope">
                            <span v-if="scope.row.professionCategory">{{scope.row.professionCategory.id?scope.row.professionCategory.name:'全部类别'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="chargingType.name"
                            label="收费类型">
                    </el-table-column>
                    <el-table-column
                            prop="price.yuanFmt"
                            label="价格">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="价格限制/金额">
                        <template slot-scope="scope">
                            {{scope.row.minPrice.yuanFmt+'~'+scope.row.maxPrice.yuanFmt}}
                        </template>
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
                            port="chargeItem"></pagination>
                </div>
            </el-tab-pane>
            <el-tab-pane :label="isAdd?'收费项目添加':'收费项目修改'" :name="isAdd?'addlist':'changelist'">
                <el-form :model="addForm" size="small" ref="payForm" label-width="110px">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="收费项目名称" prop="name" :rules="$filter_rules({required:true})">
                                <el-input v-model.trim="addForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="专业类别" prop="professionCategoryId">
                                <select-from-table :model.sync="addForm.professionCategory" port="profession">
                                    <template slot-scope="scope">
                                        <el-option label="全部类别" :value="{id:''}"></el-option>
                                    </template>
                                </select-from-table>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="收费类型" prop="chargingType" :rules="$filter_rules({required:true})">
                                <!--<Select data_type="charging_type" :model.sync="addForm.chargingTypeId" className="multiple-select"></Select>-->
                                <!--<Select2 port="chargingType" :model.sync="addForm.key"></Select2>-->
                                <el-select v-model="addForm.chargingType" placeholder="请选择" value-key="key">
                                    <el-option
                                            v-for="item in opt"
                                            :key="item.key"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="价格限额">
                                <el-col :lg="{span:11}">
                                    <el-form-item label="下限" prop="minPrice"
                                                  :rules="$filter_rules({required:true,type:'number'})">
                                        <el-input v-model.number="addForm.minPrice"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :lg="{span:11,offset:1}">
                                    <el-form-item label="上限" prop="maxPrice"
                                                  :rules="$filter_rules({required:true,type:'number'}).concat(maxPrice)">
                                        <el-input v-model.number="addForm.maxPrice"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="价格" prop="price"
                                          :rules="$filter_rules({required:true,type:'number'}).concat(limitPrice)">
                                <el-input v-model.number="addForm.price"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <el-row>
                    <el-col :span="2" :offset="10">
                        <el-button type="success" size="mini" class="save-btn" @click="save('payForm')"><i
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
        name: "PayItems",
        components: {'Select2': Select2},
        data() {
            var validatePrice = (rule, value, callback) => {
                if (parseInt(value) < parseInt(this.addForm.minPrice)) {
                    callback(new Error('价格上限需比价格下限大'));
                } else {
                    callback();
                }
            };
            var validatelimitPrice = (rule, value, callback) => {
                if (parseInt(value) < parseInt(this.addForm.minPrice) || parseInt(value) > parseInt(this.addForm.maxPrice)) {
                    callback(new Error('价格需在上下限之间！'));
                } else {
                    callback();
                }
            };
            return {
                activeName: 'list',
                searchForm: {},
                isAdd: true,
                page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
                tablesort: null,
                searchdata: {},
                tableData: [],
                addForm: {},
                // options:[],
                opt: [],
                maxPrice: [{validator: validatePrice, trigger: 'blur'}],
                limitPrice: [{validator: validatelimitPrice, trigger: 'blur'}]
            }
        },
        methods: {
            init() {
                this.$get(api.chargeItem,
                    {
                        "page.current": this.page.current,
                        "page.pageSize": this.page.pageSize,
                    }
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
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.addForm));
                        data.price = {'cent': data.price * 100};
                        data.minPrice = {'cent': data.minPrice * 100};
                        data.maxPrice = {'cent': data.maxPrice * 100};
                        console.log(data, 'data');
                        //增加
                        if (this.activeName == 'addlist') {
                            this.$post(api.chargeItem, data).then((res) => {
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
                        } else if (this.activeName == 'changelist') {
                            this.$put(api.chargeItem + '/' + data.id, data).then((res) => {
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
            search() {
                var data = JSON.parse(JSON.stringify(this.searchForm));
                this.searchdata = data;
            },
            edit(index, row) {
                console.log(row, 'oooooo')
                this.isAdd = false;
                this.activeName = 'changelist'
                var data = JSON.parse(JSON.stringify(row));

                data.price = data.price.cent / 100;
                data.minPrice = data.minPrice.cent / 100;
                data.maxPrice = data.maxPrice.cent / 100;
                this.addForm = data;
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除收费项目' + row.name + '?').then((res) => {
                    this.$del(api.chargeItem + '/' + row.id).then((res) => {
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
                if (newval == 'list') {
                    this.isAdd = true;
                    this.addForm = {};
                }
            }
        },
        created: function () {
            this.$get(api.chargingType).then((res) => {
                this.opt = res.data;
            }).catch((err) => {
                console.log(err)
            })
        }
    }
</script>

<style scoped>

</style>
