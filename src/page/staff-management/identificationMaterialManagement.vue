<template>
    <div>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="鉴定材料基础信息列表" name="trainPlan">
                <div>
                    <el-tabs type="border-card" v-model="activeName2">
                        <el-tab-pane label="鉴定材料基础信息列表" name="trainPlan2">
                            <div class="search-box" style="overflow: hidden">
                                <!--@keyup.enter.native="search"-->
                                <el-form :model="searchForm" size="small" :inline="true" label-width="100px">
                                    <el-form-item label="鉴定材料名称">
                                        <el-input v-model="searchForm.name" class="w215"/>
                                    </el-form-item>
                                    <el-form-item label="专业类别">
                                        <el-input v-model="searchForm.name" class="w215"/>
                                    </el-form-item>
                                    <el-button type="primary" icon="el-icon-search" size="small"
                                               style="color: white" @click="edit()">查询
                                    </el-button>
                                </el-form>
                            </div>
                            <Table
                                    :search="searchForm"
                                    port="trainPlan"
                                    :data.sync="searchData"
                            >
                                <el-table-column prop="type" label="鉴定材料名称">
                                </el-table-column>
                                <el-table-column prop="type" label="类型">
                                </el-table-column>
                                <el-table-column prop="type" label="材料性质">
                                </el-table-column>
                                <el-table-column prop="type" label="规格">
                                </el-table-column>
                                <el-table-column prop="type" label="处理方式">
                                </el-table-column>
                                <el-table-column prop="type" label="专业类别">
                                </el-table-column>
                                <el-table-column prop="type" label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                                   @click="edit(scope.$index,scope.row)"></el-button>
                                        <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                                   @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
                                    </template>
                                </el-table-column>
                            </Table>
                        </el-tab-pane>
                        <!--:label="isAdd?'添加员工':'修改员工信息'"-->
                        <el-tab-pane label="鉴定资料管理列表" name="addlist/changelist">
                        </el-tab-pane>
                        <el-tab-pane label="检材样本管理列表" name="planStatistics">
                            <el-dialog :visible.sync="yearRecordDialog">
                                <Table>
                                    <el-table-column prop="type" label="姓名">
                                    </el-table-column>
                                    <el-table-column prop="type" label="质量控制项目开展日期">
                                    </el-table-column>
                                    <el-table-column prop="type" label="质量控制项目">
                                    </el-table-column>
                                    <el-table-column prop="type" label="质量控制工作描述">
                                    </el-table-column>
                                </Table>
                                <span slot="footer" class="dialog-footer">
                        <el-button @click="yearRecordDialog = false">取 消</el-button>
                        <el-button type="primary" @click="yearRecordDialog = false">确 定</el-button>
                    </span>
                            </el-dialog>
                        </el-tab-pane>
                        <div class="search-box" style="overflow: hidden" v-if="activeName2 !== 'trainPlan2'">
                            <!--@keyup.enter.native="search"-->
                            <el-form :model="searchForm" size="small" :inline="true" label-width="100px">
                                <el-form-item label="编号">
                                    <el-input v-model="searchForm.name" class="w215"/>
                                </el-form-item>
                                <el-button type="primary" icon="el-icon-search" size="small"
                                           style="color: white" @click="edit()">查询
                                </el-button>
                                <el-button type="primary" icon="el-icon-search" size="small"
                                           style="color: white" @click="openCountDiag = true">打开余量/流转状态弹窗
                                </el-button>
                                <el-button type="primary" icon="el-icon-search" size="small"
                                           style="color: white" @click="operateDiag = true">打开操作框
                                </el-button>
                            </el-form>
                        </div>
                        <div class="content">
                                <el-menu
                                        default-active="2"
                                        class="el-menu-vertical-demo"
                                        @open="handleOpen"
                                        @close="handleClose"
                                        background-color="#eee"
                                        style="width:15%;">
                                    <div style="margin:10px;width:100%;text-align:center;">专业类别</div>
                                    <el-menu-item index="1">
                                        <!--<i class="el-icon-document"></i>-->
                                        <span slot="title">导航1</span>
                                    </el-menu-item>
                                    <el-menu-item index="2">
                                        <!--<i class="el-icon-document"></i>-->
                                        <span slot="title">导航2</span>
                                    </el-menu-item>
                                    <el-menu-item index="3">
                                        <!--<i class="el-icon-document"></i>-->
                                        <span slot="title">导航3</span>
                                    </el-menu-item>
                                    <!--<el-submenu index="1">
                                        <template slot="title">
                                            <i class="el-icon-location"></i>
                                            <span>导航一</span>
                                        </template>
                                       &lt;!&ndash; <el-menu-item-group>
                                            &lt;!&ndash;<template slot="title">分组一</template>&ndash;&gt;
                                            <el-menu-item index="1-1">选项1</el-menu-item>
                                            <el-menu-item index="1-2">选项2</el-menu-item>
                                        </el-menu-item-group>&ndash;&gt;
                                    </el-submenu>-->
                                </el-menu>


                                <Table
                                        :search="searchForm"
                                        port="trainPlan"
                                        :data.sync="searchData"
                                        v-if="activeName2 !== 'trainPlan2'"
                                        style="width:70%"
                                >
                                    <el-table-column prop="type" label="编号">
                                    </el-table-column>
                                    <el-table-column prop="type" label="名称">
                                    </el-table-column>
                                    <el-table-column prop="type" label="数量">
                                    </el-table-column>
                                    <el-table-column prop="type" label="规格">
                                    </el-table-column>
                                    <el-table-column prop="type" label="材料性质">
                                    </el-table-column>
                                    <el-table-column prop="type" label="外观/状态">
                                    </el-table-column>
                                    <el-table-column prop="type" label="处理方式">
                                    </el-table-column>
                                    <el-table-column prop="type" label="接受时间">
                                    </el-table-column>
                                    <el-table-column prop="type" label="送检人">
                                    </el-table-column>
                                    <el-table-column prop="type" label="联系电话">
                                        <template>
                                            <span @click="openCountDiag = true"></span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="type" label="余量">
                                    </el-table-column>
                                    <el-table-column prop="type" label="流转状态">
                                    </el-table-column>
                                    <el-table-column prop="type" label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="warning" plain icon="el-icon-edit" size="mini"
                                                       @click="edit(scope.$index,scope.row)"></el-button>
                                            <el-button type="danger" plain icon="el-icon-delete" size="mini"
                                                       @click.native.prevent="deleteRow(scope.$index, scope.row)"></el-button>
                                        </template>
                                    </el-table-column>
                                </Table>
                        </div>


                        <el-dialog :visible.sync="openCountDiag" title="余量/流转状态">
                            <Table>
                                <el-table-column prop="type" label="操作人">
                                </el-table-column>
                                <el-table-column prop="type" label="操作时间">
                                </el-table-column>
                                <el-table-column prop="type" label="流转状态">
                                </el-table-column>
                                <el-table-column prop="type" label="操作前余量">
                                </el-table-column>
                                <el-table-column prop="type" label="余量">
                                </el-table-column>
                            </Table>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="yearRecordDialog = false">取 消</el-button>
                                <el-button type="primary" @click="yearRecordDialog = false">确 定</el-button>
                            </span>
                        </el-dialog>
                        <el-dialog :visible.sync="operateDiag" width="30%">
                            <el-form :model="searchForm" size="small"  label-width="100px">
                                <el-form-item label="是否默认" :rules="$filter_rules({required:true})">
                                    <el-select v-model="apartment" placeholder="请选择" clearable>
                                        <el-option
                                                v-for="item in options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="yearRecordDialog = false">取 消</el-button>
                                <el-button type="primary" @click="yearRecordDialog = false">确 定</el-button>
                            </span>
                        </el-dialog>
                    </el-tabs>
                </div>

            </el-tab-pane>
            <!--:label="isAdd?'添加员工':'修改员工信息'"-->
            <el-tab-pane label="鉴定材料添加/编辑" name="'addlist/changelist1">
                <div class="portlet">
                    <div class="portlet-header title-bgcolor">
                        <span><!--质量控制计划--></span>
                    </div>
                    <div class="portlet-body">
                        <el-form :model="searchForm" size="small"  label-width="100px">
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="鉴定材料名称" :rules="$filter_rules({required:true})">
                                        <el-select v-model="apartment" placeholder="请选择" clearable>
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="鉴定材料类别">
                                        <el-input v-model="searchForm.name"/>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="专业类别" :rules="$filter_rules({required:true})">
                                        <el-input type="textarea" v-model="searchForm.name"/>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="材料性质" :rules="$filter_rules({required:true})">
                                        <el-date-picker
                                                class="w100"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="规格" :rules="$filter_rules({required:true})">
                                        <el-date-picker
                                                class="w100"
                                                type="date"
                                                placeholder="选择日期"
                                                format="yyyy 年 MM 月 dd 日"
                                                value-format="yyyy-MM-dd HH:mm:ss">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form-item label="处理方式" :rules="$filter_rules({required:true})">
                                        <el-input   v-model="searchForm.name" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :lg="{span:16}">
                                    <el-form :model="searchForm" size="small"  label-width="100px">
                                    <el-form-item label="是否默认" :rules="$filter_rules({required:true})">
                                        <el-select v-model="apartment" placeholder="请选择" clearable>
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    </el-form>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import Table from '../../components/common/Table'
    export default {
        name: "trainPlanManagement.vue",
        data() {
            return {
                searchForm: {

                },
                activeName: 'trainPlan',
                trainingRecordDialog: false,
                yearRecordDialog: false,
                apartment:'参培部门',
                activeName2:'trainPlan2',
                openCountDiag: false,
                operateDiag: false
            }
        },
        methods: {
            edit() {
                this.trainingRecordDialog = true;
            },
            save() {
                //保存数据
            },
            back() {
                this.$router.go(-1);
            },
            count() {
                //统计
            }


        },
        components: {
            'Table': Table
        },
        created() {
            this.$store.dispatch("login/headerTitleChange", "鉴定资料")
            this.options = ['部门1','部门2', '部门3']
        }
    }
</script>

<style scoped>
    .title-bgcolor {
        background-color: #F5F7FA;
    }
    .content {
        display: flex;
        justify-content: space-around;
    }
</style>