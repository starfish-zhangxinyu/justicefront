<template>
    <!--动态字段-->
    <Collapse :active="true" title="其他" v-if="acceptForm.caSysDynamicFieldValueList&&acceptForm.caSysDynamicFieldValueList.length">
        <el-form ref="form" label-width="130px" size="small" :model="acceptForm" class="demo-ruleForm"
                 label-position="right">
            <el-row>
                <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl" :key="i" v-for="(item,i) in acceptForm.caSysDynamicFieldValueList">
                    <el-form-item :label="item.sysDynamicField.label" :prop="'caSysDynamicFieldValueList.' + i + '.value'">
                        <!--文本输入框-->
                        <el-input v-model="item.value" size="mini" class="w100"
                                  v-if="item.sysDynamicField.inputType.value=='TEXT'"></el-input>
                        <!--多行文本输入框-->
                        <el-input v-model="item.value" size="mini" class="w100"
                                  v-if="item.sysDynamicField.inputType.value=='TEXTAREA'" type="textarea"></el-input>
                        <!--单选框-->

                        <Radio :model.sync="item.value" v-if="item.sysDynamicField.inputType.value=='RADIO'"
                               :type="item.sysDynamicField.populateValues"
                               :options="item.sysDynamicField.populateValues"
                               :from="item.sysDynamicField.populateType.value"></Radio>

                        <!--复选框-->
                        <Checkbox :model.sync="item.value" v-if="item.sysDynamicField.inputType.value=='CHECKBOX'"
                                  :type="item.sysDynamicField.populateValues"
                                  :options="item.sysDynamicField.populateValues"
                                  :from="item.sysDynamicField.populateType.value"></Checkbox>
                        <!--下拉选项框-->
                        <div v-if="item.sysDynamicField.inputType.value=='SELECT'||item.sysDynamicField.inputType.value=='SELECT_MULTI'">
                            <!--枚举SYS_ENUM  CUSTOM_ENUM-->
                            <!--自定义枚举-->
                            <el-select
                                    size="small"
                                    class="w100"
                                    v-model="item.value" placeholder="请选择"
                                    v-if="item.sysDynamicField.populateType.value=='CUSTOM_ENUM'"
                                    :multiple="item.sysDynamicField.inputType.value=='SELECT_MULTI'">
                                <el-option label="" value="" v-if="item.sysDynamicField.addSelectBlank"></el-option>
                                <el-option
                                        v-for="obj in strToJson(item.sysDynamicField.populateValues)"
                                        :key="obj.value"
                                        :label="obj.label"
                                        :value="obj.value">
                                </el-option>
                            </el-select>

                            <!--系统枚举-->
                            <select-from-enum
                                    className="w100"
                                    :model-val="true"
                                    v-if="item.sysDynamicField.populateType.value=='SYS_ENUM'"
                                    :multiple="item.sysDynamicField.inputType.value=='SELECT_MULTI'"
                                    :model.sync="item.value"
                                    :type="item.sysDynamicField.populateValues">
                                <template>
                                    <el-option label="" value=""
                                               v-if="item.sysDynamicField.addSelectBlank"></el-option>
                                </template>
                            </select-from-enum>

                            <!--字典表-->
                            <select-from-dict
                                    className="multiple-select w100"
                                    :model.sync="item.value"
                                    :model-id="true"
                                    v-if="item.sysDynamicField.populateType.value=='DICT'&&item.sysDynamicField.addSelectBlank"
                                    :multiple="item.sysDynamicField.inputType.value=='SELECT_MULTI'"
                                    :data_type="item.sysDynamicField.populateValues">
                                <template slot-scope="scope">
                                    <el-option label="" value=""></el-option>
                                </template>
                            </select-from-dict>
                            <select-from-dict
                                    className="multiple-select w100"
                                    :model-id="true"
                                    :model.sync="item.value"
                                    v-if="item.sysDynamicField.populateType.value=='DICT'&&!item.sysDynamicField.addSelectBlank"
                                    :multiple="item.sysDynamicField.inputType.value=='SELECT_MULTI'"
                                    :data_type="item.sysDynamicField.populateValues">
                            </select-from-dict>
                        </div>
                        <!--日期选择器-->
                        <el-date-picker
                                class="w100"
                                v-if="item.sysDynamicField.inputType.value=='DATE'"
                                v-model="item.value"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </Collapse>
</template>

<script>
    import Collapse from '../../page/layout/Collapse'
    import Radio from './Radio'
    import Checkbox from './Checkbox'
    import api from '../../api/index'
    import {mapState, mapGetters, mapActions} from 'vuex'; //先要引入
    export default {
        name: "Dynamicfield",
        props: ['model'],
        components: {'Collapse': Collapse, 'Radio': Radio, 'Checkbox': Checkbox},
        data() {
            return {
                panClass: {
                    sm: {span: 12},
                    md: {span: 8},
                    xl: {span: 6, offset: 1}
                },
                acceptForm: this.model,
            }
        },
        methods: {
        },
        watch: {

            acceptForm: {
                handler(newVal, oldVal) {
                    if (newVal) {
                        this.$emit("update:model", newVal);
                    }
                },
                immediate: true,
                deep:true
            },
            'model': {
                handler(newVal, oldVal) {
                    if (newVal) {
                        this.acceptForm = newVal;
                    }
                },
                immediate: true,
                deep:true
            }
        },
        created(){
        }

    }
</script>

<style scoped>

</style>