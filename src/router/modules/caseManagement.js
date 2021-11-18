//案件管理路由
import CaseList from '@/page/case-management/case-list/CaseList.vue'
import Register from '@/page/case-management/register/MainPage.vue'
import AcceptCase from '@/page/case-management/accept-case/MainPage.vue'
import CaseDetail from '@/page/case-management/case-list/CaseDetail.vue'
import CaseSuspendList from '@/page/case-management/CaseSuspendList.vue'
import FlowCaseChange from '@/page/case-management/CostChangeList.vue'
import CaseHandOverList from '@/page/case-management/CaseHandOverList.vue'
//归档目录
import FileDirectory from '@/page/case-management/FileDirectory.vue'
//鉴定记录
import caIdentificationRecords from '@/page/case-management/case-list/identification-records/MainPage.vue'
//案件资料交接
import CaseMaterialTransfer from '@/page/case-management/CaseMaterialTransfer.vue'
//退案
import AbortCase from '@/page/case-management/AbortCase.vue'
//报告变更
import ApplyForReportChange from '@/page/case-management/report-change/ApplyForReportChange.vue'
import ReportChangeList from '@/page/case-management/report-change/ReportChangeList.vue'
//费用减免
import ChargeDeduction from '@/page/case-management/ChargeDeductionList.vue'
import RateRelief from '@/page/case-management/case-list/RateRelief.vue'
//退费
import RefundCase from '@/page/case-management/case-list/RefundCase.vue'
//费用异动
import AmountChange from '@/page/case-management/case-list/AmountChange.vue'
//退案退费列表
import ListOfRefunds from '@/page/case-management/ListOfRefunds/index.vue'
//不予受理列表
import RefusefList from '@/page/case-management/RefusefList/index.vue'
//开票申请
import makeInvoiceApply from '@/page/case-management/make-invoice-apply/RegisterInvoiceApply.vue'
//批量开票申请
import batchMakeInvoiceApply from '@/page/case-management/make-invoice-apply/BatchInvoiceApply.vue'
//发票申请列表
import InvoiceApplyList from '@/page/case-management/make-invoice-apply/InvoiceApplyList.vue'
export default [
    //案件列表
    {
        path: '/case/case-list',
        components: {childRoute: CaseList},
        name: 'CaseList'
    },
    //案件详情
    {
        path: '/case/case-detail',
        components: {childRoute: CaseDetail},
        name: 'CaseDetail'
    },
    //登记案件
    {
        path: '/case/register',
        components: {childRoute: Register},
        name: 'Register',
    },
    //编辑案件(登记状态)
    {
        path: '/case/register/edit',
        components: {childRoute: Register},
        name: 'Edit_Register',
    },
    //受理案件
    {
        path: '/case/acceptcase',
        components: {childRoute: AcceptCase},
        name: 'AcceptCase',
    },
    //补充鉴定
    {
        path: '/case/acceptcase/case_supplement',
        components: {childRoute: AcceptCase},
        name: 'AcceptCase',
    },
    //编辑案件(受理状态)
    {
        path: '/case/acceptcase/edit',
        components: {childRoute: AcceptCase},
        name: 'Edit_AcceptCase',
    },
    //复制案件(登记)
    {
        path: '/case/register/copy',
        components: {childRoute: Register},
        name: 'Register_Copy',
    },
    //复制案件(受理)
    {
        path: '/case/accept/copy',
        components: {childRoute: AcceptCase},
        name: 'Accept_Copy',
    },
    //鉴定记录
    {
        path: '/case/auth-records',
        components: {childRoute: caIdentificationRecords},
        name: 'caIdentificationRecords',
    },
    //案件中止列表
    {
        path: '/case/case-suspend-list',
        components: {childRoute: CaseSuspendList},
        name: 'caseSuspendList'
    },
    //归档目录
    {
        path: '/case/file-directory',
        components: {childRoute: FileDirectory},
        name: 'FileDirectory'
    },
    //退案
    {
        path: '/case/abort',
        components: {childRoute: AbortCase},
        name: 'AbortCase'
    },
    //报告变更
    {
        path: '/case/report-change',
        components: {childRoute: ApplyForReportChange},
        name: 'ApplyForReportChange'
    },
    //报告变更列表
    {
        path: '/case/report-change-list',
        components: {childRoute: ReportChangeList},
        name: 'ReportChangeList'
    },
    //费用异动案件列表
    {
        path: '/case/flow-case-change',
        components: {childRoute: FlowCaseChange},
        name: 'FlowCaseChange'
    },
    //费用异动审批
    {
        path: '/case/amount-change',
        components: {childRoute: AmountChange},
        name: 'AmountChange'
    },
    //案件移交列表
    {
        path: '/case/case-hand-over-list',
        components: {childRoute: CaseHandOverList},
        name: 'CaseHandOverList'
    },
    //材料移交案件列表
    {
        path: '/case/material-transfer',
        components: {childRoute: CaseMaterialTransfer},
        name: 'CaseMaterialTransfer'
    },
    //费用减免审批
    {
        path: '/case/charge-discount',
        components: {childRoute: RateRelief},
        name: 'RateRelief'
    },
    //退费审批
    {
        path: '/case/charge-refund',
        components: {childRoute: RefundCase},
        name: 'RefundCase'
    },
    //费用减免案件列表
    {
        path: '/case/charge-deduction',
        components: {childRoute: ChargeDeduction},
        name: 'ChargeDeduction'
    },
   //退案退费列表
    {
        path:'/case/ListOfRefunds',
        components: {childRoute: ListOfRefunds},
        name: 'ListOfRefunds'
    },
   //发票申请
    {
        path:'/case/invoice-apply-list',
        components: {childRoute: InvoiceApplyList},
        name: 'InvoiceApplyList'
    },
    //不予受理案件列表
    {
        path:'/case/refusef-list',
        components: {childRoute: RefusefList},
        name: 'RefusefList'
    },
    //开票登记申请
    {
        path: '/case/make-invoice-apply',
        components: {childRoute: makeInvoiceApply},
        name: 'makeInvoiceApply',
    },
    //批量开票申请
    {
        path: '/case/batch-make-invoice-apply',
        components: {childRoute: batchMakeInvoiceApply},
        name: 'batchMakeInvoiceApply',
    },
];