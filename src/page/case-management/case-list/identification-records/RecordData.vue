<template>
    <div  v-if="this.inspectInfoTestRecord">
    <Portlet title="鉴定/检测记录">
        <template slot="buttonGroup">
            <el-button
                    style="float: right;margin-right: 10px;margin-top: 6px"
                    type="primary"
                    size="mini" @click="openAuthDataGroup">检验记录数据
            </el-button>
        </template>
        <template slot="body">
            <el-input
                    type="textarea"
                    :rows="5"
                    v-model="authRecord">
            </el-input>
        </template>
    </Portlet>
    <!--检测记录数据模态框-->
    <el-dialog title="检测记录数据类型" :visible.sync="outerVisible" width="65%">
        <el-dialog
                width="65%"
                title="内层 Dialog"
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
                <el-button type="primary" @click="saveRecordData ">保存</el-button>
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
    import Collapse from '../../../layout/Collapse'
    import Portlet from '../../../layout/Portlet'
    import api from '../../../../api/index'
    export default {
        name: "RecordData",
        components: {'Collapse': Collapse,'Portlet': Portlet},
        props: ['model', 'caseId','basicData','inspectInfoTestRecord'],
        data(){
            return{
                panClass: {
                    sm: {span: 12},
                    md: {span: 12},
                },
                textValue:'',
                outerVisible: false,
                innerVisible: false,
                recordDataType: null,//检测记录数据类型
                recordDataForm: {arr: []},//检测记录数据表单,
                authRecord:this.model
            }
        },
        methods:{
            openAuthDataGroup() {
                if (!this.recordDataType) {
                    this.$get(api.authData + '/group',
                        {
                            caseId: this.caseId,
                            professionCategoryId: '0258f97fd51e41c9ba9b984e8ad90313'
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
                this.$post(api.authData + '?caseId=' + this.caseId, this.recordDataForm.arr).then((res) => {
                    if (res.status == 200) {
                        this.innerVisible = false;
                        this.$message({type: 'success', message: '保存成功！',})
                        this.$get(api.authData + '/group',
                            {
                                caseId: this.$route.query.caseId,
                                professionCategoryId: '0258f97fd51e41c9ba9b984e8ad90313'
                            }).then((res) => {
                            this.recordDataType = res.data;
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
                    this.authRecord=newVal;
                },
                deep:true,
                immediate: true
            },
            authRecord: {
                handler(newVal, oldVal) {
                    this.$emit("update:model", newVal);
                },
                deep:true,
                immediate: true
            },
            'basicData':{
                handler(newVal,oldVal){
                    if(newVal&&newVal.authRecord){
                        var data = JSON.parse(JSON.stringify(this.basicData));
                        this.authRecord= data.authRecord;
                    }
                },
                immediate:true
            }
        },
    }
</script>

<style scoped>

</style>