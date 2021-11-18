<template>
<div id="consultation">
  <PageBar title1="报表统计" title2="会诊记录统计"></PageBar>
  <div class="search-box" style="overflow: hidden">
    <el-form  :model="searchForm" size="small" ref="searchForm">
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="统计维度" label-width="30%" :rules="$filter_rules({required:true})" prop="dimension">
            <el-select v-model="searchForm.dimension" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in consultationOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="会诊日期" label-width="30%">
            <el-date-picker
              style="width: 100%"
              v-model="searchForm.date"
              value-format="yyyy-MM-dd HH:mm:ss"
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
          <el-form-item label="案件编号" label-width="30%">
           <el-input v-model="searchForm.caseNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8"  :offset="2">
          <el-form-item label="基因突变" label-width="30%">
            <el-select v-model="searchForm.testResult" placeholder="请选择" style="width: 100%">
              <el-option label="是" value="Y"></el-option>
              <el-option label="否" value="N"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8"  :offset="2">
          <el-form-item label="检测结果" label-width="30%">
            <el-select v-model="searchForm.testResult" placeholder="请选择" style="width: 100%;">
              <el-option label="肯定" value="肯定"></el-option>
              <el-option label="否定" value="否定"></el-option>
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
    border
    size="small"
    v-if="searchdata.dimension"
    :span-method="objectSpanMethod"
    style="width: 100%">


    <el-table-column
      prop="expert.name"
    v-if="searchdata.dimension=='EXPERT_NAME'"
      label="会诊专家">
    </el-table-column>
    <el-table-column
      prop="caseDto.caseNo"
    v-if="searchdata.dimension=='CASE_NO'"
      label="案件编号">
    </el-table-column>
    <el-table-column
      prop="consultationFee"
      label="费用">
    </el-table-column>
    <el-table-column
      prop="consultationStartDate"
      label="开始日期"
      width="">
    </el-table-column>
    <el-table-column
      prop="onsultationEndDate"
      label="结束日期">
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
        name: "Consultation",
      components:{'Select2':Select2},
      data(){
          return{
            searchForm:{},
            tableData:[],
            consultationOpt:[],
            page: {pageSizes: [5, 8, 10], pageSize: 5, total: 0, current: 1},
            port:'',
            tablesort:null,
            searchdata:{},
            spanArr: [],
            position: 0,
          }
      },
      methods:{
        search(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              var data = JSON.parse(JSON.stringify(this.searchForm));
              if (data.date) {
                data.consultationStartDate = data.date[0];
                data.consultationEndDate = data.date[1];
                delete data.date;
              };
              this.port='consultationRecords';
              this.searchdata = data;
            }
          });
        },
        rowspan() {
          this.spanArr=[];
          for (var i = 0; i <this.tableData.length; i++) {
            if (i === 0) {
              this.spanArr.push(1);
              this.position = 0
            } else {
              // 判断当前元素与上一个元素是否相同this.tableData[i].expert.name === this.tableData[i - 1].expert.name||
         if(this.searchdata.dimension=='EXPERT_NAME'){
           if (this.tableData[i].expert.name==this.tableData[i - 1].expert.name) {
             this.spanArr[this.position] += 1;
             this.spanArr.push(0);
           } else {
             this.spanArr.push(1);
             this.position = i;
           };
         }else{
           if (this.tableData[i].caseDto.caseNo==this.tableData[i - 1].caseDto.caseNo) {
             this.spanArr[this.position] += 1;
             this.spanArr.push(0);
           } else {
             this.spanArr.push(1);
             this.position = i;
           };
         }
            }
          }

        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }){
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
            return {
           rowspan: _row,
           colspan: _col
             }
          }
        }
      },
      watch:{
        tableData:
          {
            handler (newval, oldval) {
            this.rowspan();
            },
          }
      },
      created(){
        this.$get(api.enum+'/ca.StatisticalDimension$ConsultationRecordStatisticalDimension').then((res)=>{
          this.consultationOpt=res.data;
        }).catch((err)=>{console.log(err)})
      }
    }
</script>

<style scoped>

</style>
