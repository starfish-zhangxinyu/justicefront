/*
 * 主流程相关页面的路由。
 *
 * @Author: Simon Shen
 * @Date: 2019-10-18 23:13:43
 * @Last Modified by: Simon Shen
 * @Last Modified time: 2019-10-21 13:52:27
 */
//案件判断
import CaseJudgement from '@/page/main-flow/CaseJudgement.vue'
//鉴定记录
import IdentificationRecords from '@/page/main-flow/identification-records/MainPage.vue'
import ReportForm from "@/page/main-flow/ReportForm.vue";
import Signature from "@/page/main-flow/Signature.vue"
import Seal from "@/page/main-flow/Seal.vue"
import CaseOut from "@/page/main-flow/CaseOut.vue"
import CaseOutPrint from "@/page/main-flow/CaseOutPrint.vue"
import ReportGiveOut from "@/page/main-flow/ReportGiveOut.vue"
import FlowFileDirectory from "@/page/main-flow/FileDirectory.vue"
import FinancialConfirmation from "@/page/main-flow/FinancialConfirmation.vue"
//文字校对
import ReportProof from "@/page/main-flow/ReportProof.vue";
//去痕
import ReportDemark from "@/page/main-flow/ReportDemark.vue";
//归档
import ArchivedFile from "@/page/main-flow/ArchivedFile.vue";

export default [
    //案件判断
    {
        path: '/case/judge',
        components: {childRoute: CaseJudgement},
        name: 'CaseJudgement',
    },
    //财务确认
    {
        path: '/case/confirmFinancial',
        components: {childRoute: FinancialConfirmation},
        name: 'FinancialConfirmation',
    },
    //鉴定记录
    {
        path: '/main-flow/auth-records',
        components: {childRoute: IdentificationRecords},
        name: 'IdentificationRecords',
    },
    // 报告制作、审核页面
    {
        path: "/main-flow/report-form",
        name: "ReportForm",
        components: {childRoute: ReportForm},
    },
    // 文字校对页面
    {
        path: "/main-flow/report-proof",
        name: "ReportProof",
        components: {childRoute: ReportProof},
    },
    // 去痕
    {
        path: "/main-flow/report-demark",
        name: "ReportDemark",
        components: {childRoute: ReportDemark},
    },
    //签章
    {
        path: "/main-flow/signature",
        name: "Signature",
        components: {childRoute: Signature},
    },
    //骑缝章
    {
        path: "/main-flow/seal",
        name: "Seal",
        components: {childRoute: Seal},
    },
    //出案
    {
        path: "/main-flow/caseout",
        name: "CaseOut",
        components: {childRoute: CaseOut},
    },
    //出案和打印
    {
        path: "/main-flow/case-out-print",
        name: "CaseOutPrint",
        components: {childRoute: CaseOutPrint},
    },
    //报告发放
    {
        path: "/main-flow/report-giveout",
        name: "ReportGiveOut",
        components: {childRoute: ReportGiveOut},
    },
    //归档目录
    {
        path: "/main-flow/file-directory",
        name: "FlowFileDirectory",
        components: {childRoute: FlowFileDirectory},
    },
    //归档
    {
        path: "/main-flow/file",
        name: "ArchivedFile",
        components: {childRoute: ArchivedFile},
    },
];
