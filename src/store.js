/*
 * @Author: your name
 * @Date: 2021-04-12 10:06:01
 * @LastEditTime: 2021-06-21 10:40:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fundAnalysisi:\webstorm\siFaJianDing\justicefront-master\src\store.js
 */
import Vue from 'vue'
import Vuex from 'vuex'
import login from './store/login'
import acceptCase from './store/acceptCase'
import register from './store/register'
import barcode from './store/barcode'
import dataStatistics from './store/dataStatistics'
import createPersistedStore from 'vuex-persistedstate'//解决地址栏刷新按钮点击后跳转至登录页面

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        login,
        acceptCase,
        register,
        barcode,
        dataStatistics
    },
    plugins: [
        createPersistedStore()
    ]
});
export default store;