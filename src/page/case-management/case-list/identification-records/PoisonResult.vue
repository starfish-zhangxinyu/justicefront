<template>
    <el-form ref="form"
             label-width="130px"
             size="small"
             :model="poisonForm"
             class="demo-ruleForm"
             label-position="right" v-if="this.poisonTestResult">
        <Portlet title="毒物检验结果">
            <template slot="buttonGroup">
                <el-button type="primary" size="mini" style="float: right;margin-right: 10px;margin-top: 6px">
                    导入实验结果
                </el-button>
            </template>
            <template slot="body">
                <el-table
                        :span-method="arraySpanMethod"
                        :data="poisonForm.poSampleResultList"
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
                        <template slot="header" slot-scope="{ column, $index }">
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

                </el-table>

            </template>
        </Portlet>

    </el-form>
</template>

<script>
    import Portlet from '../../../layout/Portlet'
    import api from '../../../../api/index'

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
            }
        },
        methods: {
//合并行
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                var exceptColArr = [0, 1];
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
                this.poisonForm.poSampleResultList = data.poSampleResultList;
                this.getSpanArr(data.poSampleResultList);
            }

        }
    }
</script>

<style scoped>

</style>