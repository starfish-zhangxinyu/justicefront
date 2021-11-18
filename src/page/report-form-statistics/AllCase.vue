<template>
<div id="all-case">
  <PageBar title1="报表统计" title2="案件统计汇总"></PageBar>
  <div class="search-box" style="overflow: hidden">
    <el-form  :model="searchForm" size="small" ref="searchForm">
      <el-row>
        <el-col :span="18"  :offset="2">
          <el-form-item label="统计维度" label-width="13%" :rules="$filter_rules({required:true})" prop="caseAmountStatisticsTypeList">
            <el-select v-model="searchForm.caseAmountStatisticsTypeList" placeholder="请选择" :multiple=true style="width: 100%">
              <el-option
                v-for="item in caseAmountOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="委托单位" label-width="30%">
            <select-client :model.sync="searchForm.entrustingUnit"></select-client>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="专业类别" label-width="30%">
            <Select2 :model.sync="searchForm.professionCategoryId" port="profession" className="multiple-select"></Select2>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="委托日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              v-model="searchForm.date1"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="受理日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.date2"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2" >
          <el-form-item label="登记日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.date3"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="归档日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.date4"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="发放状态" label-width="30%" prop="giveStatus">
            <el-input  v-model="searchForm.giveStatus"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="发放日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="searchForm.date5"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="收费状态" label-width="30%">
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="受理地点" label-width="30%">
            <Select2 :model.sync="searchForm.acceptStationId" port="acceptStation"></Select2>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="案件状态" label-width="30%">
            <el-select v-model="searchForm.caseStatus" placeholder="请选择">
              <el-option
                v-for="item in caseStatusOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="检测结果" label-width="30%">
            <el-select v-model="searchForm.testResult" placeholder="请选择">
              <el-option label="肯定" value="肯定"></el-option>
              <el-option label="否定" value="否定"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="基因突变" label-width="30%">
            <el-select v-model="searchForm.testResult" placeholder="请选择">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="1"  :offset="11">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="search('searchForm')">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <el-button type="primary" size="mini" style="margin-bottom: 10px"><i class="fa fa-sign-out"></i>导出</el-button>
  <el-table
    :data="tableData"
    v-if="searchdata.caseStatisticalDimensionStr"
    border
    size="small"
    style="width: 100%">

    <el-table-column
      v-if="isShow('PROFESSION_CATEGOR')"
      prop="professionCategory.name"
      label="专业类别"
      width="">
    </el-table-column>
    <el-table-column
      v-if="isShow('ENTRUSTING_UNIT_TYPE')"
      prop="entrustingUnitType.label"
      label="委托单位类型"
      width="">
    </el-table-column>
    <el-table-column
      v-if="isShow('ENTRUSTING_UNIT')"
      prop="entrustingUnit.name"
      label="委托单位"
      width="">
    </el-table-column>
    <el-table-column
      prop="caseCnt"
      label="案件量">
    </el-table-column>
    <el-table-column
      prop="amount.yuanFmt"
      label="合同金额">
    </el-table-column>
    <el-table-column
      prop="amountRefund.yuanFmt"
      label="退款金额"
      width="">
    </el-table-column>
    <el-table-column
      prop="lawAid.yuanFmt"
      label="法律援助金额"
      width="">
    </el-table-column>
    <el-table-column
      prop="receivable.yuanFmt"
      label="应收金额">
    </el-table-column>
    <!-- <el-table-column
      prop="received.yuanFmt"
      label="已收金额">
    </el-table-column> -->
    <el-table-column
      prop="actualReceivable.yuanFmt"
      label="实收金额">
    </el-table-column>
    <el-table-column
      prop="notReceived.yuanFmt"
      label="未收金额">
    </el-table-column>
    <el-table-column
      prop="invoiceAmount.yuanFmt"
      label="开票金额">
    </el-table-column>
    <el-table-column
      prop="address"
      label="操作">
      <template slot-scope="scope">
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-footer">
    <pagination
      :pcurrent.sync="page.current"
      :page.sync="page"
      :data.sync="tableData"
      :search.sync="searchdata"
      :sort.sync="tablesort"
      :port="port">
    </pagination>
  </div>
</div>
</template>

<script>
  import Select2 from '../../components/common/Select2'
  import api from '../../api/index'
    export default {
        name: "AllCase",
      components:{'Select2':Select2},
      data(){
          return{
            caseStatusOpt:[],
            caseAmountOpt:[],
            searchForm:{entrustingUnit:{name:''},caseAmountStatisticsTypeList:[]},
            tableData:[],
            page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
            port:'',
            tablesort:null,
            searchdata:{},
          }
      },
      methods: {
          isShow(str){
            if(this.searchdata.caseStatisticalDimensionStr){
              if(this.searchdata.caseStatisticalDimensionStr.indexOf(str)==-1){
                return false;
              }else{
                return true;
              }
            }
          },
        search(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var data = JSON.parse(JSON.stringify(this.searchForm));
              if (data.date1) {
                data.beginEntrustingDate = data.date1[0];
                data.endEntrustingDate = data.date1[1];
                delete data.date1;
              }
              if (data.date2) {
                data.beginAcceptDate = data.date2[0];
                data.endAcceptDate = data.date2[1];
                delete data.date2;
              }
              if (data.date3) {
                data.beginRegisterDate = data.date3[0];
                data.endRegisterDate = data.date3[1];
                delete data.date3;
              }
              if (data.date4) {
                data.beginArchiveDate = data.date4[0];
                data.endArchiveDate = data.date4[1];
                delete data.date4;
              }
              if (data.date5) {
                data.beginGiveDate = data.date5[0];
                data.endGiveDate = data.date5[1];
                delete data.date5;
              }
              if (data.entrustingUnit.id) {
                data.entrustingUnitId = data.entrustingUnit.id;
                delete data.entrustingUnit;
              }else{
                delete data.entrustingUnit;
              };
              if(data.caseAmountStatisticsTypeList.length){
                var str='';
                for(let i=0;i<data.caseAmountStatisticsTypeList.length;i++){
                  str+=data.caseAmountStatisticsTypeList[i]+',';
                }
                data.caseStatisticalDimensionStr=str.substr(0,str.length-1);
              };
              delete data.caseAmountStatisticsTypeList;
              this.port='allCaseStatistics';
              this.searchdata = data;

            }
          });

        },
      },
      created(){
          this.$get(api.enum+'/ca.CaseStatus').then((res)=>{
           this.caseStatusOpt=res.data;
          }).catch((err)=>{console.log(err)});
        this.$get(api.enum+'/ca.StatisticalDimension$CaseStatisticalDimension').then((res)=>{
         this.caseAmountOpt=res.data;
        }).catch((err)=>{console.log(err)})
      }
    }
</script>

<style scoped>

</style>
