export default {
    //案件量统计
    "caseQuantityStatistics": '/api/ca-case-query/v1/caseStatistics',
    //收入统计
    "caseQuantityRevenues": '/api/ca-case-query/v1/revenues',
    //收入统计详情
    "caseQuantityRevenuesDetail": '/api/ca-case-query/v1/revenues/detail',
    //查询结果导出excel
    "caseStatisticsExport": '/api/ca-case-query/v1/caseStatistics/export',
    //案件量详细列表
    "caseQuantityDetail": '/api/ca-case-query/v1/caseList',
    //案件量详细列表导出excel
    "caseDetailExport": '/api/ca-case-query/v1/caseDetail/export',
    //收入统计
    "incomeStatistics": '/api/statistics/v1/income',

    //人员绩效统计查询get
    "personnelPerformance": '/api/statistics/v1/personnel-performance',
    //人员绩效统计查询结果导出get
    "personnelPerformanceExport": '/api/statistics/v1/personnel-performance/export',
    //人员绩效统计 案件详情列表查询get
    "personnelPerformanceDetail":'/api/statistics/v1/personnel-performance/Detail',
    //人员绩效统计 案件详情列表导出post
    "personnelPerformanceDetailExport":'/api/statistics/v1/personnel-performance/Detail/export',

    //会诊记录
    "consultationRecords": '/api/statistics/v1/consultation-records',
    //案件统计汇总
    "allCaseStatistics": '/api/statistics/v1/cases/by-conditions',

    //时效统计列表 get
    "prescriptionListApi": '/api/ca-prescription-query/v1/prescription',
    //时效统计导出 post
    "prescriptionExportApi": '/api/ca-prescription-query/export',
    //委托单位名称变更历史 get 
    "getUnitChangeApi": '/api/ca-case-query/v1/getUnitChange',

    //查询已经设置了的收费类型 get 
    "chargeTypeApi": '/api/charging-type/v1/charging-types/set',
    //个人绩效的案件明细 post 
    "personPerforApi": '/api/statistics/v1/personal-performances/detail',
    //个人绩效案件明细导出 post 
    "personPerforDetailExportApi": '/api/statistics/v1/personal-performances/detail/export',
    //个人绩效案件导出 post 
    "personPerforExportApi": '/api/statistics/v1/personal-performances/export',
    //个人绩效统计 post 
    "personPerforQueryApi": '/api/statistics/v1/personal-performances/query',
    //个人绩效结算 post 
    "personPerforSettleApi": '/api/statistics/v1/personal-performances/settle',
    //个人绩效反结算 post 
    "personPerforUnSettleApi": '/api/statistics/v1/personal-performances/unsettle',
    //个人绩效数据更新 post 
    "personPerforUpdateApi": '/api/statistics/v1/personal-performances/update',
    //分页查询委托单位(NOR状态)
    "entrustingNorApi":'/api/entrusting-unit/v1/entrusting-units/nor'
}