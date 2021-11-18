export default {
    //费用异动申请
    "caseChangeAmountApply": '/api/flow-case-change/v1/flow-case-changes/amount/apply',
    //费用异动列表
    "flowCaseChangeList": '/api/flow-case-change/v1/flow-case-changes/amount/list',
    //取消退费/费用减免/费用异动
    "CancelCaseChange": '/api/flow-case-change/v1/flow-case-changes/cancel',
    //判断案件是否在审批中
    "isApply": '/api/flow-case-change/v1/flow-case-changes/is-apply',
    //费用异动、减免审批
    "caseChangeAmountAudit": '/api/flow-case-change/v1/flow-case-changes/audit',
    //费用异动详情
    "caseChangeAmount": '/api/flow-case-change/v1/flow-case-changes/amount',
    //费用base api
    "caseChargeFlow": '/api/flow-case-change/v1/flow-case-changes',
    //费用减免列表
    "flowCaseDeductionList": '/api/flow-case-change/v1/flow-case-changes/deduction/list',
    //报告变更列表
    "reportChangeList": '/api/flow-case-change/v1/flow-case-changes/reportChange/list',
    //判断案件是否有金额改变的申请（退案、退费、费用异动、费用减免）
    "checkCaseChange": '/api/flow-case-change/v1/flow-case-changes/check',
    //判断案件是否有在开票申请中的流程
    "checkCaseInvoiceApply":"/api/flow-invoice-apply/v1/flow-case-invoice/check"

}