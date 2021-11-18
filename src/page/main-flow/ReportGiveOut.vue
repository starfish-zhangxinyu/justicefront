<template>
    <div>
        <Portlet title="发放信息">
            <template slot="body">
                <el-form :model="giveOutForm" ref="giveOutForm" label-width="110px">
                    <el-row>
                        <el-col :span="13">
                            <el-form-item label="发放方式" prop="giveType"
                                          :rules="$filter_rules({required:true, trigger: 'change'})">
                                <select-from-enum
                                        :hasDefault="true"
                                        :model.sync="giveOutForm.giveType"
                                        type="ca.GiveType"></select-from-enum>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div v-if="giveOutForm.giveType&&giveOutForm.giveType.value=='SELF_PICK'">
                        <el-row>
                            <el-col :span="13">
                                <el-form-item label="领取凭证" prop="credentialList"
                                              :rules="$filter_rules({required:true})">
                                    <el-checkbox-group v-model="giveOutForm.credentialList">
                                        <el-checkbox label="CONTRACT">合同/合同副本</el-checkbox>
                                        <el-checkbox label="INVOICE">票据</el-checkbox>
                                        <el-checkbox label="ID_CARD">身份证</el-checkbox>
                                        <el-checkbox label="OTHER">其他</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5" v-if="giveOutForm.credentialList.indexOf('OTHER')>-1">
                                <el-form-item prop="otherCredentials" :rules="$filter_rules({required:true})"
                                              size="small" label-width="0px">
                                    <el-input v-model="giveOutForm.otherCredentials"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="领取人" prop="consignee" :rules="$filter_rules({required:true})"
                                              size="small">
                                    <el-input v-model="giveOutForm.consignee" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11" :offset="1">
                                <el-form-item label="发放日期" prop="giveDate" :rules="$filter_rules({required:true})"
                                              size="small">
                                    <el-date-picker
                                            size="small"
                                            v-model="giveOutForm.giveDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-if="giveOutForm.giveType&&giveOutForm.giveType.value=='SEND'">
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="送件人" prop="sendPerson"
                                              size="small">
                                    <el-input v-model="giveOutForm.sendPerson" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11" :offset="1">
                                <el-form-item label="送件日期" prop="sendDate"
                                              size="small">
                                    <el-date-picker
                                            size="small"
                                            v-model="giveOutForm.sendDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="领取人" prop="consignee" :rules="$filter_rules({required:true})"
                                              size="small">
                                    <el-input v-model="giveOutForm.consignee" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="11" :offset="1">
                                    <el-form-item label="送达地址" prop="sendAddress"
                                                  :rules="$filter_rules({required:true})"
                                                  size="small">
                                        <el-input v-model="giveOutForm.sendAddress" size="small"></el-input>
                                    </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="11">
                                <el-form-item label="发放日期" prop="giveDate" :rules="$filter_rules({required:true})"
                                            size="small">
                                    <el-date-picker
                                            size="small"
                                            v-model="giveOutForm.giveDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                            
                        
                    </div>
                    <div v-if="giveOutForm.giveType&&giveOutForm.giveType.value=='POST'">
                        <el-row>
                             <el-col :span="11">
                                    <el-form-item label="邮寄单位" prop="postUnit"
                                                  size="small">
                                        <el-input v-model="giveOutForm.postUnit" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                            <el-col :span="11" :offset="1">
                                <el-form-item label="收件人" prop="consignee"
                                              size="small">
                                    <el-input v-model="giveOutForm.consignee" size="small"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row>
                        <el-row>
                                <el-col :span="11">
                                    <el-form-item label="收件人电话" prop="postRecipientPhone"

                                                  size="small">
                                        <el-input v-model="giveOutForm.postRecipientPhone" size="small"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" :offset="1">
                                    <el-form-item label="发放日期" prop="giveDate" :rules="$filter_rules({required:true})"
                                                  size="small">
                                        <el-date-picker
                                                size="small"
                                                v-model="giveOutForm.giveDate"
                                                type="date"
                                                class="w100"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!-- <el-col :span="11" :offset="1">
                                <el-form-item label="发放日期" prop="giveDate" :rules="$filter_rules({required:true})"
                                              size="small">
                                    <el-date-picker
                                            size="small"
                                            v-model="giveOutForm.giveDate"
                                            type="date"
                                            format="yyyy 年 MM 月 dd 日"
                                            value-format="yyyy-MM-dd HH:mm:ss">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col> -->
                        </el-row>
                        <el-row>
                        <el-row>
                                <el-col :span="11">
                                    <el-form-item label="快递公司" prop="expressCompany"
                                                  :rules="$filter_rules({required:true})"
                                                  size="small">
                                        <select-from-dict :className="'w100'" :model.sync="giveOutForm.expressCompany"
                                                          data_type="express_company"></select-from-dict>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="11" :offset="1">
                                    <el-form-item label="快递单号" prop="expressNo"
                                                  :rules="$filter_rules({required:true})" size="small">
                                        <el-input v-model="giveOutForm.expressNo"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                           
                        </el-row>
                    </div>
                    <Collapse title="返还材料" :active="true" >


                        <template slot-scope="scope">

                            <el-button type="primary" size="mini"
                                             style="float: right;margin-right: 10px;margin-top: 6px" @click="importMaterialClick">导入
                            </el-button>

                            <el-table
                                    border
                                    size="small"
                                    :data="returnCaInspectionMaterials"
                                    style="width:100%">
                                <el-table-column prop="name" label="送检鉴定材料"></el-table-column>
                                <el-table-column prop="type.label" label="类型"></el-table-column>
                                <el-table-column prop="quantity" label="数量"></el-table-column>
                                <el-table-column prop="unit.label" label="规格"></el-table-column>
                                <el-table-column prop="acceptDate" label="接收时间">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.acceptDate">{{$divideDate(scope.row.acceptDate)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="property.label" label="材料性质"></el-table-column>
                                <el-table-column prop="handleType.label" label="处理方式"></el-table-column>
                                <el-table-column prop="submitMaterialPerson" label="送检人"></el-table-column>
                                <el-table-column prop="submitMaterialPhone" label="联系电话"></el-table-column>
                                <el-table-column prop="status.label" label="材料状态"></el-table-column>
                                <el-table-column prop="" label="文件及图片">
                                    <template slot-scope="scope" v-if="scope.row.images.length>0">
                                        <el-button type="primary" size="mini"
                                                   @click="imageDialog = true; imgs = scope.row.images">查看
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="操作"
                                        width="80%">
                                    <template slot-scope="scope">
                                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="backNoReturnStatus(scope.$index,scope.row)">
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </Collapse>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="其他发放材料"  prop="credentials">
                                <el-checkbox-group v-model="giveOutForm.otherGiveMaterials">
                                    <el-checkbox label="INVOICE">发票</el-checkbox>
                                    <el-checkbox label="OTHER">其他</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5" v-if="giveOutForm.otherGiveMaterials.indexOf('OTHER')>-1">
                            <el-form-item prop="otherMsg" size="small" :rules="$filter_rules({required:true})"
                                          label-width="0px">
                                <el-input v-model="giveOutForm.otherMsg"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-form-item prop="remarks" size="small" label="备注">
                                <el-input v-model="giveOutForm.remarks" type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
        </Portlet>
        <Portlet title="上传回执">
            <template slot="buttonGroup">
                <el-upload
                        style="float: right;margin-right: 10px;"
                        class="upload-demo"
                        action="#"
                        :multiple="true"
                        :on-change="handleChangeReceipt"
                        :show-file-list="false"
                        :file-list="receiptImages"
                        :auto-upload="false">
                    <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
                </el-upload>
                <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                           style="float: right;margin-right: 10px;margin-top: 11px" @click="">扫描
                </el-button> -->
                <Czur :isScan="true" style="float: right;margin-right: 10px;" :model.sync="receiptImages"></Czur>
            </template>
            <template slot="body">
                <PictureWall :model.sync="receiptImages" :has-title="false"></PictureWall>
            </template>
        </Portlet>
        <Portlet title="附件">
            <template slot="buttonGroup">
                <el-upload
                        style="float: right;margin-right: 10px;"
                        class="upload-demo"
                        action="#"
                        :multiple="true"
                        :on-change="handleChangeAccessory"
                        :auto-upload="false"
                        :show-file-list="false"
                        list-type="picture">
                    <el-button type="primary" icon="el-icon-plus" size="mini">上传</el-button>
                </el-upload>
                <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"
                           style="float: right;margin-right: 10px;margin-top: 11px" @click="">扫描
                </el-button> -->
                <Czur :isScan="true" style="float: right;margin-right: 10px;" :model.sync="annexImages"></Czur>
            </template>
            <template slot="body">
                <FileWall :model.sync="annexImages">
                </FileWall>
