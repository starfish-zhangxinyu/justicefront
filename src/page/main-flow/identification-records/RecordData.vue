<template>
    <div v-if="this.inspectInfoTestRecord">
        <Portlet title="鉴定/检测记录">
            <template slot="buttonGroup" v-if="professionCategoryType=='GENERAL'">
                <el-button
                        style="float: right;margin-right: 10px;margin-top: 6px"
                        type="primary"
                        size="mini" @click="openAuthDataGroup">检验记录数据
                </el-button>
            </template>
            <template slot="body">
                <el-input
                        id="input"
                        type="textarea"
                        :rows="5"
                        v-model="authRecord"
                        contenteditable="true">
                </el-input>
            </template>
        </Portlet>
        <!--检验记录数据模态框-->
        <el-dialog title="检验记录数据类型" :visible.sync="outerVisible" width="65%">
            <el-dialog
                    width="65%"
                    title="检验记录数据"
                    :visible.sync="innerVisible"
                    append-to-body>
                <el-form ref="recordDataForm"
                         label-width="240px"
                         size="small"
                         :model="recordDataForm"
                         class="demo-ruleForm" label-position="right">
                    <el-row>
                        <el-col :sm="panClass.sm" :md="panClass.md" v-for="(v,i) in recordDataForm.arr" :key="i">
                            <el-form-item :label="getLabel(v.authDataItem)">
                                <el-input v-model="v.value" size="mini"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRecordData" :disabled="saveDisabledBtn">保存</el-button>
                </div>
            </el-dialog>
            <el-row>
                <el-col style="margin: 10px 0;text-align: center"
                        :md="{span:6}"
                        v-for="(v,i) in recordDataType" :key="i">
                    <el-button
                            style="width: 180px"
                            @click="getRecordData(v,i)"
                            :type="!v.flag?'primary':'success'"
                            size="small">{{v.name}}
                    </el-button>
                </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Collapse from '../../layout/Collapse'
    import Portlet from '../../layout/Portlet'
    import api from '../../../api/index'

    export default {
        name: "RecordData",
        components: {'Collapse': Collapse, 'Portlet': Portlet},
        props: ['model', 'caseId', 'basicData', 'inspectInfoTestRecord'],
        data() {
            return {
                panClass: {
                    sm: {span: 12},
                    md: {span: 12},
                },
                textValue: '',
                outerVisible: false,
                innerVisible: false,
                recordDataType: null,//检测记录数据类型
                recordDataForm: {arr: []},//检测记录数据表单,
                authRecord: this.model,
                professionCategoryType: '',
                professionCategoryId: '',
                saveDisabledBtn: false,
            }
        },
        methods: {
            openAuthDataGroup() {
                if (!this.recordDataType) {
                    this.$get(api.authData + '/group',
                        {
                            caseId: this.caseId,
                            professionCategoryId: this.professionCategoryId
                        }).then((res) => {
                        this.recordDataType = res.data;
                        this.outerVisible = true;
                    }).catch((err) => {
                        console.log(err)
                    });
                } else {
                    this.outerVisible = true;
                }
            },
            getLabel(item) {
                if (item.authDataItemUnit) {
                    return item.name + '(' + item.authDataItemUnit.label + ')';
                } else {
                    return item.name;
                }
            },
            getRecordData(value, index) {
                var data = {caseId: this.caseId};
                data.authDataItemGroupId = value.id;
                this.$get(api.authData, data).then((res) => {
                    this.recordDataForm.arr = res.data;
                    this.innerVisible = true;
                }).catch((err) => {
                    console.log(err)
                });
            },
            saveRecordData() {
                this.saveDisabledBtn = true;
                var that = this;
                setTimeout(function () {
                    that.saveDisabledBtn = false;
                }, 3000);
                that.$post(api.authData + '?caseId=' + that.caseId, that.recordDataForm.arr).then((res) => {
                    if (res.status == 200) {
                        that.innerVisible = false;
                        that.$message({type: 'success', message: '保存成功！',})
                        that.$get(api.authData + '/group',
                            {
                                caseId: that.$route.query.caseId,
                                professionCategoryId: that.professionCategoryId,
                            }).then((res) => {
                            that.recordDataType = res.data;
                        }).catch((err) => {
                            console.log(err)
                        });
                    }

                }).catch((err) => {
                    console.log(err)
                });
            },
        },
        watch: {
            'model': {
                handler(newVal, oldVal) {
                    this.authRecord = newVal;
                },
                deep: true,
                immediate: true
            },
            authRecord: {
                handler(newVal, oldVal) {
                    this.$emit("update:model", newVal);
                },
                deep: true,
                immediate: true
            },
            'basicData': {
                handler(newVal, oldVal) {
                    if (newVal) {
                        var data = JSON.parse(JSON.stringify(this.basicData));
                        if (data.professionCategory) {
                            this.professionCategoryId = data.professionCategory.id;
                            if (data.professionCategory.type && data.professionCategory.type.value) {
                                this.professionCategoryType = data.professionCategory.type.value;
                            }
                        }
                        if (newVal.authRecord) {
                            this.authRecord = data.authRecord;
                        }
                    }
                },
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>