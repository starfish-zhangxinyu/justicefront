<template>
    <div>
        <el-form ref="form"
                 label-width="130px"
                 size="small"
                 :model="poisonForm"
                 class="demo-ruleForm"
                 label-position="right"  v-if="this.poisonTestResult">
            <Portlet title="毒物检验结果">
                <template slot="body">
                    <el-table
                            :data="poisonForm.poSampleResultList"
                            :span-method="objectSpanMethod"
                            @cell-mouse-leave="cellMouseLeave"
                            @cell-mouse-enter="cellMouseEnter"
                            :cell-class-name="tableRowClassName"
                            fit
                            stripe
                            border
                            size="mini"
                            style="width: 100%">
                        <el-table-column
                                prop="poSample.sampleNo"
                                label="样本编号">
                        </el-table-column>
                        <el-table-column
                                prop="poSample.sampleName"
                                label="样本名称">
                        </el-table-column>
                        <el-table-column
                                label="毒物毒品类别"
                                prop="poPoisonCategory.name">
                        </el-table-column>
                        <el-table-column
                                label="毒物毒品名称"
                                prop="poPoison.name">
                        </el-table-column>
                        <el-table-column
                                prop="result">
                            <template slot="header">
                                <i style="color: red;margin-right: 5px">*</i><span>定性结果</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'poSampleResultList.' + scope.$index + '.result'">
                                    <el-select
                                            :clearable="true"
                                            v-model="scope.row.result"
                                            placeholder="请选择">
                                        <el-option label="阳性" value="POSITIVE"></el-option>
                                        <el-option label="阴性" value="NEGATIVE"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="poisonContent"
                                label="定量结果">
                            <template slot-scope="scope">
                                <el-form-item
                                        label-width="0px"
                                        :prop="'poSampleResultList.' + scope.$index + '.poisonContent'">
                                    <el-input v-model="scope.row.poisonContent"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="100px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" v-if="!scope.row.id"
                                           @click="delPoison(scope.$index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="300px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="addPoison(scope.row)">增加毒物毒品</el-button>
                                <el-button size="mini" type="primary" @click="showPrintForm(scope.row)">打印表单</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </Portlet>
        </el-form>
        <!--表单打印窗口开始-->
        <el-dialog title="表单打印" :visible.sync="showListFormFileDialog">
            <div style="margin-top: 10px">
                <Table
                        :data.sync="listFormFileData"
                        :search.sync="listFormFileSearchData"
                        :page.sync="page"
                        port="template"
                        :hasPaging="true"
                        :selfDefinedBtn="true">
                    <template solt>
                        <el-table-column
                                prop="name"
                                label="表单名称"
                        ></el-table-column>
                        <el-table-column label="操作" align="center" width="300px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="printForm(scope.row,'Y')">重新渲染表单
                                </el-button>
                                <el-button size="mini" type="primary" @click="printForm(scope.row,'N')">打印表单</el-button>
                            </template>
                        </el-table-column>
                    </template>
                </Table>
            </div>
        </el-dialog>
        <!--表单打印窗口结束-->

        <!--导入毒物毒品Start-->
        <el-dialog title="增加毒物毒品" :visible.sync="showAddPoisonDialog">
            <el-form ref="poisonAddForm" label-width="0px" size="small" :model="poisonAddForm" class="demo-ruleForm">
                <el-button type="primary" size="mini" style="float: right;margin-bottom: 10px"
                           @click="poisonAddForm.list.push({})">增加
                </el-button>
                <el-table
                        :data="poisonAddForm.list"
                        tooltip-effect="dark"
                        stripe
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="poPoisonCategory">
                        <template slot="header">
                            <i style="color: red;margin-right: 5px">*</i><span>毒物毒品类别</span>
                        </template>
                        <template slot-scope="scope">
                            <el-form-item
                                    :rules="$filter_rules({required:true})"
                                    :prop="'list.' + scope.$index + '.poPoisonCategory'">
                                <el-select
                                        :clearable="true"
                                        value-key="id"
                                        v-model="scope.row.poPoisonCategory"
                                        placeholder="请选择"
                                        @change="(val)=>{poPoisonCategoryChange(val,scope.row)}">
                                    <el-option
                                            v-for="item in poisonCategoryOpt"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="poPoison.name">
                        <template slot="header">
                            <i style="color: red;margin-right: 5px">*</i><span>毒物名称</span>
                        </template>
                        <template slot-scope="scope">
                            <el-form-item
                                    :rules="$filter_rules({required:true})"
                                    :prop="'list.' + scope.$index + '.poPoison'">
                                <select-from-table
                                        :model.sync="scope.row.poPoison"
                                        :port="port"
                                        :condition.sync="scope.row.poisonConditon"
                                        :clearable="true"></select-from-table>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作" width="100px" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="deletePoison(scope.$index,scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer" ref="poisonFooter">
                <el-button @click="showAddPoisonDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="saveAddPoison()" size="small">保存</el-button>
            </div>
        </el-dialog>
        <!--导入毒物毒品End-->
    </div>
</template>

<script>
    import Portlet from '../../layout/Portlet'
    import api from '../../../api/index'
    import PageOfficeApi from '../../../components/tpl/PageOfficeApi'

    export default {
        name: "PoisonResult",
        props: ['caseId', 'model', 'basicData','poisonTestResult'],
        components: {
            'Portlet': Portlet,
        },
        data() {
            return {
                poisonForm: this.model,
                poisonCategoryOpt: [],
                spanArr: [],
                pos: '',
                printSampleId: '',//打印的样本Id,
                showListFormFileDialog: false,
                professionCategoryId: '',
                listFormFileData: [],
                listFormFileSearchData: {},
                page: {pageSizes: [30, 50, 80, 100], pageSize: 30, total: 0, current: 1},
                showAddPoisonDialog: false,
                poisonAddForm: {list: [], rowData: null},
                port: '',
                OrderIndexArr: [],
                hoverOrderArr: [],
                insertIndex: 0 
            }
        },
        methods: {
            //合并行
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                var exceptColArr = [0, 1, 7];
                if (exceptColArr.indexOf(columnIndex) != -1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            //获取需要合并的行
            getSpanArr(data) {
                this.spanArr = [];
                debugger;
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0;
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].poSample.id === data[i - 1].poSample.id) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            showPrintForm(row) {
                this.printSampleId = '';
                this.printSampleId = row.poSample.id
                this.listFormFileSearchData = {
                    professionCategoryId: this.professionCategoryId,
                    formLocation: 'AUTH_RECORD',
                    templateType: 'FORM',
                };
                this.showListFormFileDialog = true;
            },
            printForm(row, isReCreate) {
                PageOfficeApi.renderForm(this.caseId, this.printSampleId, row.id, isReCreate)
            },
            addPoison(row) {
                this.poisonAddForm = {list: [], rowData: row}

                //计算出插入的位置（相同样本的最后一个毒品的位置）
                var poSampleResultList = JSON.parse(JSON.stringify(this.poisonForm.poSampleResultList));
                this.insertIndex = 0;
                for(let i=poSampleResultList.length-1;i>=0;i--){
                    if(poSampleResultList[i].poSample.id == row.poSample.id){
                        this.insertIndex = i+1;
                        break;
                    }
                }
                this.showAddPoisonDialog = true;
            },
            delPoison(index){
                var poSampleResultList = JSON.parse(JSON.stringify(this.poisonForm.poSampleResultList));
                poSampleResultList.splice(index, 1)
                this.poisonForm.poSampleResultList = poSampleResultList;
                this.getOrderNumber();
            },
            saveAddPoison: function () {
                this.$refs.poisonAddForm.validate(valid => {
                    if (valid) {
                        var importPoisonList = JSON.parse(JSON.stringify(this.poisonAddForm.list));
                        var poSampleResultList = JSON.parse(JSON.stringify(this.poisonForm.poSampleResultList));
                        var poisonIds = [];
                        poSampleResultList.forEach(v => {
                            poisonIds.push(v.poPoison.id);
                        })
                        if (importPoisonList && importPoisonList.length > 0) {
                            var rowTemp = this.poisonAddForm.rowData;
                            importPoisonList.forEach(v => {
                                if (poisonIds.indexOf(v.poPoison.id) == -1) {
                                    let data = {};
                                    Object.assign(data, rowTemp, {poisonContent: "", result: "", id: ""});
                                    data.poPoison = v.poPoison;
                                    data.poPoisonCategory = v.poPoisonCategory;
                                    poSampleResultList.splice(this.insertIndex,0,data);
                                } else {
                                    this.$message.error("请不要重复导入！")
                                }
                            })
                        }
                        this.poisonForm.poSampleResultList = poSampleResultList;
                        this.getOrderNumber();
                        this.showAddPoisonDialog = false;
                    } else {
                        this.showAddPoisonDialog = true;
                        return;
                    }
                });
            },
            poPoisonCategoryChange(val, row) {
                var data = JSON.parse(JSON.stringify(val));
                this.port = 'poison';
                row.poisonConditon = {poisonCategoryId: data.id};
                if (row.poPoison) {
                    row.poPoison = null;
                }
                if (row.result) {
                    row.result = '';
                }
                if (row.poisonContent) {
                    row.poisonContent = '';
                }
            },
            getOrderNumber() {
                let OrderObj = {};
                this.OrderIndexArr = [];
                this.poisonForm.poSampleResultList.forEach((element, index) => {
                    element.rowIndex = index;
                    if (OrderObj[element.poSample.id]) {
                        OrderObj[element.poSample.id].push(index);
                    } else {
                        OrderObj[element.poSample.id] = [];
                        OrderObj[element.poSample.id].push(index);
                    }
                });
                // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
                for (let k in OrderObj) {
                    if (OrderObj[k].length > 1) {
                        this.OrderIndexArr.push(OrderObj[k]);
                    }
                }
                OrderObj = null;
            },
            //合并行函数，不管
            objectSpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex === 0 || columnIndex === 1 || columnIndex === 7) {
                    for (let i = 0; i < this.OrderIndexArr.length; i++) {
                        let element = this.OrderIndexArr[i];
                        for (let j = 0; j < element.length; j++) {
                            let item = element[j];
                            if (rowIndex == item) {
                                if (j == 0) {
                                    return {
                                        rowspan: element.length,
                                        colspan: 1
                                    };
                                } else if (j != 0) {
                                    return {
                                        rowspan: 0,
                                        colspan: 0
                                    };
                                }
                            }
                        }
                    }
                }
            },
            //table函数，不管
            tableRowClassName({row, rowIndex}) {
                let arr = this.hoverOrderArr;
                for (let i = 0; i < arr.length; i++) {
                    if (rowIndex == arr[i]) {
                        return "hovered-row";
                    }
                }
            },
            //table函数，不管
            cellMouseEnter(row, column, cell, event) {
                this.rowIndex = row.rowIndex;
                this.hoverOrderArr = [];
                this.OrderIndexArr.forEach(element => {
                    if (element.indexOf(this.rowIndex) >= 0) {
                        this.hoverOrderArr = element;
                    }
                });
            },
            //table函数，不管
            cellMouseLeave(row, column, cell, event) {
                this.rowIndex = "-1";
                this.hoverOrderArr = [];
            }
        },
        watch: {
            'model': {
                handler(newVal, oldVal) {
                    this.poisonForm = newVal;
                },
                deep: true,
                immediate: true
            },
            poisonForm: {
                handler(newVal, oldVal) {
                    this.$emit("update:model", newVal);
                },
                deep: true,
                immediate: true
            }
        },
        created() {
            this.$get(api.poisonCategory).then((res) => {
                this.poisonCategoryOpt = res.data;
            }).catch((err) => {
                console.log(err)
            });
            if (this.basicData) {
                var data = JSON.parse(JSON.stringify(this.basicData));
                if (data.professionCategory) {
                    this.professionCategoryId = data.professionCategory.id;
                }
                this.poisonForm.poSampleResultList = data.poSampleResultList;
                this.getOrderNumber();
            }

        }
    }
</script>

<style lang="less" scoped>
</style>