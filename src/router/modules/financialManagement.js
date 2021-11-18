import Invoicemanagement from '@/page/financial-management/Invoicemanagement.vue'
//其他业务收入管理
import FiOtherChargePage from '@/page/financial-management/FiOtherChargePage'
import FiOtherChargeList from '@/page/financial-management/FiOtherChargeList'
import FiOtherChargeForm from '@/page/financial-management/FiOtherChargeForm'
//收费确认管理
import FiCaseChargeList from '@/page/financial-management/FiCaseChargeList'
//发票管理
import FiInvoiceList from '@/page/financial-management/FiInvoiceList'
//其他收入关联的案件
import FiOtherChargeCaseList from '@/page/financial-management/FiOtherChargeCaseList'

export default [
    //财务管理列表
    {path: '/financial/invoice-management', components: {childRoute: Invoicemanagement}, name: 'Invoicemanagement'},
    //其他业务收入管理
    // {path: '/financial/confirm-charge', components: {childRoute: Otherincome}, name: 'Otherincome'},
    {
        path: '/fi/financial-management',
        name: 'FiOtherChargePage',
        components: {childRoute: FiOtherChargePage},
        children: [
            {
                path: '/fi/financial-management/fiOtherChargeList',
                components: {listPage: FiOtherChargeList},
                name: 'FiOtherChargeList'
            },
            {
                path: '/fi/financial-management/fiOtherChargeForm',
                components: {listPage: FiOtherChargeForm},
                name: 'FiOtherChargeForm'
            },
        ],
        meta: {}
    },
    //收费确认管理列表
    {path: '/financial/fiCaseChargeList', components: {childRoute: FiCaseChargeList}, name: 'FiCaseChargeList'},
    //发票管理列表
    {path: '/financial/fiInvoiceList', components: {childRoute: FiInvoiceList}, name: 'FiInvoiceList'},
    //其他收入关联的案件
    {
        path: '/financial/FiOtherChargeCaseList',
        components: {childRoute: FiOtherChargeCaseList},
        name: 'FiOtherChargeCaseList'
    },
]