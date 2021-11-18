import CaseQuantity from '@/page/report-form-statistics/CaseQuantity.vue';
import PersonnelPerformance from '@/page/report-form-statistics/PersonnelPerformance.vue';
import PersonnelPerformanceDetail from '@/page/report-form-statistics/Module/PersonnelPerformanceDetail.vue';

import Income from '@/page/report-form-statistics/Income.vue';
import CaseQuantityDetail from '@/page/report-form-statistics/CaseQuantityDetail.vue';
import IncomeDetail from '@/page/report-form-statistics/Module/IncomeDetail.vue';

import caseStatistics from '@/page/report-form-statistics/CaseStatistics.vue';

export default [
    {
        path: '/statistics/case-quantity',
        components: {childRoute: CaseQuantity},
        name: 'CaseQuantity'
    },
    {
        path: '/statistics/income',
        components: {childRoute: Income},
        name: 'Income'
    },
    {
        path: '/statistics/personnel-performance',
        components: {childRoute: PersonnelPerformance},
        name: 'PersonnelPerformance'
    },
    {
        path: '/statistics/personnelPerformanceDetail',
        components: {childRoute: PersonnelPerformanceDetail},
        name: 'PersonnelPerformanceDetail'
    },
    {
        path: '/statistics/case-quantity-detail',
        components: {childRoute: CaseQuantityDetail},
        name: 'CaseQuantityDetail'
    },
    {
        path: '/statistics/incomeDetail',
        components: {childRoute: IncomeDetail},
        name: 'IncomeDetail'
    },
    {
        path: '/statistics/case-statistics',
        components: {childRoute: caseStatistics},
        name: 'CaseStatistics'
    }
]

