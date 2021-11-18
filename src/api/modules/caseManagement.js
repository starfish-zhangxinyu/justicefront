export default {
    //案件
    "caCase": '/api/ca-case/v1/cases',
    //退案申请
    'caseChange': '/api/flow-case-change/v1/flow-case-changes',
    //案件判断
    "caseJudge": '/api/ca-case/v1/cases/judge',
    //鉴定记录
    'authRecords': '/api/auth-record/v1/auth-records',
    //受理界面字段
    'acceptFormField': '/api/accept-form-field/v1/accept-form-fields',
    //归档人
    "officeGroup": '/api/office/v1/offices/group-by-office',
    //鉴定材料
    "inspectMaterial": '/api/ca-inspection-material/v1/ca-inspection-materials',
    //查询鉴定材料
    "searchInspectMaterial": '/api/ca-give-info/v1/ca-give-infos/no-return-details',
    //修改鉴定材料为未返回
    "updateNoBackinspectMaterial": '/api/ca-inspection-material/v1/inspection-materials-no-back',
    //制作归档目录
    'archiveDirectorys': '/api/ca-archive/v1/archive-directorys',
    //归档
    'archive':'/api/ca-archive/v1/archives',
    //案件资料交接
    "caseMaterialHandle": "/api/ca-material-transfer/v1/ca-material-transfers",
    //补资料
    'receivedMaterial': '/api/ca-inspection-material/v1/ca-inspection-materials',
    //将补齐状态设为是
    'allReady': '/api/ca-inspection-material/v1/ca-inspection-materials/material-all-ready',
    //案件移交列表
    'caseHandOverList': '/api/ca-case/v1/cases/hand-over',
    // 时效统计 新增post 删除delete 详情get
    'caDelaysApi':'/api/ca-delay/v1/ca-delays',
    // 退案退费列表 get
    'abortRefundListApi':'/api/flow-case-change/v1/flow-case-changes/abort-refund/list',
    // 导出退案退费列表 get
    'abortRefundExportApi':'/api/flow-case-change/v1/flow-case-changes/abort-refund/list/export',
    //不予受理列表
    'refusefListApi':'/api/ca-case/v1/cases/refusef-list',
    //开票申请
    "invoicesApply": '/api/flow-invoice-apply/v1/invoices-apply',
    //发票申请列表
    "invoicesApplyList": '/api/flow-invoice-apply/v1/invoices-apply/list',
}