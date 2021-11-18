<template>
    <div>
        <el-form-item :label="label" prop="">
            <el-input v-model="selectedPlan" style="width:80%;margin-right:10px;"></el-input>
            <el-button  @click="openPlanDiag">选择</el-button>
        </el-form-item>
        <el-dialog :visible="planDiag" append-to-body @close="planDiag = false">
            <el-form size="mini" :inline="true" label-width="80px">
                        <el-form-item label="计划类型">
                            <el-select v-model="searchForm.typeId" clearable class="w215">
                                <el-option
                                        v-for="item in typeOptions"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    <slot name="form" v-bind:searchForm="searchForm"></slot>
            </el-form>
            <div style="margin-bottom:10px;float:right" >
                <el-button @click="search" type="primary" size="mini">查询</el-button>
                <el-button @click="select" type="primary" size="mini">选择</el-button>
            </div>
            <el-table :data="tableData"
                   stripe
                   fit
                   border
                   style="width: 100%"
                   size="mini"
                   ref="planTable"
                   @select="selectRow"
                   max-height="500px">
                <slot name="table">
                </slot>
            </el-table>
        </el-dialog>
    </div>
</template>


<script>
    import api from "../../../api/index";
    export default {
    name: 'connectPlan',
    data() {
        return {
            planDiag:false,
            typeOptions:[],
            searchForm:{
                typeId:''
            },
            tableData:[],
            selectPlan1:[]
        }
    },
    props:{
        label:{
            default:''
        },
        selectPlan: {
            default() {
                return []
            }
        }
    },
    methods:{
        openPlanDiag() {
            this.planDiag = true;
            let searchForm = JSON.parse(JSON.stringify(this.searchForm));
            switch (this.label) {
                case '培训计划':
                    searchForm.progressStatus = searchForm.progressStatus && searchForm.progressStatus.value;
                    this.$get(api.getPlans, searchForm).then(res => {
                        this.tableData = res.data.list;
                        this.firstTotal = res.data.total;
                        console.log("培训计划列表", this.tableData);
                    });
                    break;
                case '考核计划':
                    searchForm.flowProgressStatus = searchForm.progressStatus && searchForm.progressStatus.value;
                    this.$post(api.examinePlanList, searchForm)
                        .then(res => {
                            this.tableData = res.data.list;
                            console.log(this.tableData, "考核计划列表");
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    break;
                case '质量控制计划':
                    searchForm.progressStatus = searchForm.progressStatus && searchForm.progressStatus.value;
                    this.$get(api.getControlPlans, searchForm).then(res => {
                        this.tableData = res.data.list;
                        /*this.firstTotal = res.data.total;*/
                        console.log("质量控制计划列表", this.tableData);
                    });
                    break;
                case '质量监督计划':
                    searchForm.progressStatus = searchForm.progressStatus && searchForm.progressStatus.value;
                    this.$get(api.getSupervisePlans, searchForm).then(res => {
                        this.tableData = res.data.list;
                        /*this.firstTotal = res.data.total;*/
                        console.log("质量监督计划", this.tableData);
                    });
                    break;
            }
        },
        selectRow(rows) {
            this.selectPlan1 = rows;
        },
        search() {
            this.openPlanDiag();
        },
        select() {
            if(this.selectPlan1.length == 0) {
                this.$message.error('您还未选择需要关联的计划！')
            }else if(this.selectPlan1.length > 1){
                this.$message.error('只能关联一个计划！')
            }else {
                this.$message.success('选择成功!')
                this.planDiag = false;
                this.$emit('update:selectPlan', this.selectPlan1)
            }
        }
    },
    computed: {
        selectedPlan() {
            if(this.label == '培训计划') {
                return this.selectPlan.length == 1 ? this.selectPlan[0].type+ '-'+ this.selectPlan[0].name + '-'+ this.selectPlan[0].content: ''
            }else if(this.label == '考核计划'){
                return this.selectPlan.length == 1 ? this.selectPlan[0].planType+ '-'+ this.selectPlan[0].name + '-'+ this.selectPlan[0].examineMode: ''
            }else if(this.label == '质量控制计划'){
                return this.selectPlan.length == 1 ? this.selectPlan[0].type+ '-'+ this.selectPlan[0].name + '-'+ this.selectPlan[0].controlMode: ''
            }else {
                return this.selectPlan.length == 1 ? this.selectPlan[0].type+ '-'+ this.selectPlan[0].name + '-'+ this.selectPlan[0].superviseMode: ''
            }

        }
    },
    created() {
        this.$get(api.type).then(res => {

            this.typeOptions = res.data;
            console.log('计划类型', this.typeOptions)
        });
    }

}
</script>
<style lang="less">
    body > .el-tooltip__popper.is-dark {
        z-index: 9999 !important;
    }
</style>