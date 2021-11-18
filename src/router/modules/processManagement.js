import ProcessManage from '@/page/process-management/ProcessManage.vue'
import ProcessUser from '@/page/process-management/ProcessUser.vue'
export default [
    //流程管理
    {
        path:'/process/manage',
        components:{childRoute:ProcessManage},
        name:'ProcessManage'
    },
    //流程用户管理
    {
        path:'/process/user',
        components:{childRoute:ProcessUser},
        name:'ProcessUser'
    },
]