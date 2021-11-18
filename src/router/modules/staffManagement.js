import StaffManage from '@/page/staff-management/StaffManage.vue'
import deviveManagement from '@/page/staff-management/deviceManagement.vue'
import standardManagement from '@/page/staff-management/standardManagement.vue'
import PlanTrainManagement from '@/page/staff-management/PlanTrainManagement.vue'
import PlanExamineManagement from '@/page/staff-management/PlanExamineManagement.vue'
import PlanControlManagement from '@/page/staff-management/PlanControlManagement.vue'
import PlanRelationManagement from '@/page/staff-management/PlanRelationManagement.vue'
import PlanSuperviseManagement from '@/page/staff-management/PlanSuperviseManagement.vue'
import identificationMaterialManagement from '@/page/staff-management/identificationMaterialManagement.vue'

export default [
    {
        //员工管理
        path:'/staff',
        components:{childRoute:StaffManage},
        name:'StaffManage'
    },
    /*{
        //设备管理
        path:'/device',
        components:{childRoute:deviveManagement},
        name:'deviveManagement'
    },
    {
        //标准管理
        path:'/standards',
        components:{childRoute:standardManagement},
        name:'standardManagement'
    },*/
    {
        //培训计划管理
        path:'/train-plan',
        components:{childRoute:PlanTrainManagement},
        name:'PlanTrainManagement'
    },
    {
        //考核计划管理
        path:'/examine-plan',
        components:{childRoute:PlanExamineManagement},
        name:'PlanExamineManagement'
    },
    {
        //质量控制计划管理
        path:'/control-plan',
        components:{childRoute:PlanControlManagement},
        name:'PlanControlManagement'
    },
    {
        //质量监督计划管理
        path:'/supervice-plan',
        components:{childRoute:PlanSuperviseManagement},
        name:'PlanSuperviseManagement'
    },
    {
        //计划关联管理
        path:'/plan-relation',
        components:{childRoute:PlanRelationManagement},
        name:'PlanRelationManagement'
    },
    {
        //鉴定资料管理
        path:'/identificationMaterial',
        components:{childRoute:identificationMaterialManagement},
        name:'identificationMaterialManagement'
    }

]