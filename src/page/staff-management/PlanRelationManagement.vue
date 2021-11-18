<template>
    <div>
        <!--@keyup.enter.native="search"-->
        <div class="search-box" style="overflow: hidden">
          <!--@keyup.enter.native="search"-->
          <el-form :model="searchData" size="small"  label-width="100px">
              <el-row>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                      <el-form-item label="计划类型">
                          <el-select v-model="searchData.typeId" clearable class="w100">
                              <el-option
                                      v-for="item in typeOptions"
                                      :key="item.id"
                                      :label="item.label"
                                      :value="item.id"
                              ></el-option>
                          </el-select>
                      </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                      <el-form-item label="计划进度">
                          <select-from-enum
                                  type="plan.FlowProgressStatus"
                                  :model.sync="searchData.progressStatus"
                                  clearable
                                  class-name="w100"
                          ></select-from-enum>
                      </el-form-item>
                  </el-col>
                  <el-col :sm="panClass.sm" :md="panClass.md" :xl="panClass.xl">
                      <el-form-item label="计划年份">
                          <el-date-picker
                                  v-model="searchData.planYear"
                                  type="year"
                                  value-format="yyyy"
                                  placeholder="计划年份"
                                  class="w100"
                          ></el-date-picker>
                      </el-form-item>
                  </el-col>
              </el-row>
            <el-row>
              <el-button
                      type="primary"
                      icon="el-icon-search"
                      size="small"
                      style="color: white;float:right"
                      @click="search"
              >查询
              </el-button>
            </el-row>
          </el-form>
        </div>
        <el-button-group style="margin-bottom: 10px;">
            <el-button
                    type="primary"
                    size="small"
                    style="color: white"
                    @click="openConnectDiog"
                    v-if="hasPermission('auth:relation:relate')"

            >关联计划
            </el-button>
            <el-button
                    type="primary"
                    size="small"
                    style="color: white"
                    @click="disConnectPlan"
                    v-if="hasPermission('auth:relation:unrelate')"
            >取消关联
            </el-button>
            <el-button
                    type="primary"
                    size="small"
                    style="color: white"
                    @click="exportPlan"
            >导出
            </el-button>
        </el-button-group>
        <el-dialog title="导出计划列表" :visible.sync="exportPlanListDialog">
        <span style="margin-left: 70%">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选
            </el-checkbox>
            <el-checkbox v-model="checkReverse" @change="handleCheckReverseChange">反选
            </el-checkbox>
        </span>
            <el-checkbox-group v-model="checkedList" @change="handleCheckedItemChange">
                <el-table :data="planHeaders" fit stripe border size="mini" style="width: 100%; padding: 0;" :show-header="true">
                    <el-table-column align="center" label="列表栏" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <ul>
                                <li style="float:left; min-width: 25%;">
                                    <el-checkbox :label="scope.row.first" v-if="scope.row.first">
                                        {{scope.row.first}}
                                    </el-checkbox>
                                </li>
                                <li style="float:left; min-width: 25%">
                                    <el-checkbox :label="scope.row.second" v-if="scope.row.second">
                                        {{scope.row.second}}
                                    </el-checkbox>
                                </li>
                                <li style="float:left; min-width: 25%">
                                    <el-checkbox :label="scope.row.third" v-if="scope.row.third">
                                        {{scope.row.third}}
                                    </el-checkbox>
                                </li>
                                <li style="float:left; min-width: 25%">
                                    <el-checkbox :label="scope.row.forth" v-if="scope.row.forth">
                                        {{scope.row.forth}}
                                    </el-checkbox>
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table>
            </el-checkbox-group>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="exportPlanListDialog = false">取 消</el-button>
                <el-button size="mini" type="primary" @click="confirmExportPlan">确 定 </el-button>
            </div>
        </el-dialog>
        <el-table
                :data="tableData"
                stripe
                fit
                border
                style="width: 100%"
                size="mini"
                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="year" label="年份" show-overflow-tooltip ></el-table-column>
            <el-table-column prop="trainPlanType" label="培训计划" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span @click="openDetailPlan(scope.row,'培训计划')" style="cursor: pointer;">{{scope.row.trainPlanType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="examinePlanType" label="考核计划" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span @click="openDetailPlan(scope.row,'考核计划')" style="cursor: pointer;">{{scope.row.examinePlanType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="controlPlanType" label="质量控制计划" show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span @click="openDetailPlan(scope.row,'质量控制计划')" style="cursor: pointer;">{{scope.row.controlPlanType}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="supervisePlanType" label="质量监督计划" show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <span @click="openDetailPlan(scope.row,'质量监督计划')" style="cursor: pointer;">{{scope.row.supervisePlanType}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                :total="firstTotal"
                :current-page.sync="firstCurrent"
                :page-sizes="pageSizes"
                :page-size.sync="firstPageSize"
                layout="total, sizes, prev, pager, next"
                style="transform: translate(calc(100% - 300px),0)"
                background
        ></el-pagination>
        <el-dialog :visible="detailPlanDig"
                   :title="diagTitle"
                    @close="closeDetailPlanDig"
                    width="60%">
                <el-table :data="detailTableData"
                          stripe
                          fit
                          border
                          style="width: 100%"
                          size="mini"
                          max-height="500px"
                          >
                    <el-table-column v-for="(item, index) in detailTitle" :key="item" :label="item" :prop="detailContent[index]" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column  label="操作" v-if="diagTitle == '培训计划详情'" :key="detailTitle.length">
                        <template slot-scope="scope">
                            <el-button  type="primary"
                                        size="mini"
                                        @click="openDetailRecord(scope.row,'培训计划')">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" v-if="diagTitle == '考核计划详情'" :key="detailTitle.length">
                        <template slot-scope="scope">
                            <el-button  type="primary"
                                        size="mini"
                                        @click="openDetailRecord(scope.row,'考核计划')">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" v-if="diagTitle == '质量控制计划详情' && detailTitle.length">
                        <template slot-scope="scope">
                            <el-button  type="primary"
                                        size="mini"
                                        @click="openDetailRecord(scope.row,'质量控制计划')">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" v-if="diagTitle == '质量监督计划详情' && detailTitle.length">
                        <template slot-scope="scope">
                            <el-button  type="primary"
                                        size="mini"
                                        @click="openDetailRecord(scope.row,'质量监督计划')">
                                查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            <el-dialog
                    width="50%"
                    :title="diagRecordTitle"
                    :visible.sync="detailRecordDig"
                    append-to-body>
                <el-table
                        stripe
                        fit
                        border
                        style="width: 100%"
                        size="mini"
                        :data="recordTableData"
                        max-height="500px">
                    <el-table-column v-for="(item, index) in detailRecordTitle" :key="index" :label="item" :prop="detailRecordContent[index]" show-overflow-tooltip>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-dialog>
        <el-dialog :visible="connectDiag"
                   title="关联计划"
                   @close="connectDiag = false"
                   >
            <el-form :model="planRelationDto" size="small"  label-width="130px" ref="planRelate">
                <el-form-item
                        label="计划年份"
                        prop="year"
                        :rules="$filter_rules({required:true,trigger:'blur'})"
                >
                    <el-date-picker
                            v-model="planRelationDto.year"
                            type="year"
                            value-format="yyyy"
                            placeholder="计划年份"
                            style="width:80%"
                    ></el-date-picker>
                </el-form-item>
                <Connect-plan label="培训计划" @handleSelectPlan="handleSelectPlan" :selectPlan.sync="selectPlan1">
                    <template v-slot:form="slotProps">
                            <el-form-item label="针对对象">
                                <el-input v-model="slotProps.searchForm.targetObject" class="w215" />
                            </el-form-item>
                            <el-form-item label="培训进度">
                                <select-from-enum
                                        type="plan.FlowProgressStatus"
                                        :model.sync="slotProps.searchForm.progressStatus"
                                        clearable
                                ></select-from-enum>
                            </el-form-item>
                            <el-form-item label="培训方">
                                <el-input v-model="slotProps.searchForm.trainUnit" class="w215"/>
                            </el-form-item>
                    </template>
                    <template v-slot:table >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="type" label="计划类型" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="培训目标" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="content" label="培训内容" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="targetObject" label="针对对象" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="trainUnit" label="培训方" show-overflow-tooltip></el-table-column>
                        <el-table-column
                                prop="planFlowDto.planYear"
                                label="计划年份"
                                show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="trainMode" label="培训方式" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="offices" label="参培人员" show-overflow-tooltip>
                            <template slot-scope="scope">{{scope.row.staffDtos.map(i => i.name).join(',')}}</template>
                        </el-table-column>
                        <el-table-column
                                prop="planFlowDto.progressStatus.label"
                                label="进度状态"
                                show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                                prop="planFlowDto.planStatus.label"
                                label="任务状态"
                                show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                                prop="planFlowDto.rejectReason"
                                label="驳回理由"
                                show-overflow-tooltip
                        ></el-table-column>
                    </template>
                </Connect-plan>
                <Connect-plan label="考核计划" @handleSelectPlan="handleSelectPlan" :selectPlan.sync="selectPlan2">
                    <template v-slot:form="slotProps">
                        <el-form-item label="考核对象">
                            <el-input v-model="slotProps.searchForm.targetObject" class="w215" />
                        </el-form-item>
                        <el-form-item label="培训进度">
                            <select-from-enum
                                    type="plan.FlowProgressStatus"
                                    :model.sync="slotProps.searchForm.progressStatus"
                                    clearable
                            ></select-from-enum>
                        </el-form-item>
                        <el-form-item label="主考部门">
                            <el-input v-model="slotProps.searchForm.department" class="w215"/>
                        </el-form-item>
                    </template>
                    <template v-slot:table>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="planType" label="计划类型" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="name" label="考核项目" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="examineMode" label="考核方式" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="targetObject" label="考核对象" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="department" label="主考部门" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="planFlowDto.planYear" label="计划年份" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="planFlowDto.progressStatus.label" label="进度状态" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="planFlowDto.planStatus.label" label="任务状态" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="planFlowDto.rejectReason" label="驳回理由" show-overflow-tooltip></el-table-column>
                    </template>
                </Connect-plan >
                <Connect-plan label="质量控制计划" @handleSelectPlan="handleSelectPlan" :selectPlan.sync="selectPlan3">
                    <template v-slot:form="slotProps">
                        <el-form-item label="计划进度">
                            <select-from-enum
                                    type="plan.FlowProgressStatus"
                                    :model.sync="slotProps.searchForm.progressStatus"
                                    clearable
                            ></select-from-enum>
                        </el-form-item>
                    </template>
                    <template v-slot:table>
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="type" label="计划类型" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="name" label="质量控制项目" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="controlMode" label="方式" show-overflow-tooltip ></el-table-column>
                        <el-table-column prop="chargePerson" label="负责人" show-overflow-tooltip
                                         width="150px;"></el-table-column>
                        <el-table-column
                                prop="planFlowDto.planYear"
                                label="计划年份"
                                show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column prop="offices" label="参与人员" show-overflow-tooltip>
                            <template slot-scope="scope">{{scope.row.hrStaffDtoList && scope.row.hrStaffDtoList.map(i => i.name).join(',')}}</template>
                        </el-table-column>
                        <el-table-column
                                prop="planFlowDto.progressStatus.label"
                                label="进度状态"
                                show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                                prop="planFlowDto.planStatus.label"
                                label="任务状态"
                                show-overflow-tooltip
                        ></el-table-column>
                        <el-table-column
                                prop="planFlowDto.rejectReason"
                                label="驳回理由"
                                show-overflow-tooltip
                        ></el-table-column>
                    </template>
                </Connect-plan>
                <Connect-plan label="质量监督计划" @handleSelectPlan="handleSelectPlan" :selectPlan.sync="selectPlan4">
                    <template v-slot:form="slotProps">
                        <el-form-item label="计划进度">
                            <select-from-enum
                                    type="plan.FlowProgressStatus"
                                    :model.sync="slotProps.searchForm.progressStatus"
                                    clearable
                            ></select-from-enum>
                        </el-form-item>
                    </template>
                    <template v-slot:table>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                        <el-table-column prop="type" align="center" label="计划类型" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="name" align="center" label="质量监督项目" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="superviseMode" align="center" label="方式" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="chargePerson" align="center" label="负责人" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="planFlowDto.planYear" align="center" label="计划年份" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="offices" label="参与人员" show-overflow-tooltip width="150px;">
                            <template slot-scope="scope">{{scope.row.hrStaffDtoList && scope.row.hrStaffDtoList.map(i => i.name).join(',')}}</template>
                        </el-table-column>
                        <el-table-column prop="planFlowDto.progressStatus.label" align="center" label="进度状态" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                prop="planFlowDto.planStatus.label"
                                label="任务状态"
                                show-overflow-tooltip
                                width="100px;"
                        ></el-table-column>
                        <el-table-column prop="planFlowDto.rejectReason" align="center" label="驳回理由" show-overflow-tooltip>
                        </el-table-column>
                    </template>
                </Connect-plan>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmRelate('planRelate')">关 联</el-button>
                <el-button @click="connectDiag = false">取 消</el-button>

            </span>
           <!-- <el-dialog
                    width="30%"
                    :title="diagRecordTitle"
                    :visible.sync="detailRecordDig"
                    append-to-body>
                <el-table
                        stripe
                        fit
                        border
                        style="width: 100%"
                        size="mini"
                        :data="recordTableData">
                    <el-table-column v-for="(item, index) in detailRecordTitle" :key="index" :label="item" :prop="detailRecordContent[index]">
                    </el-table-column>
                </el-table>
            </el-dialog>-->
        </el-dialog>
    </div>
</template>
<script>
  import api from "../../api/index";
  import ConnectPlan from './components/connectPlan';
  import axios from 'axios';
  export default {
    name: "PlanRelationManagement.vue",
    data() {
      return {
        searchData: {
          planYear: "",
          progressStatus: "",
          targetObject: "",
          trainUnit: "",
          typeId: ""
        },
        panClass: {
              sm: {span: 12},
              md: {span: 8},
              xl: {span: 6, offset: 1}
        },
        tableData:[],
        activeName: 'trainPlan',
        trainingRecordDialog: false,
        yearRecordDialog: false,
        apartment:'参培部门',
        typeOptions: [], //计划类型,
        firstTotal: 0,
        firstCurrent:1,
        firstPageSize: 30,
        pageSizes: [30, 50, 80, 100],
        detailTitle:[],
        detailRecordTitle:[],
        detailTableData:[],
        recordTableData:[],
        detailPlanDig: false,
        detailRecordDig: false,
        diagTitle:'',
        diagRecordTitle:'',
        detailContent:[],
        detailRecordContent:[],
        connectDiag: false,
        planRelationDto:{
            year:'',
            trainId:''
        },
        relatedPlans:[],
        selectRows: [],
        selectPlan1:[],
        selectPlan2:[],
        selectPlan3:[],
        selectPlan4:[],
        //导出计划列表
        exportPlanListDialog: false,
        checkAll:false,
        checkReverse:false,
        checkedList:[],
        exportTitle:['年份', '培训计划', '考核计划', '质量控制计划', '质量监督计划']
      }
    },
    inject:['hasPermission'],
    methods: {
        //导出关联计划
      exportPlan() {
            this.exportPlanListDialog = true;
            this.checkedList = [];
        },
      handleCheckAllChange() {
          if(this.checkedList.length !== this.exportTitle.length) {
              this.checkedList = this.exportTitle;
          }else {
              this.checkedList = []
          }
      },
      handleCheckReverseChange() {
          let notCheckedItems = this.exportTitle.filter(item => !this.checkedList.includes(item));
          this.checkedList = notCheckedItems;
      },
      handleCheckedItemChange() {
            this.checkAll = this.checkedList.length == this.exportTitle.length;
      },
        async confirmExportPlan() {
            this.exportPlanListDialog = false;
            let idList = [];
            if(this.selectRows.length > 0) {
                idList = this.selectRows.reduce((previousValue, currentValue) => {
                    return previousValue.concat(currentValue);
                },[]).map(item => item.id);
            }else {
                //全部导出
                idList = null;
            }
            try {
                let { data } = await axios.post(
                    api.exportPlan,{
                        recordIds:idList,
                        requiredHeaders: this.checkedList,
                        planMode:'RELATION'
                    },{ responseType :'blob'}
                );
                let url = window.URL.createObjectURL(new Blob([data.data]));
                let link = document.createElement("a");
                link.style.display = "none";
                link.href = url;
                document.body.appendChild(link);
                link.setAttribute("download", '计划关联列表.xlsx');
                link.click();
                url = null;
                link = null;
            } catch {
                this.$message.error("导出失败");
            }
        },
      search(data) {
        /*this.trainingRecordDialog = true;*/
        //查询
        if (!data) {
          this.searchData["pageDto.current"] = 1;
          this.searchData["pageDto.pageSize"] = 30;
        } else {
          this.searchData["pageDto.current"] = data.current;
          this.searchData["pageDto.pageSize"] = data.pageSize;
        }
        let searchForm = JSON.parse(JSON.stringify(this.searchData));
        searchForm.progressStatus =
                searchForm.progressStatus && searchForm.progressStatus.value;
        this.$get(api.getRelationPlans, searchForm).then(res => {
          this.tableData = res.data.list;
          this.firstTotal = res.data.total;
        });
      },
        handleSelectionChange(val) {
            //选中的计划
            this.selectRows = val;

        },
        openConnectDiog() {
            this.selectPlan1 = [],
            this.selectPlan2 = [],
            this.selectPlan3 = [],
            this.selectPlan4 = [],
            this.connectDiag = true;
            this.$nextTick(() => {
                this.$refs.planRelate.resetFields();
            })
        },
        handleSelectPlan(row) {
          /*console.log('选中的计划',row,this.relatedPlans)*/

            /*let index = this.relatedPlans.findIndex(item => {item.id == row.id;row.type == item.type;});*/
            /*let oldPlanIndex = this.relatedPlans.findIndex(item => row.type == item.type);*/
          /*if(index == -1) {
              this.relatedPlans.push(row)
          }else {
              //有同类型的计划

          }*/
          /*console.log(oldPlanIndex,'oldPlanIndexoldPlanIndex')
          if( oldPlanIndex == -1) {
              this.relatedPlans.push(row)
          }else {
              this.relatedPlans.splice(oldPlanIndex,1,row);
          }*/
          /*console.log(this.didConnectPlan,'选中的所有计划');*/
        },
        //确认关联
        confirmRelate(dom) {
            this.$refs[dom].validate(v => {
                if(v) {
                    if(this.didConnectPlan.length == 0) {
                        this.$message.error('您还未选择关联的计划！')
                    }else if(this.didConnectPlan.length == 1){
                        this.$message.error('关联的计划数必须大于1！')
                    }else {
                        this.didConnectPlan.forEach(item => {
                            if(item.trainMode) {
                                this.planRelationDto.trainId = item.id;
                                this.planRelationDto.trainPlanType = item.type;
                            }
                            if(item.examineMode) {
                                this.planRelationDto.examineId = item.id;
                                this.planRelationDto.examinePlanType = item.planType;
                            }
                            if(item.controlMode) {
                                this.planRelationDto.controlId = item.id;
                                this.planRelationDto.controlPlanType = item.type;
                            }
                            if(item.superviseMode) {
                                this.planRelationDto.superviseId = item.id;
                                this.planRelationDto.supervisePlanType = item.type;
                            }
                        })
                        this.$post(api.relatePlans,this.planRelationDto).then(res => {
                            this.$message.success('计划关联成功')
                            this.connectDiag = false;
                            this.search();

                        }).catch(e => {
                            console.log(e)
                        })
                    }
                }
            })


        },
        //取消关联
        disConnectPlan() {
            if(this.selectRows.length == 0) {
                this.$message.error(('请至少选择一个关联计划!'))
            }else {
                let ids = this.selectRows.map(item => item.id).join(',');
                this.$del(api.deleteRelatedPlans+'/'+ids).then(res => {
                    this.$message.success('取消关联成功！')
                    this.search()
                })
            }
        },
        /* -----------------------------------table中的字的dialog-----------------------------------------------*/
        closeDetailPlanDig() {
          this.detailPlanDig = false;
        },
        searchDetailPlan(str,row) {
          let port = '';
          let method = '';
            if(str == '培训计划') {
                port = 'getPlans';
                method = '$get';
                    /*this.trainingRecordDialog = true;*/
                    //查询
                    /*if (!data) {
                        this.searchData["pageDto.current"] = 1;
                        this.searchData["pageDto.pageSize"] = 30;
                    } else {
                        this.searchData["pageDto.current"] = data.current;
                        this.searchData["pageDto.pageSize"] = data.pageSize;
                    }
                    let searchForm = JSON.parse(JSON.stringify(this.searchData));
                    searchForm.progressStatus =
                        searchForm.progressStatus && searchForm.progressStatus.value;*/
            }else if (str == '质量控制计划'){
                port = 'getControlPlans';
                method = '$get';
            }else if (str == '考核计划'){
                port = 'examinePlanList';
                method = '$post';
            }else if (str == '质量监督计划') {
                port = 'getSupervisePlans';
                method = '$get';
            }

            this[method](api[port], {planYear:row.year}/*{planYear:2021}*/).then(res => {
                this.detailTableData  = res.data.list;
                this.firstTotal = res.data.total;
                if(str == '培训计划') {
                    this.detailTableData.forEach(item => {
                        item.staffDtos  = item.staffDtos.map(item => item.name).join(',');
                    })
                    this.detailContent =
                        ['type','name','content','targetObject','trainUnit',`planFlowDto.planYear`,
                         'trainMode','staffDtos','planFlowDto.progressStatus.label','planFlowDto.planStatus.label','planFlowDto.rejectReason']
                }
                if(str == '考核计划') {
                    this.detailContent =
                        ['planType', 'name', 'examineMode', 'targetObject', 'department', `planFlowDto.planYear`,
                            'planFlowDto.progressStatus.label', 'planFlowDto.planStatus.label', 'planFlowDto.rejectReason']
                }
                if(str == '质量控制计划') {
                    this.detailTableData.forEach(item => {
                        item.hrStaffDtoList  = item.hrStaffDtoList.map(item => item.name).join(',');
                    })
                    this.detailContent =
                        ['type','name','controlMode','chargePerson','hrStaffDtoList','planFlowDto.planYear','planFlowDto.progressStatus.label','planFlowDto.planStatus.label','planFlowDto.rejectReason']
                }
                if(str == '质量监督计划') {
                    this.detailTableData.forEach(item => {
                        item.hrStaffDtoList  = item.hrStaffDtoList.map(item => item.name).join(',');
                    })
                    this.detailContent =
                        ['type','name','superviseMode','chargePerson','hrStaffDtoList','planFlowDto.planYear','planFlowDto.progressStatus.label','planFlowDto.planStatus.label','planFlowDto.rejectReason']
                }
            })
        },
        openDetailPlan(row,str) {
            switch (str) {
                case '培训计划':
                    this.searchDetailPlan('培训计划',row);
                    this.detailTitle = ['计划类型','培训目标','培训内容','针对对象','培训方','计划年份','培训方式','参培人员','进度状态','任务状态','驳回理由']
                    this.diagTitle = '培训计划详情';

                    break;
                case '考核计划':
                    this.searchDetailPlan('考核计划',row);
                    this.detailTitle = ['计划类型','考核项目','考核方式','考核对象','主考部门','计划年份','进度状态','任务状态','驳回理由']
                    this.diagTitle = '考核计划详情';
                    break;
                case '质量控制计划':
                    this.searchDetailPlan('质量控制计划',row);
                    this.detailTitle = ['计划类型','质量控制项目','方式','负责人','参培人员','计划年份','进度状态','任务状态','驳回理由']
                    this.diagTitle = '质量控制计划详情';
                    break;
                case '质量监督计划':
                    this.searchDetailPlan('质量监督计划',row);
                    this.detailTitle = ['计划类型','质量监督项目','方式','负责人','参培人员','计划年份','进度状态','任务状态','驳回理由']
                    this.diagTitle = '质量监督计划详情';
                    break;
          }
            this.detailPlanDig = true;
        },
        searchDetailRecord(str, row) {
          let port = '';
          let searchForm = {};
          switch(str) {
              case '培训计划':
                  port = 'getRecords';searchForm = {plainTrainId: row.id};
                  break;
              case '考核计划':
                  port = 'examineRecordList';searchForm = {planExamineId: row.id};
                  break;
              case '质量控制计划':
                  port = 'getControlRecords';searchForm = {planControlId: row.id};
                  break;
              case '质量监督计划':
                  port = 'getSuperviseRecord';searchForm = {planSuperviseId: row.id};
                  break;
          }

            /*this.recordSearchForm.planTrainId = this.activePlan.id;
                this.recordSearchForm["pageDto.current"] = 1;
                this.recordSearchForm["pageDto.pageSize"] = 30;
                let searchForm = JSON.parse(JSON.stringify(this.recordSearchForm));*/
            this.$get(api[port], searchForm).then(res => {
                this.recordTableData = res.data.list;
                if(str == '培训计划') {
                    this.recordTableData.forEach(item => {
                        item.staffDtos  = item.staffDtos.map(item => item.name).join(',');
                    })
                    this.detailRecordContent =
                        ['trainDate','trainUnit','trainName','staffDtos','trainType','description']
                }
                if(str == '考核计划') {
                    this.detailRecordContent =
                        ['impDate','staffName','result','description']
                }
                if(str == '质量控制计划') {
                    this.recordTableData.forEach(item => {
                        item.hrStaffDtoList  = item.hrStaffDtoList.map(item => item.name).join(',');
                    })
                    this.detailRecordContent = ['recordDate','hrStaffDtoList','name','description']

                }
                if(str == '质量监督计划') {
                    this.recordTableData.forEach(item => {
                        item.hrStaffDtoList  = item.hrStaffDtoList.map(item => item.name).join(',');
                    })
                    this.detailRecordContent = ['recordDate','hrStaffDtoList','name','description']

                }

            });
        },
        openDetailRecord(row,str) {
            this.detailRecordDig = true;
            switch (str) {
                case '培训计划':
                    this.searchDetailRecord('培训计划', row);
                    this.diagRecordTitle = '培训记录';
                    this.detailRecordTitle = ['培训日期', '培训方', '培训记录名称', '参培人员', '培训类型', '培训情况描述']
                    break;
                case '考核计划':
                    this.searchDetailRecord('考核计划', row);
                    this.diagRecordTitle = '考核记录';
                    this.detailRecordTitle = ['考核实施日期', '被考核人', '考核结果', '考核情况简述']
                    break;
                case '质量控制计划':
                    this.searchDetailRecord('质量控制计划', row);
                    this.diagRecordTitle = '质量控制记录';
                    this.detailRecordTitle = ['日期', '参与人员', '质量控制记录名称', '质量控制工作描述']
                    break;
                case '质量监督计划':
                    this.searchDetailRecord('质量监督计划', row);
                    this.diagRecordTitle = '质量监督记录';
                    this.detailRecordTitle = ['日期', '参与人员', '质量监督记录名称', '质量监督工作描述']
                    break;
            }
        }


    },
      computed:{
        didConnectPlan() {
            return this.selectPlan1.concat(this.selectPlan2,this.selectPlan3,this.selectPlan4)
        },
          planHeaders() {
              let arr = []
              this.exportTitle.forEach((item, index) => {
                  if(index % 4 == 0) {
                      arr.push({first:item})
                  }
                  if(index % 4 == 1) {
                      arr[Math.floor(index / 4)].second = item;
                  }
                  if(index % 4 == 2) {
                      arr[Math.floor(index / 4)].third = item;
                  }
                  if(index % 4 == 3) {
                      arr[Math.floor(index / 4)].forth = item;
                  }
              })
              return arr
          }
      },
    components: {
        ConnectPlan
    },
    created() {
      this.$store.dispatch("login/headerTitleChange", "计划关联")
      //获取计划类型
      this.$get(api.type).then(res => {
            this.typeOptions = res.data;
        });
      this.search();
    }
  }
</script>

<style scoped>
  .title-bgcolor {
    background-color: #F5F7FA;
  }
</style>