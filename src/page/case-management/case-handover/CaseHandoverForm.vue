<template>
    <div>
        <PageBar title1="案件管理" title2="案件交接"></PageBar>
        <Portlet :title="portletTitle">
            <template slot="body">
                <el-form  :model="addForm" size="small" ref="reportChangeForm" label-width="130px">
                    <el-row>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="启动人" prop="name" :rules="$filter_rules({required:true})">
                                <el-input v-model="addForm.remarks" ></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="启动类型" prop="sort" :rules="$filter_rules({required:true})">
                                <select-from-dict
                                        className="multiple-select"
                                        :model.sync="addForm.complaintType"
                                        data_type="complaint_type"
                                        :modelId="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="被变动人" prop="name" :rules="$filter_rules({required:true})">
                                <el-input v-model="addForm.remarks" ></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :lg="{span:16,offset:4}">
                            <el-form-item label="变动事由" prop="sort" :rules="$filter_rules({required:true})">
                                <select-from-dict
                                        className="multiple-select"
                                        :model.sync="addForm.complaintType"
                                        data_type="complaint_type"
                                        :modelId="true"></select-from-dict>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-button type="primary"  size="small" >清单导出</el-button>
                <Table
                        :data.sync="tableData"
                        port="">
                    <template solt>
                        <el-table-column
                                prop="name"
                                label="专业类别">
                        </el-table-column>

                        <el-table-column
                                prop="name"
                                label="案件编号">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="委托方">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="鉴定对象">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="鉴定助理">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="第一鉴定人">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="案件状态">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="案件流程角色">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="纸质材料移交">
                            <template slot="scope">
                                <el-button type="text">编辑</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="拟接收人">
                        </el-table-column>

                    </template>
                </Table>
                <el-row><el-col :span="2"  :offset="10">
                    <el-button type="success" size="mini" class="save-btn" @click="save"><i class="fa fa-save"></i>保存</el-button>
                </el-col>
                    <el-col :span="2">
                        <el-button type="primary" size="mini" class="save-btn" ><i
                                class="el-icon-arrow-left"></i> 返回
                        </el-button>
                    </el-col>
                </el-row>
            </template>
        </Portlet>
    </div>
</template>

<script>
    import api from '../../../api/index'
    import portlet from './../../layout/Portlet'
    export default {
        name: "CaseHandoverForm",
        components:{'Portlet':portlet},
        data(){
            return{
                addForm:{},
                portletTitle:'案件交接申请',
                tableData:[],
                tablesort:null,
                searchdata:{},
            }
        },
        methods:{
            save(){

            }
        }
    }
</script>

<style scoped>

</style>