import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login.vue'
import Home from '@/page/Home.vue'
import store from "@/store.js"

import Mydashboard from '@/page/Mydashboard.vue'

import basicData from './modules/basicData'
import caseManagement from './modules/caseManagement'
import clientManagement from './modules/clientManagement'
import processManagement from './modules/processManagement'
import staffManagement from './modules/staffManagement'
import systemSettings from './modules/systemSettings'
import templateManagement from './modules/templateManagement'
import financialManagement from './modules/financialManagement'
import mainFlow from './modules/mainFlow'
import dna from './modules/dna'
import myCenter from './modules/myCenter'
import dataStatistics from './modules/dataStatistics'
import changepwd from '@/page/my-center/ChangeMyPwdForm.vue'
//条形码
import barcode from "@/page/case-management/Barcode.vue"
import api from '@/api/index';

let v = new Vue();
Vue.use(Router);
var router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/login'

        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            redirect: '/mydashboard',
            children: [
                { path: '/mydashboard', components: { childRoute: Mydashboard }, name: 'Mydashboard', meta: { auth: true } },
                ...basicData,
                ...caseManagement,
                ...clientManagement,
                ...processManagement,
                ...staffManagement,
                ...systemSettings,
                ...templateManagement,
                ...financialManagement,
                ...mainFlow,
                ...dna,
                ...myCenter,
                ...dataStatistics,

            ]
        },{
            path:"/changepwd",
            name:"changepwd",
            component:changepwd
        },
        //条码打印
        {
            path: '/barcode/print',
            component:  barcode,
            name: 'barcode'
        }
    ]
});
router.beforeEach((to, from, next) => {
    let toPath = to.path;
    let fromPath = from.path;

    //验证用户是否登录，如未登录，跳到登录，反之。
    if (!store.state.login.isLoginType) {
        //未登录
        v.$get(api.myInfo).then(res => {
            let { data, data: { id } } = res;
            if (id && id != null) {
                //验证成功
                store.dispatch('login/loginChange', data).then(() => {
                    //用户登录成功，且需要强制修改密码时，防止用户直接更改浏览器路径绕过密码修改步骤
                    let changepwd = sessionStorage.getItem("changepwd");
                    if(changepwd && changepwd=='1'){
                        next({path:"/changepwd",replace:true});
                    }else {
                        //登录状态下，不可以跳转到登录界面
                        toPath === '/login' ? next({ path: '/mydashboard', replace: true }) : next(); 
                    }

                })
            } else {
                //验证失败
                //重定向登录 跳出循环
                to.path === '/login' ? next() : store.dispatch('login/loginChange', false).then(() => next({ path: '/login', replace: true }));
            }
        }).catch(err => {
            //验证失败
            window.localStorage.removeItem("token");
            to.path === '/login' ? next() : store.dispatch('login/loginChange', false).then(() => next({ path: '/login', replace: true }));
        })
    } else {
            //登录
            toPath === '/login' ? next({ path: '/mydashboard', replace: true }) : next();

    }
});
export default router;