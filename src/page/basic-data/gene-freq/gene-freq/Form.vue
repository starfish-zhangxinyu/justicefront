<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基因频率列表" name="list"></el-tab-pane>
        <el-tab-pane label="基因频率详情" name="form">
            <span>名称：{{frequencyTypeLabel}}</span>
            <el-form :model="searchForm" size="small" ref="searchForm" label-width="160px" style="margin-top: 10px"
                     :inline="true">
                <el-form-item label="基因座">
                    <el-input type="text" v-model="searchForm.dnaLocus"></el-input>
                </el-form-item>
                <el-form-item label="等位基因">
                    <el-input type="text" v-model="searchForm.allele"></el-input>
                </el-form-item>

                <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
            </el-form>

            <el-form :model="formData" ref="formData" :rules="rules" v-if="allLocus.length">
                <el-table
                        fit
                        stripe
                        border
                        size="mini"
                        :data="formData.tableData"
                        :max-height="tableHeight"
                        ref="freqTable">
                    <!--<el-table-column
                            label="Allele">
                        <template slot-scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.allele'" :rules="rules.fAllele">
                                <el-input v-model="scope.row.allele" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column v-for="locus in allLocus" :key="locus.id" :label="locus.name">
                        <template slot-scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.frequency'" :rules="rules.frequency" v-if="scope.row.dnaLocus.name != null && scope.row.dnaLocus.name == locus.name">
                                <el-input v-model="scope.row.frequency" size="small">
                                </el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>-->
                    <el-table-column label="Allele" width="100px">
                        <template slot-scope="scope">
                            <el-form-item :prop="'tableData.' + scope.$index + '.keyName'" :rules="rules.fAllele" >
                                <el-input v-model="scope.row.keyName" size="small" ></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>

                    <el-table-column v-for="locus in allLocus" :key="locus.id" :label="locus.name" width="100px">
                        <template slot-scope="scope">
                            <span v-for="(item, index) in scope.row.list">
                                <el-form-item :prop="'tableData.' + scope.$index + '.list[' + index  + ']' + '.frequency'"
                                              :rules="rules.frequency"
                                              v-if="item.dnaLocus.name != null && item.dnaLocus.name == locus.name" >
                                    <el-input v-model="item.frequency" size="small">
                                    </el-input>
                                </el-form-item>
                            </span>
                        </template>
                    </el-table-column>

                </el-table>

            </el-form>
            <el-row>
                <el-col :span="2" :offset="11">
                    <el-button type="success" size="mini" class="save-btn" @click="save('formData')"><i
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
</template>

<script>
    import api from '../../../../api'

    export default {
        name: "Form",
        data() {
            let validateAllele = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error('请填写！'));
                } else {
                    callback();
                }
            }
            let validateFrequency = (rule, value, callback) => {
                if (value !== '') {
                    if ((/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/).test(value) == false) {
                        callback(new Error("大于0的数字"));
                    } else {
                        callback();
                    }
                } else {
                    callback(new Error("不能为空！"));
                }
            };
            return {
                tableHeight: '600px',
                activeName: 'form',
                searchForm: {
                    geneFrequencyTypeId: '',
                    dnaLocus: '',
                    allele: ''
                },
                frequencyTypeLabel: '',
                formData: {
                    tableData: [{
                        allele: '',
                        frequency: null
                    }]
                },
                allLocus: [],
                rules: {
                    fAllele: [
                        {validator: validateAllele, required: true, trigger: 'blur'}
                    ],
                    frequency: [
                        {validator: validateFrequency, required: false, trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let list = this.formData.tableData.map(item => {
                            item.list.forEach(it => {
                                it.allele = item.keyName;
                            })
                            return item.list;
                        })
                        let dataList = [];
                        list.forEach(item => {
                            dataList = dataList.concat(item);
                        })
                        this.$put(api.geneFreq, dataList).then((res) => {
                            if (res.status == 200) {
                                this.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                this.init();
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
            },
            search() {
                this.init();
            },
            init() {
                this.activeName = 'form';
                if (this.$route.query.id) {
                    this.searchForm.geneFrequencyTypeId = this.$route.query.id;
                    this.frequencyTypeLabel = this.$route.query.frequencyTypeLabel;
                }
                this.$get(api.geneFreq + '/detail', this.searchForm).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    this.formData.tableData = data;
                    this.$get(api.dnaKit + "/locus").then((res) => {
                        this.allLocus = res.data;
                    })
                })

            }
        },
        created() {
            this.init();
        },
        watch: {
            activeName: function (newval, oldval) {
                if (newval == 'list') {
                    this.$router.push({path: '/gene-freq/list'}).catch(err => {
                        console.log(err)
                    });
                }
            }
        },
        mounted() {
            //this.tableHeight = window.innerHeight - this.$refs['formData'].$el.offsetTop - 300;
        }

    }
</script>

<style lang="stylus" scoped>

</style>