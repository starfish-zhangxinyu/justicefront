<template>
    <el-form ref="form" label-width="0px" size="small" :model="acceptForm" class="demo-ruleForm">
        <Portlet title="检材样本" :isKey="true">
            <template slot="buttonGroup">
                <el-button type="primary" icon="el-icon-plus" size="mini"
                           style="float: right;margin-right: 10px;margin-top: 5px" @click="addCaSample()">增加
                </el-button>
            </template>
            <template slot="body">
                <el-table
                        :data="acceptForm.caSampleList"
                        id="rightBtnBox"
                        stripe
                        fit
                        border
                        size="mini"
                        style="width: 100%">
                    <el-table-column
                            prop="type"
                            width="200%"
                            label="类型">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.type'">
                                <select-from-dict :model.sync="scope.row.type"
                                                  data_type="ca_sample_type"></select-from-dict>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="sampleNo"
                            width="200%"
                            label="编号">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.sampleNo'">
                                <el-input v-model="scope.row.sampleNo" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="carrier"
                            width="200%"
                            label="载体"
                            v-if="basicMsg.professionCategory.type.value=='ACOUSTIC_IMAGE'">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.carrier'">
                                <el-input v-model="scope.row.carrier" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            width="200%">
                        <template slot="header">
                            <i style="color: red;margin-right: 5px">*</i><span>名称</span>
                        </template>
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.name'"
                                    :rules="$filter_rules({required:true})">
                                <el-input v-model="scope.row.name" size="small "
                                          @change="sampleNameChange(scope.$index,scope.row)"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="quantity"
                            width="200%"
                            label="数量">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.quantity'">
                                <el-input v-model="scope.row.quantity" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="brand"
                            width="200%"
                            label="品牌"
                            v-if="basicMsg.professionCategory.type.value=='ELECTRONIC'">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.brand'">
                                <el-input v-model="scope.row.brand" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="model"
                            width="200%"
                            label="型号/容量"
                            v-if="basicMsg.professionCategory.type.value=='ELECTRONIC'">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.model'">
                                <el-input v-model="scope.row.model" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="imeiSn"
                            width="200%"
                            label="IMEI/SN"
                            v-if="basicMsg.professionCategory.type.value=='ELECTRONIC'">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.imeiSn'">
                                <el-input v-model="scope.row.imeiSn" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="150%"
                            prop="unit"
                            label="规格"
                            v-if="basicMsg.professionCategory.type.value!='ELECTRONIC'">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.unit'">
                                <select-from-dict :model.sync="scope.row.unit"
                                                  data_type="unit_type"></select-from-dict>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="150%"
                            prop="property"
                            label="材料性质"
                            v-if="basicMsg.professionCategory.type.value!='ELECTRONIC'">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.property'">
                                <select-from-dict :model.sync="scope.row.property"
                                                  :has-default="true"
                                                  data_type="material_property"></select-from-dict>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="150%"
                            prop="appearanceStatus"
                            label="外观/状态">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.appearanceStatus'">
                                <select-from-dict :model.sync="scope.row.appearanceStatus"
                                                  data_type="appearance_status"></select-from-dict>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="150%"
                            prop="handleType"
                            label="处理方式">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.handleType'">
                                <select-from-dict :model.sync="scope.row.handleType"
                                                  :has-default="true"
                                                  data_type="handle_type"></select-from-dict>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="acceptDate"
                            width="200%"
                            label="接收时间">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.acceptDate'">
                                <el-date-picker
                                        style="width: 100%"
                                        v-model="scope.row.acceptDate"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="submitMaterialPerson"
                            width="200%"
                            label="送检人">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.submitMaterialPerson'">
                                <el-input v-model="scope.row.submitMaterialPerson" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="submitMaterialPhone"
                            width="200%"
                            label="送检人电话">
                        <template slot-scope="scope">
                            <el-form-item
                                    :prop="'caSampleList.' + scope.$index + '.submitMaterialPhone'">
                                <el-input v-model="scope.row.submitMaterialPhone" size="small"></el-input>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作" width="200px" fixed="right" align="center">
                        <template slot-scope="scope">
                            <Uploadpictures :appendToBody="true" :model.sync="scope.row.images" :multiple="true"></Uploadpictures>
                            <!-- <el-button type="primary" icon="el-icon-camera-solid" size="mini"></el-button> -->
                            <Czur :model.sync="scope.row.images"></Czur>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                       @click="deleteRow(scope.$index,scope.row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
        </Portlet>

    </el-form>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex'; //先要引入
    import Portlet from '../../layout/Portlet'
    import api from '../../../api/index'
    import Uploadpictures from '../../../components/common/Uploadpictures'
    import Czur from '../../../components/common/Czur'

    export default {
        name: "CaSample",
        components: {'Portlet': Portlet, 'Uploadpictures': Uploadpictures, Czur},
        data() {
            return {}
        },
        methods: {
            //增加检材样本
            addCaSample() {
                this.acceptForm.caSampleList.push({status: 'NORMAL'});
            },
            //样本名称变化
            sampleNameChange(index, row) {
                if (row.oldName) {
                    var entrustingMatterList = [].concat(this.entrustingAuth.entrustingMatterList)
                    if (entrustingMatterList.length) {
                        entrustingMatterList.forEach((v, i) => {
                            if (v.entrustingMatterTargetList.length) {
                                v.entrustingMatterTargetList.forEach((value, inx) => {
                                    if (value.name == row.oldName) {
                                        this.$store.commit('register/changeMatterTargetList',
                                            {
                                                index1: i,
                                                index2: inx,
                                                value: {name: row.name, type: 'CA_SAMPLE'}
                                            }
                                        );
                                    }
                                })
                            }
                        });
                    }
                }
                row.oldName = row.name;
            },
            deleteRow(index, row) {
                this.acceptForm.caSampleList.splice(index, 1);
                if (row.oldName) {
                    var entrustingMatterList = [].concat(this.entrustingAuth.entrustingMatterList)
                    if (entrustingMatterList.length) {
                        entrustingMatterList.forEach((v, i) => {
                            if (v.entrustingMatterTargetList.length) {
                                v.entrustingMatterTargetList.forEach((value, inx) => {
                                    if (value.name == row.oldName) {
                                        this.$store.commit('register/deleteMatterTargetList',
                                            {index1: i, index2: inx}
                                        );
                                    }
                                })
                            }
                        });
                    }
                }
            },
        },
        computed: {
            ...mapState('register', {
                AcceptField: 'acceptField',
                acceptForm: 'caSampleMsg',
                basicMsg: 'basicMsg',
                entrustingAuth: 'entrustingAuthItem'
            }),
        },
         updated(){
            if(document.querySelector('#rightBtnBox') && this.acceptForm.caSampleList.length > 0){
                let box = document.querySelector('#rightBtnBox .el-table__fixed-right');
                box.style.height = (this.acceptForm.caSampleList.length * 47) + 36 + 'px';
            }
        }
    }
</script>

<style scoped>

</style>