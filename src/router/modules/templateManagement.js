import ReportTemplate from '@/page/template-management/ReportTemplate.vue'
import FormTemplate from '@/page/template-management/FormTemplate.vue'
import VariableManagement from '@/page/template-management/VariableManagement.vue'
export default [
    //报告模板
    {
        path:'/template/report',
        components:{childRoute:ReportTemplate},
        name:'ReportTemplate'
    },
    //表单模板
    {
        path:'/template/form',
        components:{childRoute:FormTemplate},
        name:'FormTemplate'
    },
    //变量管理
    {
        path:'/template/variable',
        components:{childRoute:VariableManagement},
        name:'VariableManagement'
    },
]