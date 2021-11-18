<template>
    <el-dialog title="时效延长" width="960px" :visible.sync="TimeExtendDia">
        <Collapse title="时限延长历史记录" :active="true">
            <template slot-scope="scope">
                <el-table border :data="tableData" style="width: 100%">
                    <el-table-column prop="createDate" label="操作时间" min-width="110%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.createDate">{{$divideDate(scope.row.createDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="oldDeadline" label="原计划完成时间" min-width="110%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.oldDeadline">{{$divideDate(scope.row.oldDeadline)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="newDeadline" label="现计划完成时间" min-width="110%">
                        <template slot-scope="scope">
                            <span v-if="scope.row.newDeadline">{{$divideDate(scope.row.newDeadline)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="延长原因" prop="delayReason" width="180"/>
                    <el-table-column label="附件">
                        <template slot-scope="scope">
                            <el-link
                                    v-for="(item,i) in scope.row.attachments"
                                    :key="i"
                                    :href="item"
                                    target="_blank"
                            >附件{{i + 1}}
                            </el-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    v-if="scope.$index === tableData.length - 1"
                                    type="danger"
                                    @click="del(scope.$index, scope.row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </Collapse>
        <Collapse title="时限延长" :active="true">
            <template slot-scope="scope">
                <el-form :model="addForm" size="small" ref="TimeExtendForm" label-width="120px">
                    <el-row>
                        <el-col :lg="{ span: 12, offset: 6 }">
                            <el-form-item
                                    label="计划完成时间"
                                    prop="newDeadline"
                                    :rules="$filter_rules({ required: true })"
                            >
                                <el-date-picker
                                        class="w100"
                                        v-model="addForm.newDeadline"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 12, offset: 6 }">
                            <el-form-item
                                    label="延长理由"
                                    prop="delayReason"
                                    :rules="$filter_rules({ required: true })"
                            >
                                <select-from-dict className="w100" :model.sync="addForm.delayReason"
                                                  data_type="case_delay_reason"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :lg="{ span: 12, offset: 6 }">
                            <el-form-item label="附件">
                                <UploadFile :model.sync="fileList" :appendToBody="true" :multiple="true"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </Collapse>

        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel" size="small">取 消</el-button>
            <el-button type="primary" :disabled="disabledBtn" @click="submit('TimeExtendForm')" size="small">保 存
            </el-button>
        </div>
    </el-dialog>
</template>
<!-- 案件时效延长 -->
<script>
    import Collapse from "@/page/layout/Collapse";
    import api from "@/api/index";
    import UploadFile from "@/components/common/UploadFile.vue"

    export default {
        name: "",
        data() {
            return {
                addForm: {},
                tableData: [],
                TimeExtendDia: false,
                fileList: [],
                disabledBtn: false
            };
        },
        methods: {
            init(item) {
                this.addForm.caseId = item.id;
                this.getData();
                this.TimeExtendDia = true;
                this.fileList = [];
                this.templateFileName = '';
            },
            getData() {
                let {caseId} = this.addForm;
                this.$get(api.caDelaysApi + "/" + caseId)
                    .then(({data}) => {
                        this.tableData = data;
                    })
                    .catch(err => console.log(err));
            },
            cancel() {
                this.TimeExtendDia = false;
            },
            fromReg(formName) {
                return new Promise((resolve, reject) => {
                    this.$refs[formName].validate(valid => {
                        resolve(valid);
                    });
                });
            },
            async submit(formName) {
                this.disabledBtn = true;
                var _this = this;
                setTimeout(() => {
                    _this.disabledBtn = false;
                }, 2000);
                let {$message, getData, fileList, addForm} = _this;
                let submitFiles = [];
                let valid = await _this.fromReg(formName);
                if (!valid) return;
                if (fileList.length > 0) {
                    for (let i = 0; i < _this.fileList.length; i++) {
                        submitFiles.push({
                            fileType: "ATTACHMENT",
                            base64Str: await _this.$getBase64(this.fileList[i].raw)
                        });
                    }
                }
                if (typeof addForm.delayReason == "object" && addForm.delayReason.label) {
                    addForm.delayReason = addForm.delayReason.label
                }
                Object.assign(addForm, {submitFiles: submitFiles});
                _this.$post(api.caDelaysApi, addForm)
                    .then(res => {
                        if (res.status == 200) {
                            $message.success("时限延长成功");
                            getData();
                            _this.addForm = {caseId: addForm.caseId};
                            _this.fileList = [];
                            _this.$refs[formName].resetFields();
                        } else {
                            $message.error("操作失败");
                        }
                    })
                    .catch(err => {
                        $message.error(err.errMsg);
                        console.log(err);
                    });
            },
            del(i, v) {
                this.$confirmBox("确定删除该时限延长记录吗?").then(res => {
                    let {$message, getData} = this;
                    this.$del(api.caDelaysApi + "/" + v.id)
                        .then(res => {
                            if (res.status === 200) {
                                $message.success("删除成功!");
                                getData();
                            } else {
                                $message.error("删除失败!");
                            }
                        }).catch(err => console.log(err));
                }).catch(err => {
                });
            },
        },
        components: {
            Collapse,
            UploadFile
        }
    };
</script>

<style lang="less" scoped></style>
