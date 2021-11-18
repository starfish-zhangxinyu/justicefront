//客户管理
import EntrustingParty from '@/page/client-management/EntrustingParty.vue'
import ExternalResources from '@/page/client-management/ExternalResources.vue'
import Personalcontact from '@/page/client-management/Personalcontact.vue'
export default [
    // 委托单位
    {
        path:'/auth/externalunits',
        components:{childRoute:EntrustingParty},
        name:'EntrustingParty'
    },
    //外部资源
    {
        path:'/auth/extresource',
        components:{childRoute:ExternalResources},
        name:'ExternalResources'
    },
    //联系人
    {
        path:'/auth/linkman',
        components:{childRoute:Personalcontact},
        name:'Personalcontact'
    },
]