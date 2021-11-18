import Mynotice from '@/page/my-center/Mynotice.vue'

//个人信息
import MyInfoPage from '@/page/my-center/MyInfoPage.vue'
import MyInfoForm from '@/page/my-center/MyInfoForm.vue'
import MyPwdForm from '@/page/my-center/MyPwdForm.vue'
import MySignatureForm from '@/page/my-center/MySignatureForm.vue'

export default [
    {path: '/mycenter/Mynotice', components: {childRoute: Mynotice}, name: 'myNotice'},
    {
        path: '/myCenter/MyInfoPage',
        name: 'MyInfoPage',
        components: {childRoute: MyInfoPage},
        meta: {},
        children: [
            {path: '/myCenter/MyInfoForm', components: {listPage: MyInfoForm}, name: 'MyInfoForm'},
            {path: '/myCenter/MyPwdForm', components: {listPage: MyPwdForm}, name: 'MyPwdForm'},
            {path: '/myCenter/MySignatureForm', components: {listPage: MySignatureForm}, name: 'MySignatureForm'},
        ],
    },
]