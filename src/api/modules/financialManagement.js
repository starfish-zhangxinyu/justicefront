export default {
    //财务管理
    "finance": '/api/ca-case/v1/cases/finance',
    //发票管理
    "invoices": '/api/fi-invoice/v1/invoices',
    //其他收入
    "otherCharge": '/api/fi-other-charge/v1/fi-other-charges',
    //其他收入汇总
    "otherChargeSum": '/api/fi-other-charge-sum/v1/fi-other-charge-sums',
    //收费确认
    "caseCharge": '/api/fi-case-charge/v1/case-charges',
    //判断案件是否是收费了
    "isHasChargeApi": '/api/ca-finance-info/v1/ca-finance-infos',
    //其他收入关联的案件
    "otherChargeCaseList": '/api/fi-other-charge/v1/fi-other-charges/relevance-case-list',
}