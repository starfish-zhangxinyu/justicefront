<template>
    <!--选择委托单位-->
    <div>
        <el-row>
            <el-col style="width:calc(100%)">
                <el-autocomplete
                        v-model="value.name"
                        style="width:100%"
                        @select="handleSelect"
                        :fetch-suggestions="querySearchAsync"
                        :trigger-on-focus="false">
                    <el-button slot="append" icon="el-icon-close" @click="clearContent"/>
                    <el-button slot="append" icon="el-icon-search" @click="openDialog"/>
                    <el-button slot="append" v-if="functionCb && entrustingUnitAdd == '1'" icon="el-icon-plus"
                               @click="functionCb"/>
                </el-autocomplete>
            </el-col>
            <!-- <el-col style="width:88px">
                <el-button type="primary" size="small" plain style="margin: 0px" icon="el-icon-close"
                           @click="clearContent"></el-button>
                <el-button type="primary" size="small" plain style="margin: 0px" icon="el-icon-search"
                           @click="openDialog"></el-button>
            </el-col> -->
        </el-row>
        <!--</el-form-item>-->
        <!--弹出的模态框-->
        <el-dialog title="选择委托单位" :visible.sync="selectClientDialog" :append-to-body="appendToBody">
            <div class="search-box" style="overflow: hidden">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="单位名称">
                        <el-input v-model="searchForm.name" size="mini" @keyup.enter.native="search"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <select-from-dict :model.sync="searchForm.typeId" data_type="ex_unit_type"
                                          :model-id="true" :clearable="true"
                                          @keyup.enter.native="searchClient" :orgId="changeSelect"></select-from-dict>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="searchClient">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                    stripe
                    border
                    size="mini"
                    :data="tableData"
                    tooltip-effect="dark"
                    height="250">
                <el-table-column
                        prop="name"
                        label="单位名称">
                </el-table-column>
                <el-table-column
                        prop="type.label"
                        label="类型">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                        label="操作" width="100%">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="select(scope.$index,scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <div class="pagination-footer">
                    <pagination
                            :pcurrent.sync="page.current"
                            :page.sync="page"
                            :data.sync="tableData"
                            :search.sync="searchdata"
                            :sort.sync="tablesort"
                            :port="port"
                            :change-select="changeSelect">
                    </pagination>
                </div>
                <el-button @click="selectClientDialog = false">取 消</el-button>

            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Test from './TreeSelect'
    import Select2 from '../common/Select2'
    import api from '../../api/index'

    export default {
        name: "SelectClient",
        props: {
            model: {type: Object},
            appendToBody: {type: Boolean, default: false},
            port: {type: String, default: 'entrustingUnit'},
            functionCb: {type: Function},
            changeSelect: {
                type: String,
            },
        },
        components: {'Select2': Select2, 'treeSelect': Test},
        data() {
            return {
                page: {pageSizes: [5, 8, 10], pageSize: 10, total: 0, current: 1},
                tablesort: null,
                searchdata: {status: 'NOR'},
                selectClientDialog: false,
                searchForm: {},
                tableData: [],
                value: this.model || {},
                timeout: null,
                entrustingUnitList: [],
                entrustingUnitAdd: '',
            }
        },
        methods: {
            // 查询表格
            searchClient() {
                this.searchdata = JSON.parse(JSON.stringify(this.searchForm));
                this.searchdata.status = 'NOR'
            },
            select(index, row) {
                this.value = JSON.parse(JSON.stringify(row));
                this.selectClientDialog = false;
            },
            //清除输入框的内容
            clearContent() {
                this.value = {};
            },
            openDialog() {
                this.selectClientDialog = true;
                this.$emit("openDialog");
            },
            querySearchAsync(queryString, cb) {
                let entrustingUnitList = this.entrustingUnitList;
                let results = queryString ? entrustingUnitList.filter(this.createStateFilter(queryString)) : entrustingUnitList;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 1000 * Math.random());

            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            handleSelect(item) {
                this.value = item;
            },
            init() {
                var data = {};
                data['page.pageSize'] = 1000;
                data['page.current'] = 1;
                this.$get(api[this.port], data).then((res) => {
                    var list = [].concat(res.data.list);
                    for (var i = 0; i < list.length; i++) {
                        var json = list[i];
                        json.value = list[i].name;
                        this.entrustingUnitList.push(json);
                    }
                }).catch((err) => console.log(err));
            }
        },
        watch: {
            'model': function (newval, oldval) {
                this.value = newval;
            },
            value: function (newval, oldval) {
                if (newval === '') {
                    newval = null;
                }
                this.$emit("update:model", newval);
            },
            'changeSelect':function () {
                this.value = {};
                this.init();
            }
        },
        mounted() {

        },
        created() {
            this.init();
            //查询是否可以添加委托单位系统参数
            this.$get(api.param + "/value", {key: 'case.entrustingUnit.add'}).then((res) => {
                this.entrustingUnitAdd = res.data;
            }).catch((err) => {
                console.log(err)
            })
        }
    }
</script>

<style scoped>

</style>
