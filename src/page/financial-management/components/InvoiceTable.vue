<template>
    <div >
        <el-table
                :span-method="arraySpanMethod"
                :data="tableData"
                ref="invoiceTable"
                fit
                border
                @select-all="handleCheckBox"
                @select="handleCheckBox"
                @sort-change="sortChange"
                size="mini"
                style="width: 100%"
                class="table"
                :max-height="tableHeight"
                >
            <slot></slot>
        </el-table>
    </div>
</template>

<script>
    import api from '../../../api/index'
    import axios from 'axios'

    export default {
        name: "InvoiceTable",
        props: {
            tableData:{
                type:Array,
                default() {
                    return []
                }
            },
            spanArr: {
                type: Array,
                default() {
                    return []
                }
            },
            chargeTypeData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableHeight: {
                type:String,
                default:'500px'
            },
            page:{
                type:Object
            },
            selectRow:{
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                pageSizes: [30, 50, 80, 100],
                total: 0,
                selectData:[],//选中的数据，格式为[[],[],[]]...


            }
        },
        updated() {
            this.$nextTick(() => {
                let selectRows = JSON.parse(JSON.stringify(this.selectData));
                this.tableData.forEach(outerItem => {
                    selectRows[this.page.current - 1] && selectRows[this.page.current - 1].forEach(item => {
                        if(outerItem.id == item.id) {
                            this.$refs.invoiceTable.toggleRowSelection(outerItem, true);
                        }
                    })

                })
            })
        },
        methods: {
            //选框 触发回调
            handleCheckBox(list) {
                    this.selectData[this.page.current - 1]  = list;
                    this.handleSelect(this.selectData);
            },
            handleSelect(val) {
                this.selectRows = val.reduce((previousValue, currentValue) => {
                    return previousValue.concat(currentValue);
                },[]);
                let rows = JSON.parse(JSON.stringify( this.selectRows));
                this.$emit('changeSelectRows', rows);
            },
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                var i = this.chargeTypeData.length;
                i = 0; //列表上收费类型列BUG，先固定
                var exceptColArr = [26 + i, 27 + i, 28 + i, 29 + i, 30 + i, 31 + i,];
                if (exceptColArr.indexOf(columnIndex) == -1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            sortChange(obj) {
                this.$emit('sortChange', obj);
            },
        },
       /* watch: {
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
            }
        },*/
    }
</script>

<style scoped lang="less">
    .table /deep/ .cell{
        width: 100% !important;
    }
</style>