<!--                <PictureWall :model.sync="annexImages" :has-title="false"></PictureWall>-->
            </template>
        </Portlet>
        <el-row>
            <el-col :span="2" :offset="11">
                <el-button type="success" size="mini" class="save-btn" @click="save('giveOutForm')"><i
                        class="fa fa-save"></i> 保存
                </el-button>
            </el-col>
            <el-col :span="2">
                <el-button type="primary" size="mini" class="save-btn" @click="complete('giveOutForm')"><i
                        class="el-icon-arrow-left"></i> 完成
                </el-button>
            </el-col>
        </el-row>

        <el-dialog title="案件材料" :visible.sync="materialReturnDialog" width="40%">
            <el-table
                    border
                    size="small"
                    :data="giveOutForm.inspectionMaterial"
                    style="width:100%" @selection-change="importMaterialChange">
                <el-table-column
                        type="selection"
                        width="55"></el-table-column>
                <el-table-column prop="name" label="送检鉴定材料"></el-table-column>
                <el-table-column prop="type.label" label="类型"></el-table-column>
                <el-table-column prop="quantity" label="数量"></el-table-column>
                <el-table-column prop="unit.label" label="规格"></el-table-column>
                <el-table-column prop="acceptDate" label="接收时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.acceptDate">{{$divideDate(scope.row.acceptDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="property.label" label="材料性质"></el-table-column>
                <el-table-column prop="handleType.label" label="处理方式"></el-table-column>
                <el-table-column prop="submitMaterialPerson" label="送检人"></el-table-column>
                <el-table-column prop="submitMaterialPhone" label="联系电话"></el-table-column>
                <el-table-column prop="status.label" label="材料状态"></el-table-column>
                <el-table-column prop="" label="文件及图片">
                    <template slot-scope="scope" v-if="scope.row.images.length>0">
                        <el-button type="primary" size="mini"
                                   @click="imageDialog = true; imgs = scope.row.images">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="materialReturnDialog = false" size="small">取 消</el-button>
                <el-button type="primary" @click="importMaterial" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="图片"
                :visible.sync="imageDialog"
                width="30%"
                append-to-body>
                <span v-for="image in imgs">
                    <el-image
                            style="width: 146px; height: 146px"
                            :src="image.url"
                            fit="fill">
                    </el-image>
                    &nbsp;&nbsp;
                </span>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="imageDialog = false">取 消</el-button>
                        <el-button type="primary" @click="imageDialog = false">确 定</el-button>
                  </span>
        </el-dialog>
    </div>
</template>

<script>
    import api from "../../api/index";
    import Portlet from '../layout/Portlet'
    import Collapse from '../layout/Collapse'
    import PictureWall from '../../components/common/PictureWall'
    import FileWall from '../../components/common/FileWall'
    import Czur from '../../components/common/Czur'

    export default {
        name: "ReportGiveOut",
        components: {'Portlet': Portlet, 'PictureWall': PictureWall,'Collapse':Collapse,'FileWall':FileWall, Czur},
        data() {
            return {
                giveOutForm: {credentialList: [], otherGiveMaterials: [], inspectionMaterial: []},
                materialReturnDialog: false, //返还材料导入模态框
                importMaterialSelect: [],  //返还材料模态框选中id
                returnCaInspectionMaterials: [],  //当前案件中已返回的案件材料
                imageDialog: false,
                imgs: null,
                giveOpt: [],
                receiptImages: [],
                annexImages: []
            }
        },
        methods: {
            //选择上传回执文件
            handleChangeReceipt(file, fileList) {
                this.receiptImages = this.$isUploadImg(fileList);
            },
            //选择上传附件文件
            handleChangeAccessory(file, fileList) {
                var fileName = file.name;
                let fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length + 1);
                this.annexImages.push({fileType: fileType, raw: file.raw, name: fileName});
                // this.annexImages = this.$isUploadImg(fileList);
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.giveOutForm));
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                var imageArr = [];
                                data.receiptImages = [];
                                data.annexImages = [];
                                this.receiptImages.forEach((v, i) => {
                                    if (v.raw) {
                                        let p = new Promise((resolve, reject) => {
                                            let file = v.raw;
                                            let filename = file.name.substring(0, file.name.lastIndexOf('.'));
                                            let filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length + 1);
                                            lrz(file, {width: 1280}).then(function (rst) {
                                                let img = {'imageType': filetype, 'image': rst.base64};
                                                data.receiptImages.push(img);
                                                resolve();
                                            });
                                        });
                                        imageArr.push(p);
                                    } else {
                                        data.receiptImages.push(v);
                                    }

                                });
                                this.annexImages.forEach((v, i) => {
                                    if (v.raw) {
                                        if (v.fileType.toUpperCase() == 'JPG' || v.fileType.toUpperCase() == 'PNG') {
                                            let p = new Promise((resolve, reject) => {
                                                let file = v.raw;
                                                let filename = file.name.substring(0, file.name.lastIndexOf('.'));
                                                let filetype = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length + 1);
                                                lrz(file, {width: 1280}).then(function (rst) {
                                                    let img = {'name':filename,'imageType': filetype, 'image': rst.base64};
                                                    data.annexImages.push(img);
                                                    resolve();
                                                });
                                            });
                                            imageArr.push(p);
                                        }else {
                                            let p = new Promise((resolve, reject) => {
                                                this.$getBase64(v.raw).then(function (res) {
                                                    var index = v.name.lastIndexOf('.');
                                                    var fileName = v.name.substring(0, index);
                                                    let filetype = v.name.substring(v.name.lastIndexOf('.') + 1, v.name.length + 1);
                                                    let img = {'name':fileName,'imageType': filetype, 'image': res};
                                                    data.annexImages.push(img);
                                                    resolve();
                                                });
                                            });
                                            imageArr.push(p);
                                        }
                                    } else {
                                        data.annexImages.push(v);
                                    }

                                });
                                Promise.all(imageArr).then(res => {
                                    // if (data.otherGiveMaterials.length) {
                                       /* if (data.otherGiveMaterials.indexOf('INVOICE') == -1) {
                                            this.$message({
                                                message: '发票必选',
                                                type: 'warning'
                                            });
                                        } else {*/
                                    if (data.otherGiveMaterials.indexOf('INVOICE') != -1) {
                                        data.otherGiveMaterials = '发票' + ((this.giveOutForm.otherMsg == undefined || this.giveOutForm.otherMsg == '') ? '' : ',' + this.giveOutForm.otherMsg);
                                    }else if (data.otherGiveMaterials.indexOf('INVOICE') == -1) {
                                        data.otherGiveMaterials = ((this.giveOutForm.otherMsg == undefined || this.giveOutForm.otherMsg == '') ? '' : ',' + this.giveOutForm.otherMsg);
                                    }
                                    this.$put('/api/ca-give-info/v1/ca-give-infos/' + this.$route.query.caseId, data).then((res) => {
                                        if (res.status == 200) {
                                            this.$message({
                                                message: '保存成功！',
                                                type: 'success'
                                            });
                                            // this.annexImages = [];
                                            // this.receiptImages = [];
                            

                                        }
                                    }).catch((err) => {
                                        this.$message.error(err.errMsg)
                                    });
                                    // };
                                });
                            }
                        });
                    }
                });
            },
            importMaterialClick: function () {
                this.materialReturnDialog = true;
            },
            importMaterialChange(val) {
                this.importMaterialSelect = [].concat(val);
            },
            //查询已导入材料
            queryReturnMaterial: function (caseId) {
                this.$get(api.searchInspectMaterial + "/"+caseId).then(res => {
                    if (res.status == 200) {
                        var data = JSON.parse(JSON.stringify(res.data));
                        this.returnCaInspectionMaterials = data.inspectionMaterial;
                    }

                }).catch(err => {
                })
            },
            //保存导入材料状态
            importMaterial: function () {

                let data = [];
                let caseId = null;
                for (let item of this.importMaterialSelect) {
                    if (!caseId) {
                        caseId = item.caseId;
                    }
                    data.push({id: item.id, "isReturn": 1})
                }
                this.$post(api.inspectMaterial + "/isImport", data).then(res => {
                    if (res.data) {
                        this.$message({
                            message: '导入成功！',
                            type: 'success'
                        })
                        this.materialReturnDialog = false;
                        this.queryReturnMaterial(caseId)
                    }
                }).catch(err => {
                    this.$message({
                        message: '导入失败！',
                        type: 'error'
                    })
                })
            },
            backNoReturnStatus :function(index, row){
                let data = {
                    id: row.id, "isReturn": 0
                };
                this.$post(api.updateNoBackinspectMaterial, data).then(res => {
                    if (res.data) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        })
                        this.materialReturnDialog = false;
                        this.queryReturnMaterial(row.caseId)
                    }
                }).catch(err => {
                    this.$message({
                        message: '删除失败！',
                        type: 'error'
                    })
                })
            },
            complete(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = JSON.parse(JSON.stringify(this.giveOutForm));
                        this.$refs[formName].validate((valid) => {
                            if (valid) {
                                var imageArr = [];
                                data.receiptImages = [];
                                data.annexImages = [];
                                this.receiptImages.forEach((v, i) => {
                                    if (v.raw) {
                                        let p = new Promise((resolve, reject) => {
                                            let file = v.raw;
                                            let filename = file.name.substring(0, file.name.lastIndexOf('.'));
                                            let filetype = filename.substring(filename.lastIndexOf('.') + 1, filename.length + 1);
                                            lrz(file, {width: 1280}).then(function (rst) {
                                                let img = {'imageType': filetype, 'image': rst.base64};
                                                data.receiptImages.push(img);
                                                resolve();
                                            });
                                        });
                                        imageArr.push(p);
                                    } else {
                                        data.receiptImages.push(v);
                                    }

                                });
                                this.annexImages.forEach((v, i) => {
                                    if (v.raw) {
                                        if (v.fileType.toUpperCase() == 'JPG' || v.fileType.toUpperCase() == 'PNG') {
                                            let p = new Promise((resolve, reject) => {
                                                let file = v.raw;
                                                let filename = file.name.substring(0, file.name.lastIndexOf('.'));
                                                let filetype = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length + 1);
                                                lrz(file, {width: 1280}).then(function (rst) {
                                                    let img = {'name':filename,'imageType': filetype, 'image': rst.base64};
                                                    data.annexImages.push(img);
                                                    resolve();
                                                });
                                            });
                                            imageArr.push(p);
                                        }else {
                                            let p = new Promise((resolve, reject) => {
                                                this.$getBase64(v.raw).then(function (res) {
                                                    var index = v.name.lastIndexOf('.');
                                                    var fileName = v.name.substring(0, index);
                                                    let filetype = v.name.substring(v.name.lastIndexOf('.') + 1, v.name.length + 1);
                                                    let img = {'name':fileName,'imageType': filetype, 'image': res};
                                                    data.annexImages.push(img);
                                                    resolve();
                                                });
                                            });
                                            imageArr.push(p);
                                        }
                                    } else {
                                        data.annexImages.push(v);
                                    }

                                });
                                Promise.all(imageArr).then(res => {
                                    // if (data.otherGiveMaterials.length) {
                                    //     if (data.otherGiveMaterials.indexOf('INVOICE') == -1) {
                                    //         this.$message({
                                    //             message: '发票必选',
                                    //             type: 'warning'
                                    //         });
                                    //     } else {
                                    if (data.otherGiveMaterials.indexOf('INVOICE') != -1) {
                                        data.otherGiveMaterials = '发票' + ((this.giveOutForm.otherMsg == undefined || this.giveOutForm.otherMsg == '') ? '' : ',' + this.giveOutForm.otherMsg);
                                    }else if (data.otherGiveMaterials.indexOf('INVOICE') == -1) {
                                        data.otherGiveMaterials = ((this.giveOutForm.otherMsg == undefined || this.giveOutForm.otherMsg == '') ? '' : ',' + this.giveOutForm.otherMsg);
                                    }
                                    this.$put('/api/ca-give-info/v1/ca-give-infos/' + this.$route.query.caseId+'?procInsId='+this.$route.query.procInsId+'&taskId='+this.$route.query.taskId, data).then((res) => {
                                        if (res.status == 200) {
                                            this.$message({
                                                message: '已完成！',
                                                type: 'success'
                                            });
                                        this.$router.push('/home');

                                        }
                                    }).catch((err) => {
                                        this.$message.error(err.errMsg);
                                    });
                                    //     }
                                    // }
                                    // ;

                                });
                            }
                        });
                    }
                });
            }
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "报告发放")
            this.queryReturnMaterial(this.$route.query.caseId);
            this.$get('/api/ca-give-info/v1/ca-give-infos/details/' + this.$route.query.caseId).then((res) => {
                if (res.status == 200) {
                    if (res.data != null && res.data != '') {
                        var data = JSON.parse(JSON.stringify(res.data));
                        if (data.credentialList == null || data.credentialList.length == 0) {
                            data.credentialList = [];
                        } else {
                            data.credentialList = data.credentialList.map((v, i) => {
                                return v.value;
                            })
                        }
                        if (data.otherGiveMaterials == null || data.otherGiveMaterials == '') {
                            data.otherGiveMaterials = [];
                        } else {
                            var str = data.otherGiveMaterials;
                            if (str.indexOf('发票')!=-1 && str.length > 2) {

                                data.otherGiveMaterials = ['INVOICE', 'OTHER'];
                                data.otherMsg = str.substr(str.indexOf('发票') + 3, str.length);
                            } else if(str.indexOf('发票')!=-1 && str.length <= 2){
                                data.otherGiveMaterials = ['INVOICE'];
                            }else{
                                data.otherGiveMaterials = ['OTHER'];
                                data.otherMsg = str.substr(1, str.length);
                            }
                        }
                        this.giveOutForm = data;
                        this.receiptImages = data.receiptImages;
                        this.annexImages = data.annexImages.map((v, i) => {
                            var index = v.url.lastIndexOf('-')
                            var name = v.url.substring(index + 1);
                            var index2 = v.url.lastIndexOf('.');
                            var type = v.url.substring(index2 + 1);
                            return {fileType: type, name: name, url: v.url};
                        })
                    }
                }
            }).catch((err) => {
                // if(err){
                //     this.$message.error(err.errMsg);
                // }

            })
        }
    }
</script>

<style scoped>

</style>