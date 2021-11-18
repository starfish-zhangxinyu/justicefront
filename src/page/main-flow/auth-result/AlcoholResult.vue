<template>
    <el-form ref="form" label-width="130px" size="small" :model="alcoholResultForm" class="demo-ruleForm">
        <Portlet title="酒精" v-if="alcoholType === '1'">
            <template slot="buttonGroup">
                <el-select v-model="path" placeholder="请选择" size="mini"
                           style="float: right;margin-right: 10px;width: 100px">
                    <el-option label="单通道" value="ONE_PATH"></el-option>
                    <el-option label="双通道" value="TWO_PATH"></el-option>
                </el-select>
            </template>
            <template slot="body">
                <!--单通道-->
                <div v-if="path=='ONE_PATH'" key="one">
                    <el-table
                            :data="alcoholResultForm.singleResultList"
                            fit
                            stripe
                            border
                            size="mini"
                            style="width: 100%">
                         <el-table-column
                               prop="sample.sampleNo"
                                label="样本编号">
                        </el-table-column>
                        <el-table-column
                                prop="sample.sampleName"
                                label="样本名称">
                        </el-table-column>
                        <el-table-column
                                prop="sample.authPersonName"
                                label="被检人">
                        </el-table-column>
                        <el-table-column
                                prop="content1"
                                label="C1(mg/100ml)">
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'singleResultList.' + scope.$index + '.content1'">
                                    <el-input size="mini" v-model="scope.row.content1"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="content2"
                                label="C2(mg/100ml)">
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'singleResultList.' + scope.$index + '.content2'">
                                    <el-input size="mini" v-model="scope.row.content2"></el-input>
                                </el-form-item>

                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="relativeDifference"
                                label="相对相差(%)">
                            <template slot-scope="scope">
                                    <span>
                                        {{scope.row.relativeDifference =getRelativeDifference(scope.row.content1,scope.row.content2,getAverageValue(scope.row))}}
                                    </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="C平均(mg/100ml)">
                            <template slot-scope="scope">
                                <span>{{scope.row.content = getAverageValue(scope.row)}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <!--双通道-->
                <div v-if="path=='TWO_PATH'" key="two">
                    <el-table
                            :span-method="arraySpanMethod"
                            :data="alcoholResultForm.doubleResultList"
                            fit
                            stripe
                            border
                            size="mini"
                            style="width: 100%">
                        <el-table-column
                                prop="sample.sampleNo"
                                label="样本编号">
                        </el-table-column>
                        <el-table-column
                                prop="sample.sampleName"
                                label="样本名称">
                        </el-table-column>
                        <el-table-column
                                prop="sample.authPersonName"
                                label="被检人">
                        </el-table-column>
                        <el-table-column
                                prop="time"
                                label="测试次数">
                        </el-table-column>
                        <el-table-column
                                prop="content1"
                                label="通道A">
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'doubleResultList.' + scope.$index + '.content1'">
                                    <el-input size="mini" v-model="scope.row.content1"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="content2"
                                label="通道B">
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'doubleResultList.' + scope.$index + '.content2'">
                                    <el-input size="mini" v-model="scope.row.content2"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="平均值">
                            <template slot-scope="scope">
                                <span v-if="scope.row">{{scope.row.avg = getAverageValue(scope.row)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="相对相差（%）">
                            <template slot-scope="scope">
                                    <span v-if="scope.row">
                                        {{scope.row.rd = getRelativeDifference(scope.row.content1,scope.row.content2,getAverageValue(scope.row))}}
                                    </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="content"
                                label="总平均">
                            <template slot-scope="scope">
                                <span v-if="scope.row">{{scope.row.contentAll = getTotalAverageValue(scope.$index)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop=""
                                label="总相对相差">
                            <template slot-scope="scope">
                                <span v-if="scope.row">
                                    {{scope.row.relativeDifference = getTotalRelativeDifference(scope.$index)}}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </template>
        </Portlet>
        <Collapse title="酒精检测记录" :active="true" v-if="alcoholType === '0'">
        <template slot-scope="scope">
        <Portlet :title="sampleNo">
        <template slot="body">
        <el-table
        :data="alcoholResultForm.tertiaryButanolTable"
        fit
        stripe
        border
        size="mini"
        style="width: 100%">
        <el-table-column
        type="index"
        :index="indexMethod"
        label="编号">
        </el-table-column>
        <el-table-column
        prop="tertiaryButanol"
        label="叔丁醇">
        <template slot-scope="scope">
        <el-form-item
        :rules="$filter_rules({required:true})"
        label-width="0px"
        :prop="'tertiaryButanolTable.' + scope.$index + '.tertiaryButanol'">
        <el-input size="mini" v-model="scope.row.tertiaryButanol"></el-input>
        </el-form-item>
        </template>
        </el-table-column>
        <el-table-column
        prop="alcohol"
        label="乙醇">
        <template slot-scope="scope">
        <el-form-item
        :rules="$filter_rules({required:true})"
        label-width="0px"
        :prop="'tertiaryButanolTable.' + scope.$index + '.alcohol'">
        <el-input size="mini" v-model="scope.row.alcohol"></el-input>
        </el-form-item>
        </template>
        </el-table-column>
        <el-table-column
        label="乙醇/叔丁醇" prop="vx">
        <template slot-scope="scope">
        <span>{{getCompareVal(scope.row.alcohol,scope.row.tertiaryButanol,scope.$index)}}</span>
        </template>
        </el-table-column>
        <el-table-column
        prop="content"
        label="含量">
        <template slot-scope="scope">
        <span>{{getContent(scope.row.alcohol,scope.row.tertiaryButanol,scope.$index)}}</span>
        </template>
        </el-table-column>
        </el-table>
        <el-table
        :data="computedTable"
        fit
        stripe
        border
        size="mini"
        style="width: 100%;margin-top: 10px">
        <el-table-column
        prop="vy"
        label="y">
        </el-table-column>
        <el-table-column
        prop="vb"
        label="b">
        </el-table-column>
        <el-table-column
        prop="va"
        label="a">
        </el-table-column>
        <el-table-column
        prop="vr"
        label="r">
        </el-table-column>
        <el-table-column
        prop="uncertainty"
        label="不确定">
        </el-table-column>
        <el-table-column
        label="均值" prop="content">
        <!--<template slot-scope="scope" >-->
        <!--<span>{{getAverageContent()}}</span>-->
        <!--</template>-->
           <template slot-scope="scope">
               <span>{{tertiaryButanolAverageContent}}</span>
           </template>
        </el-table-column>
        <el-table-column
        label="RD">
        <template slot-scope="scope">
        <span>{{getRD1()}}</span>
        </template>
        </el-table-column>
        </el-table>
        </template>
        </Portlet>

        </template>
        </Collapse>
    </el-form>
</template>

<script>
    import Collapse from '@/page/layout/Collapse'
    import Portlet from '@/page/layout/Portlet'
    import api from '@/api/index'
    import BigDecimalUtils from "../../../utils/BigDecimalUtils";

    export default {
        name: "AlcoholResult",
        components: {'Collapse': Collapse, 'Portlet': Portlet},
        props: ['model', 'caseId', 'basicData'],
        data() {
            return {
                authRecordsMsg: null,
                path: 'ONE_PATH',
                spanArr: [],
                pos: '',
                computedTable: [{}],
                alcoholResultForm: this.model,
                alcoholType: 0,
                tertiaryButanolAverageContent:null,
                sampleNo:''
            }
        },
        methods: {
            indexMethod(index) {
                return index + 1;
            },
//酒精
            //拿到小数需要扩充的倍数
            getLength(a, b) {
                a=a+'';
                b=b+'';
                if (a && a.indexOf('.') > -1) {
                    var r1 = a.split(".")[1].length;
                } else {
                    r1 = 0;
                }
                if (b && b.indexOf('.') > -1) {
                    var r2 = b.split(".")[1].length;
                } else {
                    r2 = 0;
                }
                var m = Math.pow(10, Math.max(r1, r2));
                return m;
            },
            //获取需要合并的行
            getSpanArr(data) {
                this.spanArr = [];
                for (var i = 0; i < data.length; i++) {
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0;
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        if (data[i].id === data[i - 1].id) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            //合并行
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                var exceptColArr = [3, 4, 5, 6, 7];
                if (exceptColArr.indexOf(columnIndex) == -1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            //获取平均值
            getAverageValue(row) {//行间
                var a = row.content1;
                var b = row.content2;
                var val1 = a;
                var val2 = b;
                let arr = [];
                if (!val1) {
                    val1 = 0;
                }
                if (!val2) {
                    val2 = 0;
                }
                arr.push(val1);
                arr.push(val2);
                var value = BigDecimalUtils.getAvg(arr,2);
                row.content = value;
                return value;
            },
            getAverageValue1(a, b, point) {//非行间
                var val1 = a;
                var val2 = b;
                var arr = [];
                if (!val1) {
                    val1 = 0;
                }
                if (!val2) {
                    val2 = 0;
                }
                arr.push(val1);
                arr.push(val2);

                if(point) {
                    var value = BigDecimalUtils.getAvg(arr,point);
                    return value;
                }else {
                    var value = BigDecimalUtils.getAvg(arr,2);
                    return value;
                }

            },
            //获取相对相差
            getRelativeDifference(a, b, c) {
                var val1 = a;
                var val2 = b;
                if (!val1) {
                    val1 = 0;
                }
                if (!val2) {
                    val2 = 0;
                }

                return BigDecimalUtils.getRd(val1,val2,2);
            },
            toFixed(num, s) {
                //解决toFixed丢失精度问题
                var times = Math.pow(10, s);
                var des = num * times + 0.5;
                des = parseInt(des, 10) / times;
                return des + '';
            },
            //获取总平均
            getTotalAverageValue(index) {
                if ((index + 1) % 2 == 0) {
                    var a = this.getAverageValue(this.alcoholResultForm.doubleResultList[index]);
                    var b = this.getAverageValue(this.alcoholResultForm.doubleResultList[index - 1]);
                    var value = this.getAverageValue1(a, b);
                    return value;
                } else {
                    var a = this.getAverageValue(this.alcoholResultForm.doubleResultList[index]);
                    var b = this.getAverageValue(this.alcoholResultForm.doubleResultList[index + 1]);
                    var value = this.getAverageValue1(a, b);
                    return value;
                }
            },
            //获取总相对相差
            getTotalRelativeDifference(index) {
                if ((index + 1) % 2 == 0) {
                    var a = this.getAverageValue(this.alcoholResultForm.doubleResultList[index]);
                    var b = this.getAverageValue(this.alcoholResultForm.doubleResultList[index - 1]);
                    var value = this.getRelativeDifference(a, b, this.getAverageValue1(a, b));
                    return value;
                } else {
                    var a = this.getAverageValue(this.alcoholResultForm.doubleResultList[index]);
                    var b = this.getAverageValue(this.alcoholResultForm.doubleResultList[index + 1]);
                    var value = this.getRelativeDifference(a, b, this.getAverageValue1(a, b));
                    return value;
                }


            },
            //获取乙醇/叔丁醇
            getCompareVal(a, b, index) {

                /*var m = this.getLength(a, b);*/
                var val1 = a;
                var val2 = b;
                if (isNaN(Number(val1))) {
                    val1 = 0;
                }
                ;
                if (isNaN(Number(val2)) || Number(val2) == 0) {
                    return;
                }
                ;
                if(!a) {
                    a = 0;
                }
                if(!b) {
                    b = 0;
                }
                /*return ((Number(val1) * m / Number(val2) * m)).toFixed(2);*/
                let value = BigDecimalUtils.divide(a, b, 3);
                this.alcoholResultForm.tertiaryButanolTable[index].vx = value;
                return value;

            },
            //获取含量
            getContent(a, b, index) {
                var compareVal = this.getCompareVal(a, b, index);
                var arr = [].concat(this.computedTable);
                var va = arr[0].va;
                var vb = arr[0].vb;
                if(!va) {
                    return;
                }
                /*var m = this.getLength(va, vb);
                if (m <= 2) {
                    m = Math.pow(10, 2);
                }*/
                /*if (!isNaN(Number(compareVal))) {
                    var value = (Number(compareVal) * m - Number(va) * m) / (Number(vb) * m).toFixed(2);
                    this.alcoholResultForm.tertiaryButanolTable[index].content = value;
                    if (value < 1) {
                        return '<1.0';
                    } else {
                        return value;
                    }
                } else {
                    return;
                }*/

                if(!isNaN(Number(compareVal))) {
                    let content = BigDecimalUtils.getContent(compareVal, va, vb, 1);
                    this.alcoholResultForm.tertiaryButanolTable[index].content = content;
                    if (content < 1) {
                        content =  '<1.0';
                    }
                    this.getAverageContent();
                    return content;
                }else {
                    return;
                }

            },
            getAverageContent() {
                var a, b;
                if (this.alcoholResultForm.tertiaryButanolTable[0].content) {
                    a = this.alcoholResultForm.tertiaryButanolTable[0].content.toString();
                } else {
                    a = 0;
                }
                if (this.alcoholResultForm.tertiaryButanolTable[1].content) {
                    b = this.alcoholResultForm.tertiaryButanolTable[1].content.toString();
                } else {
                    b = 0;
                }
                var value = this.getAverageValue1(a, b);
                this.$set(this.computedTable[0],'content',value);
                this.tertiaryButanolAverageContent = value;
                return value;
            },
            getRD() {
                var a, b;
                if (this.alcoholResultForm.tertiaryButanolTable[0].content) {
                    a = this.alcoholResultForm.tertiaryButanolTable[0].content.toString();
                } else {
                    a = 0;
                }
                if (this.alcoholResultForm.tertiaryButanolTable[1].content) {
                    b = this.alcoholResultForm.tertiaryButanolTable[1].content.toString();
                } else {
                    b = 0;
                }
                ;
                var c = this.getAverageValue1(a, b);
                var value = this.getRelativeDifference(a, b, c);
                return value;
            },
            getRD1() {
                var a, b;
                if (this.alcoholResultForm.tertiaryButanolTable[0].content) {
                    a = this.alcoholResultForm.tertiaryButanolTable[0].content.toString();
                } else {
                    a = 0;
                }
                if (this.alcoholResultForm.tertiaryButanolTable[1].content) {
                    b = this.alcoholResultForm.tertiaryButanolTable[1].content.toString();
                } else {
                    b = 0;
                }
                ;
                var c = this.getAverageValue1(a, b);
                var value = this.getRelativeDifference1(a, b, c);
                this.$set(this.computedTable[0],'relativeDifference',value);
                if(value < 1) {
                    value = '<1.0';
                }
                return value;
            },
            //获取丁叔醇部分的相对相差
            getRelativeDifference1(a, b, c) {
                var val1 = a;
                var val2 = b;
                if (!val1) {
                    val1 = 0;
                }
                if (!val2) {
                    val2 = 0;
                }

                return BigDecimalUtils.getRd(val1,val2,3);
            },
            init(flag) {
                if (Object.keys(this.basicData).length > 0 && flag) {

                    this.alcoholType = this.basicData.inputContentFlag;
                    var arr = [].concat(this.basicData.authAlcoholResultList);
                    if(this.alcoholType === '0') {
                        this.sampleNo = this.basicData.authAlcoholResultList && this.basicData.authAlcoholResultList[0] && this.basicData.authAlcoholResultList[0].sample && this.basicData.authAlcoholResultList[0].sample.sampleNo;
                    };
                    if(flag && (this.basicData.authAlcoholResultList[0].tertiaryButanol1 === null || this.basicData.authAlcoholResultList[0].va === null)) {
                        this.$get(api.alcoholParam,{caseNoFlag: flag}).then(res => {
                            this.computedTable = res.data;
                            this.$emit('getComputedTable', this.computedTable);
                        }).catch(e => {
                            console.log(e)
                        })
                    }else {
                        this.computedTable = JSON.parse(JSON.stringify(this.basicData.authAlcoholResultList));
                        this.$emit('getComputedTable', this.computedTable);
                    }
                    //刚进入页面时判断是否是双通道
                    for(let i = 0; i < arr.length; i++) {
                        if (arr[i].content3 !== null) {
                            this.path = 'TWO_PATH';
                            this.isFirst = true; //是否第一次进来就是双通道
                            return;
                        } else {
                            this.path = 'ONE_PATH';
                        }
                    }

                }
            }
        },
        watch: {
            path: {
                handler(newVal, oldVal) {
                    if (newVal == 'TWO_PATH') {
                        var data = JSON.parse(JSON.stringify(this.basicData));
                        var arr = [].concat(data.authAlcoholResultList);
                        this.alcoholResultForm.doubleResultList = arr;
                        let doubleResultList = JSON.parse(JSON.stringify(this.alcoholResultForm.doubleResultList));
                        doubleResultList.forEach( (item, index) => {
                            this.alcoholResultForm.doubleResultList[2 * index].time = '第一次测试值（mg/100ml）';
                            var data = JSON.parse(JSON.stringify(item));
                            data.time = '第二次测试值（mg/100ml）';
                            data.content1 = data.content3;
                            data.content2 = data.content4;
                            data.content3 = null;
                            data.content4 = null;
                            this.alcoholResultForm.doubleResultList.splice(2 * index + 1 , 0, data); 
                        })
                        this.getSpanArr(this.alcoholResultForm.doubleResultList);
                    } else {
                        var data = JSON.parse(JSON.stringify(this.basicData));

                        var arr = [].concat(data.authAlcoholResultList);
                        this.alcoholResultForm.singleResultList = arr;

                    }
                    this.alcoholResultForm.singleResultList.forEach( item => {
                            item.content1 = null;
                            item.content2 = null;
                            item.content3 = null;
                            item.content4 = null;
                        })
                        if(!this.isFirst) {
                            this.alcoholResultForm.doubleResultList.forEach( item => {
                            item.content1 = null;
                            item.content2 = null;
                            item.content3 = null;
                            item.content4 = null;
                            })
                        }
                        this.isFirst = false;

                },
                /* immediate:true */
            },
            'model': {
                handler(newVal, oldVal) {
                    this.alcoholResultForm = newVal;
                },
                deep: true,
                immediate: true
            },
            alcoholResultForm: {
                handler(newVal, oldVal) {
                    this.$emit("update:model", newVal);
                },
                deep: true,
                immediate: true
            },
            caseNoFlag(newVal) {
                this.$get(api.alcoholParam,{caseNoFlag: newVal}).then(res => {
                }).catch(e => {
                    console.log(e)
                })
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style scoped>

</style>