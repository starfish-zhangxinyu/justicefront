<template>
    <div style="margin-top: 10px">
        <div>
            <el-button-group style="margin-bottom:10px;">
                <el-button v-if="hasPermission('auth:quality:reject')" size="small" type="primary"  @click="reject">驳回
                </el-button>
                <el-button v-if="hasPermission('auth:quality:lock')" size="small" type="primary" @click="lock">锁定
                </el-button>
                <el-button v-if="hasPermission('auth:quality:unlock')" size="small" type="primary"@click="unlock">取消锁定
                </el-button>
                <el-button v-if="hasPermission('auth:quality:progressStatus')" size="small" type="primary" @click="openStatus">进度状态
                </el-button>
                <el-button v-if="hasPermission('auth:quality:submit')" size="small" type="primary" @click="submitPlan">提交
                </el-button>
                <el-button size="small" type="primary" @click="exportPlan">导出
                </el-button>
            </el-button-group>
        </div>
        <el-table
                :data="tableData"
                stripe
                fit
                border
                :resizable="false"
                @select="handleCheckBox"
                @select-all="handleCheckBox"
                row-key="id"
                size="mini"
                style="width: 100%"
                :max-height="maxHeight"
                ref="planTable">
            <slot></slot>
        </el-table>
        <div style="overflow: hidden" class="pagination-footer">
            <el-pagination
                    style="float:right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pages.current"
                    :page-sizes="pageSizes"
                    :page-size="pages.pageSize"
                    :layout="layout"
                    :total="pages.total"
                    background>
            </el-pagination>
        </div>
        <el-dialog title="导出计划列表" :visible.sync="exportPlanListDialog">
        <span style="margin-left: 70%">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox v-model="checkReverse" @change="handleCheckReverseChange">反选
            </el-checkbox>
        </span>
        <el-checkbox-group v-model="checkedList" @change="handleCheckedItemChange">
             <el-table :data="planHeaders" fit stripe border size="mini" style="width: 100%; padding: 0;" :show-header="true">
                 <el-table-column align="center" label="列表栏">
                        <template slot-scope="scope">
                            <ul>
                                <li style="float:left; min-width: 25%;">
                                    <el-checkbox :label="scope.row.first" v-if="scope.row.first">
                                        {{scope.row.first}}
                                    </el-checkbox>
                                </li>
                                <li style="float:left; min-width: 25%">
                                    <el-checkbox :label="scope.row.second" v-if="scope.row.second">
                                        {{scope.row.second}}
                                    </el-checkbox>
                                </li>
                                <li style="float:left; min-width: 25%">
                                    <el-checkbox :label="scope.row.third" v-if="scope.row.third">
                                        {{scope.row.third}}
                                    </el-checkbox>
                                </li>
                                <li style="float:left; min-width: 25%">
                                    <el-checkbox :label="scope.row.forth" v-if="scope.row.forth">
                                        {{scope.row.forth}}
                                    </el-checkbox>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
              </el-table>
        </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="exportPlanListDialog = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="confirmExportPlan">确 定 </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import api from '../../../api/index'
    import axios from 'axios'

    export default {
        name: "PlanTable",
        inject:['hasPermission'],
        // props:['data','port','page','search'],
        props: {
            data: Array,
            port: {//表格数据的接口
                type: String,
                required: true
            },
            hasPaging: Boolean,
            page: {//页码信息
                type: Object,
                default() {
                    return {current: 1, pageSize: 30};
                }
            },
            selfDefinedBtn: {
                type: Boolean,
                required: false
            },
            search: {
                type: Object,
                default() {
                    return {};
                }
            },
            postType: {
                type: String,
            },
            //是否可拖拽
            isDragdrop: {
                type: Boolean,
                default: false
            },
            isSelect: {
                type: Boolean,
                default: false
            },
            layout: {
                type: String,
                default: 'total,sizes,prev, pager, next'
            },//分页的类型参数
            exportTitle:{
                type:Array,
                default() {
                    return []
                }
            },
            tag:{
                type:String
            },
            maxHeight: {
                type:String
            }
        },
        data() {
            return {
                pageSizes: [30, 50, 80, 100],
                total: 0,
                pages: this.page,
                tableData: [],
                selectRows: [],
                exportPlanListDialog: false,
                checkAll:false,
                checkReverse:false,
                checkedList:[]
            }
        },
        computed:{
            planHeaders() {
                let arr = []
                  this.exportTitle.forEach((item, index) => {
                      if(index % 4 == 0) {
                          arr.push({first:item})
                      }
                      if(index % 4 == 1) {
                          arr[Math.floor(index / 4)].second = item;
                      }
                      if(index % 4 == 2) {
                          arr[Math.floor(index / 4)].third = item;
                      }
                      if(index % 4 == 3) {
                          arr[Math.floor(index / 4)].forth = item;
                      }
                  })
                return arr
            }
        },
        updated() {
            this.$nextTick(() => {
                let selectRows = JSON.parse(JSON.stringify(this.selectRows));
                this.tableData.forEach(outerItem => {
                        selectRows[this.page.current - 1] && selectRows[this.page.current - 1].forEach(item => {
                            if(outerItem.id == item.id) {
                                this.$refs.planTable.toggleRowSelection(outerItem,true);
                                this.n = true;
                            }
                        })

                })
            })
        },
        methods: {
            //选框 触发回调
            handleCheckBox(list) {
                if (this.isSelect) {
                    this.selectRows[this.page.current - 1]  = list;
                    this.$emit('selectChange', this.selectRows)
                }
            },
            init(data) {
                if (this.port) {
                    let loadingInstance = this.$loading({fullscreen: true});
                    if (this.postType === 'get') {
                        if(!data) {
                            data["pageDto.current"] = 1;
                            data["pageDto.pageSize"] = 30;
                        }else {
                            if(!(data['pageDto.pageSize'] &&  data["pageDto.current"])) {
                                data["pageDto.current"] = 1;
                                data["pageDto.pageSize"] = 30;
                            }
                        }
                        this.$get(api[this.port],data).then((res) => {
                            this.tableData = res.data.list;
                            this.page.pageSize = res.data.pageSize;
                            this.page.current = res.data.current;
                            this.page.total = res.data.total;
                            console.log('res.data.list1',res.data.list)
                            loadingInstance.close();
                        }).catch((err) => {
                            console.log(err);
                            loadingInstance.close();
                        })
                        return;
                    } else if (this.postType === 'post') {
                        //json
                        /*if(!data) {
                            data["pageDto.current"] = 1;
                            data["pageDto.pageSize"] = 30;
                        }else {
                            if(!(data['pageDto.pageSize'] &&  data["pageDto.current"])) {
                                data["pageDto.current"] = 1;
                                data["pageDto.pageSize"] = 30;
                            }
                        }*/
                        this.$post(api[this.port], data).then((res) => {
                            this.tableData = res.data.list;
                            this.page.pageSize = res.data.pageSize;
                            this.page.current = res.data.current;
                            this.page.total = res.data.total;
                            loadingInstance.close();
                        }).catch((err) => {
                            console.log(err);
                            loadingInstance.close();
                        })
                        return;
                    }
                }
            },
            handleSizeChange(pageSize) {
                if (this.search) {
                    var searchform = JSON.parse(JSON.stringify(this.search));
                    if(this.postType == 'get') {
                        searchform["pageDto.current"] = 1;
                        searchform["pageDto.pageSize"] = pageSize;
                    }else {
                        //post请求
                        searchform.pageDto.pageSize = pageSize;
                        searchform.pageDto.current = 1;
                    }
                    this.init(searchform);
                } else {
                    var searchform = {};
                    searchform["pageDto.current"] = 1;
                    searchform["pageDto.pageSize"] = pageSize;
                    this.init(searchform);
                }
            },
            handleCurrentChange(current) {
                if (this.search) {
                    var searchform = JSON.parse(JSON.stringify(this.search));
                    if(this.postType == 'get') {
                        searchform["pageDto.current"] = current;
                        searchform["pageDto.pageSize"] = this.pages.pageSize;
                    }else {
                        //post请求
                        searchform.pageDto.pageSize = this.pages.pageSize;
                        searchform.pageDto.current = current;
                    }

                    this.init(searchform);
                } else {
                    var searchform = {};
                    searchform["pageDto.current"] = current;
                    searchform["pageDto.pageSize"] = this.pages.pageSize;
                    this.init(searchform);
                }
            },
            edit(index, row) {
                this.$emit('edit', index, row);
            },
            deleteRow(index, row) {
                this.$emit('deleteRow', index, row);
            },
            reject() {
                this.$emit('reject');
            },
            lock() {
                this.$emit('lock');
            },
            unlock() {
                this.$emit('unlock');
            },
            openStatus() {
                this.$emit('openStatus');
            },
            submitPlan() {
                this.$emit('submitPlan');
            },
            handleCheckAllChange() {
                if(this.checkedList.length !== this.exportTitle.length) {
                    this.checkedList = this.exportTitle;
                }else {
                    this.checkedList = []
                }
            },
            handleCheckReverseChange() {
                let notCheckedItems = this.exportTitle.filter(item => !this.checkedList.includes(item));
                this.checkedList = notCheckedItems;
            },
            handleCheckedItemChange() {
                this.checkAll = this.checkedList.length == this.exportTitle.length;
            },
            exportPlan() {
              this.exportPlanListDialog = true;
              this.checkedList = [];
              this.checkAll = false;
              this.checkReverse = false;
            },
            async confirmExportPlan() {
                this.exportPlanListDialog = false;
                let idList = [];
                if(this.selectRows.length > 0) {
                    idList = this.selectRows.reduce((previousValue, currentValue) => {
                        return previousValue.concat(currentValue);
                    },[]).map(item => item.id);
                }else {
                    //全部导出
                    idList = null;
                }
                try {
                    let { data } = await axios.post(
                        api.exportPlan,{
                                recordIds:idList,
                                requiredHeaders: this.checkedList,
                                planMode:this.tag
                        },{ responseType :'blob'}
                    );
                    let downName = '';
                    switch(this.tag) {
                        case 'TRAIN':downName = '培训计划列表.xlsx';break;
                        case 'EXAM':downName = '考核计划列表.xlsx';break;
                        case 'CONTROL':downName = '质量控制计划列表.xlsx';break;
                        case 'SUPERVISE':downName = '质量监督计划列表.xlsx';break;
                    }
                    let url = window.URL.createObjectURL(new Blob([data.data]));
                    let link = document.createElement("a");
                    link.style.display = "none";
                    link.href = url;
                    document.body.appendChild(link);

                    link.setAttribute("download", downName);
                    link.click();
                    url = null;
                    link = null;
                } catch {
                    this.$message.error("导出失败");
                }
            },
        },
        watch: {
            'data': function (newval, oldval) {
                this.tableData = newval;
            },
            tableData: function (newval, oldval) {
                this.$emit("update:data", newval);
            },
            'page': function (newval, oldval) {
                this.pages = newval;
            },
            pages: function (newval, oldval) {
                this.$emit("update:page", newval);
            },
            'search': function (newval, oldval) {
                if (this.search) {
                    var searchform = JSON.parse(JSON.stringify(this.search));
                    if(this.postType == 'get') {
                        searchform['pageDto.pageSize'] = this.pages.pageSize;
                        searchform["pageDto.current"] = 1;
                    }else {
                        //post请求
                        searchform.pageDto.pageSize = this.pages.pageSize;
                        searchform.pageDto.current = 1;
                    }
                    this.init(searchform);
                } else {
                    var searchform = {};
                    searchform['pageDto.pageSize'] = this.pages.pageSize;
                    searchform["pageDto.current"] = 1;
                    this.init(searchform);
                }
            },
            deep: true,
            immediate: true,
        },
        created: function () {
            if (this.hasPaging) {
                if (this.search) {
                    var searchform = JSON.parse(JSON.stringify(this.search));
                    if(this.postType == 'get') {
                        searchform['pageDto.pageSize'] = 30;
                        searchform["pageDto.current"] = 1;
                    }else {
                        //post请求
                        searchform.pageDto.pageSize = 30;
                        searchform.pageDto.current = 1;
                    }

                    this.init(searchform);
                } else {
                    var searchform = {};
                    searchform['page.pageSize'] = 30;
                    searchform["page.current"] = 1;
                    this.init(searchform);
                }
            } else {
                this.init();
            }
        },
        mounted() {
            if (this.isDragdrop) this.rowDrop();
        }
    }
</script>

<style scoped lang="less">

</style>