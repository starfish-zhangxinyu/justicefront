import RoleManagement from '@/page/system-settings/RoleManagement.vue'
import UserManagement from '@/page/system-settings/UserManagement.vue'
import DistrictManagement from '@/page/system-settings/DistrictManagement.vue'
import SystemParameter from '@/page/system-settings/SystemParameter.vue'
import MenuManagement from '@/page/system-settings/MenuManagement.vue'
import LogQuery from '@/page/system-settings/LogQuery.vue'
import DictionaryManagement from '@/page/system-settings/DictionaryManagement.vue'
import AlcoholParameters from '@/page/system-settings/AlcoholParameters.vue'
import DivisionManagement from '@/page/system-settings/DivisionManagement.vue'
import Organization from '@/page/system-settings/Organization.vue'
import Acceptstation from '@/page/system-settings/Acceptstation.vue'
import Dynamicfield from '@/page/system-settings/Dynamicfield.vue'
import MsgManagement from "../../page/system-settings/msgManagement";
//受理表单字段列表
import AcceptFormField from '@/page/system-settings/accept-form-field/MainPage.vue'
import AcceptFormFieldList from '@/page/system-settings/accept-form-field/List.vue'

//机构管理
import orgPage from '@/page/system-settings/org-management/MainPage.vue'
import orgList from '@/page/system-settings/org-management/List.vue'
import orgForm from '@/page/system-settings/org-management/Form.vue'
//顺序号设置
import sequencePage from '@/page/system-settings/sequence-setting/MainPage.vue'
import sequenceList from '@/page/system-settings/sequence-setting/List.vue'
import sequenceForm from '@/page/system-settings/sequence-setting/Form.vue'

export default [
    //机构管理
    {
        path:'/system/org-management',
        components:{childRoute:orgPage},
        children: [
            {
                path:'/system/org-management/list',
                components:{listPage:orgList},
                name:'orgList'
            },{
                path:'/system/org-management/form',
                components:{listPage:orgForm},
                name:'orgForm'
            }
        ],
        name:'orgPage'
    },
    //顺序号设置
    {
        path:'/system/sequence-setting',
        components:{childRoute:sequencePage},
        children: [
            {
                path:'/system/sequence-setting/list',
                components:{listPage:sequenceList},
                name:'sequenceList'
            },{
                path:'/system/sequence-setting/form',
                components:{listPage:sequenceForm},
                name:'sequenceForm'
            }
        ],
        name:'sequencePage'
    },
  /*  {
        path:'system/org-management',
        components:{childRoute:orgPage},
        children: [
            {
                path:'system/org-management/list',
                components:{listPage:orgList},
                name:'orgList'
            },{
                path:'system/org-management/form',
                components:{listPage:orgForm},
                name:'orgForm'
            }
        ],
        name:'orgPage'
    },*/
    //角色管理
    {
        path:'/system/role-management',
        components:{childRoute:RoleManagement},
        name:'RoleManagement'
    },
    //用户管理
    {
        path:'/system/user-management',
        components:{childRoute:UserManagement},
        name:'UserManagement'
    },
    //部门管理
    {
        path:'/system/department',
        components:{childRoute:DivisionManagement}
        ,name:'DivisionManagement'
    },
    //区域管理
    {
        path:'/system/district-management',
        components:{childRoute:DistrictManagement},
        name:'DistrictManagement'
    },
    //机构管理
    {
        path:'/system/organization',
        components:{childRoute:Organization},
        name:'Organization'
    },
    //系统参数
    {
        path:'/system/parameter',
        components:{childRoute:SystemParameter},
        name:'SystemParameter'
    },
    //菜单管理
    {
        path:'/system/menu-management',
        components:{childRoute:MenuManagement},
        name:'MenuManagement'
    },
    //日志
    {
        path:'/system/log',
        components:{childRoute:LogQuery},
        name:'LogQuery'
    },
    //字典管理
    {
        path:'/system/dictionary-management',
        components:{childRoute:DictionaryManagement},
        name:'DictionaryManagement'
    },
    {
        path:'/system/alcohol-parameters',
        components:{childRoute:AlcoholParameters},
        name:'AlcoholParameters'
    },
    //受理地点
    {
        path:'/system/accept-station',
        components:{childRoute:Acceptstation},
        name:'Acceptstation'
    },
    //动态字段
    {
        path:'/system/dynamicfield',
        components:{childRoute:Dynamicfield},
        name:'Dynamicfield'
    },
    //受理表单字段
    {
        path:'/system/accept-form-field',
        components:{childRoute:AcceptFormField},
        name:'AcceptFormField',
        meta: {},
        children: [
            {path:'/system/accept-form-field/list',components:{listPage:AcceptFormFieldList},name:'AcceptFormFieldList'}
        ]
    },
//    消息管理
    {
        path:'/system/msg-management',
        components:{childRoute:MsgManagement},
        name:'MsgManagement',
    },
]