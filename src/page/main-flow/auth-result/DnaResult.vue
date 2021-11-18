<template>
    <div>
        <el-form ref="form" label-width="130px" size="small" :model="dnaResultForm" class="demo-ruleForm"
                 label-position="right">
            <Portlet title="DNA检验结果">
                <!--<template slot="buttonGroup">
                    <el-button type="primary" size="mini" style="float: right;margin-right: 10px;margin-top: 6px"
                               @click="importResult">
                        导入实验结果
                    </el-button>
                </template>-->
                <template slot="body">
                    <el-table
                            :span-method="arraySpanMethod"
                            :data="dnaResultForm.dnaResultDtoList"
                            :row-class-name="tableRowJudgeResultColor"
                            fit
                            border
                            size="mini"
                            style="width: 100%">
                        <el-table-column
                                prop="sendTestCountProportion"
                                label="送检数/已检数">
                        </el-table-column>
                        <el-table-column
                                prop="analyzeMethod"
                                label="分析方法">
                        </el-table-column>
                        <el-table-column
                                prop="createDate"
                                label="导入结果时间">
                        </el-table-column>
                        <el-table-column
                                prop="judgeResult"
                                label="结果">
                            <template slot-scope="scope">
                                <div v-if="scope.row.judgeResult && scope.row.judgeResult !='无'">
                                    <span>不符合点位数{{scope.row.mutationCount}}个,{{scope.row.entrustingMatterName}}结果{{scope.row.judgeResult}}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="操作" align="center" width="280px">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="confirmResult(scope.$index,scope.row)">
                                    确认实验结果
                                </el-button>
                                <el-button type="primary" size="small" @click="historyResult(scope.$index,scope.row)">
                                    历史实验结果
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </Portlet>
        </el-form>
        <!--确认实验结果-->
        <el-dialog title="基因座详情记录" :visible.sync="codisDetailDialog" width="80%">
            <el-form :model="codisForm" size="small" label-width="0px">
                <el-table :data="codisForm.dnaCalcDtoList" fit border size="small" style="width: 100%"
                          :header-cell-style="discountHeaderStyle">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column property="markerName" label="基因座"></el-table-column>
                    <el-table-column v-for="(item,i) in tableHead" :label="item" align="center" :key="item.id">
                        <el-table-column property="name">
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'dnaCalcDtoList.' + scope.$index +'.dnaSampleDtoList.'+i+ '.dnaTestResultDto.allele1'"
                                        v-if="scope.row.dnaSampleDtoList[i].dnaTestResultDto">
                                    <el-input v-model="scope.row.dnaSampleDtoList[i].dnaTestResultDto.allele1"
                                              size="small"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="name">
                            <template slot-scope="scope">
                                <el-form-item
                                        :rules="$filter_rules({required:true})"
                                        label-width="0px"
                                        :prop="'dnaCalcDtoList.' + scope.$index +'.dnaSampleDtoList.'+i+ '.dnaTestResultDto.allele2'"
                                        v-if="scope.row.dnaSampleDtoList[i].dnaTestResultDto">
                                    <el-input v-model="scope.row.dnaSampleDtoList[i].dnaTestResultDto.allele2"
                                              size="small"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table-column>

                    <el-table-column property="calcResult" :label="dnaResultName"
                                     v-if="codisForm.entrustingMatterKey!='NOCALCULATE'">
                        <template slot-scope="scope">
                            <div v-html="$replaceSupTag(scope.row.calcResultString)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column property="formula" label="公式" v-if="codisForm.entrustingMatterKey!='NOCALCULATE'">
                        <template slot-scope="scope">
                            <div v-html="$replaceSubTag(scope.row.formula)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column property="address" label="操作" align="center" width="100px">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" icon="el-icon-delete"
                                       @click="deleteRow(scope.$index,scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="margin-top: 10px" v-if="codisForm.entrustingMatterKey!='NOCALCULATE'">
                    <el-col :span="4" style="margin-top: 5px">
                        <div style="width:100%;height: 50px;">
                            <span>{{'累计'+dnaResultName+'：'}}
                            </span>
                            <span style="color: red" v-html="$replaceSupTag(codisForm.totalCalcResultSting)">
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="检测结果" prop="judgeResult" label-width="100px">
                            <el-select v-model="codisForm.judgeResult" placeholder="请选择">
                                <el-option label="肯定" value="肯定"></el-option>
                                <el-option label="否定" value="否定"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="基因突变" prop="mutationCount" label-width="140px">
                            <el-select v-model="codisForm.mutation" placeholder="请选择">
                                <el-option label="存在" value="Y"></el-option>
                                <el-option label="不存在" value="N"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="1" :offset="6">
                        <el-button type="primary" size="mini" icon="el-icon-s-operation" @click="handleRecount">重新计算
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" ref="codisDetailFooter">
                <el-button @click="codisDetailDialog = false" size="mini" type="primary">取 消</el-button>
                <el-button type="primary" size="mini" @click="saveResult">保存</el-button>
            </div>
        </el-dialog>
        <!--导入实验结果记录表-->
        <el-dialog title="导入实验结果记录表" :visible.sync="importResultDialog" width="40%">
            <el-form :model="importResultForm" size="small" label-width="120px" label-position="right"
                     ref="importResultForm">
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item
                                label="基因频率类型"
                                :rules="$filter_rules({required:true})"
                                prop="frequencyTypeId">
                            <select-from-dict
                                    :model.sync="importResultForm.frequencyTypeId"
                                    data_type="dna_frequency_type" :model-id="true"></select-from-dict>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item
                                label="试剂盒"
                                :rules="$filter_rules({required:true})"
                                prop="kitId">
                            <select-form-kit
                                    :model.sync="importResultForm.kitId"
                                    :modelId="true">
                            </select-form-kit>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" :offset="6">
                        <el-form-item
                                label="文件路径"
                                :rules="$filter_rules({required:true})">
                            <el-upload
                                    class="upload-demo"
                                    action="#"
                                    :on-change="handleChange"
                                    :auto-upload="false"
                                    :show-file-list="false"
                                    accept=".dat,.txt,.excel">
                                <el-button type="primary" size="mini" style="margin-bottom: 10px;"
                                           @click="importResult">选择文件
                                </el-button>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!--<div slot="footer" class="dialog-footer">-->
            <!--<el-button @click="importResultDialog = false" size="mini" type="primary">取 消</el-button>-->
            <!--<el-button type="primary" @click="importResultDialog = false" size="mini">保存</el-button>-->
            <!--</div>-->
        </el-dialog>
        <!--历史实验结果信息-->
        <el-dialog title="历史实验结果信息" :visible.sync="historyResultDialog" width="80%">
            <el-button size="mini" type="primary" style="margin-bottom: 10px" @click="mergeLoca">合并基因座</el-button>
            <el-table :data="historyResultList" fit border size="small" style="width: 100%" @select-all="handleMerge"
                      @select="handleMerge " :row-class-name="tableRowJudgeResultColor">
                <el-table-column
                        type="selection" width="55px">
                </el-table-column>
                <el-table-column prop="dnaTestDto.kitName" label="试剂盒"></el-table-column>
                <el-table-column prop="frequencyTypeName" label="基因频率类型"></el-table-column>
                <el-table-column prop="createBy.hrStaff.name" label="导入结果人"></el-table-column>
                <el-table-column prop="indexValue" label="导入结果时间">
                    <template slot-scope="scope">
                        {{scope.row.createDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="totalCalcResultSting" :label="'累计'+dnaResultName">
                    <template slot-scope="scope">
                        <div v-html="$replaceSupTag(scope.row.totalCalcResultSting)"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="judgeResult" label="检测结果"></el-table-column>
                <el-table-column prop="indexValue" label="操作" align="center" width="230px">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="checkRow(scope.row)">查看</el-button>
                        <el-button type="primary" size="mini" @click="setResult(scope.row)">设置为实验结果</el-button>
                    </template>
                </el-table-column>

            </el-table>
            <div ref="ResultDialog" slot="footer"></div>
        </el-dialog>

        <!--基因座详情记录-->
        <el-dialog title="基因座详情记录" :visible.sync="codisDetailDialog1" width="80%">
            <el-form :model="codisForm" size="small" label-width="0px">
                <el-table :data="codisForm.dnaCalcDtoList" fit border size="small" style="width: 100%"
                          :header-cell-style="discountHeaderStyle">
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column property="markerName" label="基因座"></el-table-column>
                    <el-table-column v-for="(item,i) in tableHead" :label="item" align="center" :key="item.id">
                        <el-table-column property="name">
                            <template slot-scope="scope">
                                <span v-if="scope.row.dnaSampleDtoList[i].dnaTestResultDto">
                                    {{scope.row.dnaSampleDtoList[i].dnaTestResultDto.allele1}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column property="name">
                            <template slot-scope="scope">
                                <span v-if="scope.row.dnaSampleDtoList[i].dnaTestResultDto">
                                    {{scope.row.dnaSampleDtoList[i].dnaTestResultDto.allele2}}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column property="calcResult" :label="dnaResultName"
                                     v-if="codisForm.entrustingMatterKey!='NOCALCULATE'">
                        <template slot-scope="scope">
                            <div v-html="$replaceSupTag(scope.row.calcResultString)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column property="formula" label="公式" v-if="codisForm.entrustingMatterKey!='NOCALCULATE'">
                        <template slot-scope="scope">
                            <div v-html="$replaceSubTag(scope.row.formula)"></div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="margin-top: 10px;line-height:20px;" v-if="codisForm.entrustingMatterKey!='NOCALCULATE'">
                    <el-col :span="6" style="margin-top: 5px">
                        <div style="width:100%;">
                            <span  style="height:30px;line-height:30px;float:left">
                            {{'累计'+dnaResultName+'：'}} 
                            </span>
                            <span style="color: red;height:30px;line-height:30px;float:left"
                            :style="{marginTop:codisForm.totalCalcResultSting && codisForm.totalCalcResultSting.includes('sup') ? '-5px':'0'}"
                            v-html="$replaceSupTag(codisForm.totalCalcResultSting)">
                            </span>
                        </div>
                    </el-col>
                    <el-col :span="6" style="margin-top: 5px">
                        <div style="height:30px;line-height:30px;">
                            检测结果：{{codisForm.judgeResult}}
                        </div>
                    </el-col>
                    <el-col :span="6" style="margin-top: 5px">
                        <div  style="height:30px;line-height:30px;">
                            基因突变：{{codisForm.mutation=='Y'?'存在':(codisForm.mutation=='N'?'不存在':'')}}
                        </div>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="codisDetailDialog1 = false" size="mini" type="primary">取 消</el-button>
                <el-button type="primary" size="mini" @click="codisDetailDialog1 = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Collapse from '@/page/layout/Collapse'
    import Portlet from '@/page/layout/Portlet'
    import api from '@/api/index'

    export default {
        name: "DnaResult",
        components: {'Collapse': Collapse, 'Portlet': Portlet},
        props: ['model', 'caseId', 'basicData'],
        data() {
            return {
                dnaResultForm: {dnaResultDtoList: []},
                importResultDialog: false,//导入实验结果模态框
                importResultForm: {},//导入实验结果表单
                codisForm: {dnaCalcDtoList: []},//确认实验结果
                codisDetailDialog: false,//基因座详情记录模态框
                deleteStr: '',//删除的基因座的名称字符串
                tableHead: [],
                dnaResultName: '',

                historyResultDialog: false,//历史实验结果信息模态框
                historyResultList: [],
                mergeLocaArr: [],

                codisDetailDialog1: false,//基因座详情

                completeDetectionArr: [],

                spanArr: [],
                pos: '',
            }
        },
        methods: {
            //合并行
            arraySpanMethod({row, column, rowIndex, columnIndex}) {
                if (columnIndex == 0) {
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
                        if (data[i].caseId === data[i - 1].caseId) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }
                    }
                }
            },
            init() {
                this.$get('/api/dna-codis/v1/dna-result/'+this.basicData.caseId).then((res) => {
                    this.dnaResultForm.dnaResultDtoList = [].concat(res.data);
                    this.getSpanArr(this.dnaResultForm.dnaResultDtoList);
                }).catch((err) => {
                    console.log(err)
                });
            },
            //确认实验结果
            confirmResult(index, row) {
                this.deleteStr = '';
                this.tableHead = [];
                this.$get(api.currentCodis + '/' + row.id).then((res) => {
                    if (res.data) {
                        this.dnaResultName = res.data.dnaResultName;
                        var arr = [].concat(res.data.dnaCalcDtoList);
                        arr[0].dnaSampleDtoList.forEach((v, i) => {
                            this.tableHead.push(v.sampleNo);
                        });
                        var data = JSON.parse(JSON.stringify(res.data));
                        if (!data.judgeResult) {
                            data.judgeResult = '肯定';
                        }
                        if (!data.mutation) {
                            data.mutation = 'Y'
                        }
                        this.codisForm = data;
                        this.$refs.codisDetailFooter.setAttribute('index', index);
                        this.codisDetailDialog = true;
                    } else {
                        this.$message.error('样本未能完成结果的计算！');
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            deleteRow(index, row) {
                this.$confirmBox('确定删除吗?').then((res) => {
                    this.deleteStr += row.markerName + ',';
                    this.codisForm.dnaCalcDtoList.splice(index, 1);
                });
            },
            //重新计算
            handleRecount() {
                var dnaTestResultIdAlleleArrStr = '';
                var arr = [].concat(this.codisForm.dnaCalcDtoList);
                arr.forEach((v, i) => {
                    v.dnaSampleDtoList.forEach((item, index) => {
                        var dto = item.dnaTestResultDto;
                        dnaTestResultIdAlleleArrStr += dto.id + ':' + dto.allele1 + ',' + dto.allele2 + '|';
                    })
                });
                dnaTestResultIdAlleleArrStr = dnaTestResultIdAlleleArrStr.substr(0, dnaTestResultIdAlleleArrStr.length - 1);
                var json = {};
                json.dnaTestResultIdAlleleArrStr = dnaTestResultIdAlleleArrStr;
                json.dnaResultId = this.codisForm.id;
                json.frequencyTypeId = this.codisForm.frequencyTypeId;
                json.kitId = this.codisForm.kitId;
                this.$post(api.recount, json).then((res) => {
                    var data = JSON.parse(JSON.stringify(res.data));
                    if (!data.judgeResult) {
                        data.judgeResult = '肯定';
                    }
                    if (!data.mutation) {
                        data.mutation = 'Y'
                    }
                    this.codisForm = data;
                    if (res.status == 200) {
                        this.$message({
                            message: '已重新计算！',
                            type: 'success'
                        });
                    }

                }).catch((err) => {
                    console.log(err, '错误')
                });
            },
            //保存
            saveResult() {
                var data = {dnaResultId: '', deleteMarkerName: '', judgeResult: '', mutation: ''};
                data.dnaResultId = this.codisForm.id;
                data.deleteMarkerName = this.deleteStr.substr(0, this.deleteStr.length - 1);
                data.judgeResult = this.codisForm.judgeResult;
                data.mutation = this.codisForm.mutation;
                data.entrustingMatterKey = this.codisForm.entrustingMatterKey;
                this.$post(api.dnaResult, data).then((res) => {
                    this.$message({
                        message: '保存成功!',
                        type: 'success'
                    });
                    this.init();
                    this.codisDetailDialog = false;
                }).catch((err) => {
                    console.log(err)
                })

            },
            //历史实验结果
            historyResult(index, row) {
                this.$refs.ResultDialog.setAttribute('index', index);
                this.$post(api.historyCodis, {entrustingMatterId: row.entrustingMatterId}).then((res) => {
                    if (res.data.length>0){
                        this.dnaResultName = res.data[0].dnaResultName;
                    }
                    this.historyResultList = res.data;
                    this.historyResultDialog = true;
                }).catch((err) => {
                    console.log(err)
                });
            },
            //设置实验结果
            setResult(row) {
                var data = {};
                data.entrustingMatterId = row.entrustingMatterId;
                data.id = row.id;
                data.caseId = row.caseId;
                this.$post(api.updateCodis, data).then((res) => {
                    if (res.status == 200) {
                        this.$message({
                            message: '设置成功!',
                            type: 'success'
                        });
                        this.historyResultDialog = false;
                        this.init();
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            //选择需要合并的基因座
            handleMerge(selection) {
                this.mergeLocaArr = [];
                this.mergeLocaArr = [].concat(selection);
            },
            //合并基因座
            mergeLoca() {
                var index = this.$refs.ResultDialog.getAttribute('index');
                var data = [];
                var frequencyTypeId ='';
                var frequencyTypeSame =true;
                this.mergeLocaArr.forEach((v, i) => {
                    if (i==0){
                        frequencyTypeId = v.frequencyTypeId;
                    }
                    if (this.mergeLocaArr[i].frequencyTypeId != frequencyTypeId) {
                        frequencyTypeSame = false;
                    }
                    data.push(v.id);
                });
                if (!frequencyTypeSame) {
                    this.$message.error("基因频率类型不同，不能合并！");
                    return;
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在合并，请稍后...',
                    spinner: 'el-icon-loading',
                });
                this.$post(api.mergeCodis, data).then((res) => {
                    loading.close();
                    if (res.status == 200) {
                        this.$message({
                            message: '合并成功!',
                            type: 'success'
                        });
                        this.$post(api.historyCodis, {entrustingMatterId: this.historyResultList[index].entrustingMatterId}).then((res) => {
                            this.dnaResultName = res.data[0].dnaResultName;
                            this.historyResultList = res.data;
                        }).catch((err) => {
                            console.log(err)
                        });
                        this.init();
                    }
                }).catch((err) => {
                    loading.close();
                    console.log(err)
                })

            },
            //查看历史实验结果中每条数据的详情
            checkRow(row) {
                this.tableHead = [];
                this.$get(api.currentCodis + '/' + row.id).then((res) => {
                    if (res.data) {
                        this.dnaResultName = res.data.dnaResultName;
                        var arr = [].concat(res.data.dnaCalcDtoList);
                        arr[0].dnaSampleDtoList.forEach((v, i) => {
                            this.tableHead.push(v.sampleNo);
                        });
                        var data = JSON.parse(JSON.stringify(res.data));
                        this.codisForm = data;
                        this.codisDetailDialog1 = true;
                    } else {
                        this.$message.error('样本未能完成结果的计算！');
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },

            importResult() {
                this.importResultDialog = true;
            },
            //导入文件发生变化
            handleChange(file, fileList) {
                this.$refs.importResultForm.validate((valid) => {
                    if (valid) {
                        var fileName = file.name;
                        var data = JSON.parse(JSON.stringify(this.importResultForm));
                        data.fileType = fileName.substring(fileName.indexOf('.') + 1, fileName.length + 1);
                        this.$getBase64(file.raw).then((res) => {
                            data.fileBase64 = res;
                            this.$post(api.importCodis, data).then((res) => {
                                if (res.status == 200) {
                                    this.$message({
                                        message: '导入成功！',
                                        type: 'success'
                                    });
                                    this.importResultDialog = false;
                                }
                            }).catch((err) => {
                                this.$message.error('导入失败！');
                                this.importResultDialog = false;
                                console.log(err)
                            });
                        }).catch((err) => {
                            console.log(err)
                        });
                    }
                });
            },
            discountHeaderStyle({row, column, rowIndex, columnIndex}) {
                if (rowIndex == 1) {
                    return {display: 'none'}
                }
            },
            tableRowJudgeResultColor({row}){
                if (row.judgeResult =='肯定') {
                    return 'affirm-row';
                } else if (row.judgeResult == '否定') {
                    return 'negate-row';
                }else if (row.judgeResult == '无'){
                    return 'without-row';
                }
            }

        },
        created() {
            if (this.basicData) {
                var data = JSON.parse(JSON.stringify(this.basicData));
                this.dnaResultForm.dnaResultDtoList = data.dnaResultDtoList;
                this.getSpanArr(data.dnaResultDtoList);
            }
        }
    }
</script>

<style scoped>
    .el-table .negate-row {
        background: #ffa106;
    }

    .el-table .affirm-row {
        background: #938bff;
    }

    .el-table .without-row {
        background: #89db89;
    }
</style>