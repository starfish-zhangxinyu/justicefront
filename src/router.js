import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

var router= new Router({
    mode:'history',
    routes: [
    ]
})
// router.beforeEach((to,from,next)=>{
// // 需求登录判断

// if(to.meta.auth){
//   //未登录
//   var isLogin =localStorage.token;
//   console.log(isLogin,'6666');
//   if(isLogin!='null'){
//     console.log('已登录');
//     next();
//   }else{
//     console.log('未登录');
//     next('login');
//   }
// }else{
//   next();
// }
// next();
// });

export default router;

