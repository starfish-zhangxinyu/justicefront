import Vue from 'vue'
import App from './App'
import router from './router/index'
import './config'
import commonExport from "./assets/js/common"
import echarts from 'echarts'
//引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
//引入get post方法
import {del, get, getFormData, post, postExportJson, postFormData, postFormData2, put} from './api/http'
//公共方法
import common from './plugin/common' // 引入
//引入并使用excel插件
import JsonExcel from 'vue-json-excel'
// 引入图片压缩插件
import lrz from 'lrz'
//axios的使用
import axios from 'axios';
//lodash
import _ from 'lodash';
import VueIconFont from 'vue-icon-font'
/* font-class */
import '@/assets/iconfont/iconfont.css'
/* symbol,svg */
import '@/assets/iconfont/iconfont.js'
//引入vuex
import store from './store' //引入store
//引入公共方法
import {required} from '../static/js/Reg.js'
import rule from './utils/filter_rules'
//Fragment库
import Fragment from 'vue-fragment'
import PageBar from './page/layout/PageBar';
//表格
import Table from './components/common/Table';
//委托单位
import SelectClient from './components/common/SelectClient';
//字典表选择框
import Select from './components/common/SelectFromDict';
//试剂盒选择框
//字典表选择框
import SelectKit from './components/common/SelectFormDnaKit';
//枚举选择框
import SelectFromEnum from './components/common/SelectFromEnum';
//表格选择框
import SelectFromTable from './components/common/SelectFromTable';
//部门
import SelectDepartment from './components/common/SelectDepartment';
//表格分页查询排序
import TablePagination from './components/common/TablePagination';
//自定义时间选择
import DataPicker from "./components/common/DataPicker.vue"
// 引入粘贴板
import VueClipboard from "vue-clipboard2"


let {downFile,thisDate,findArrFn,isUploadImg} = commonExport;
Vue.prototype.$downFile=downFile;
Vue.prototype.$thisDate=thisDate;
Vue.prototype.$findArrFn=findArrFn;
Vue.prototype.$isUploadImg=isUploadImg;
Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.prototype.$post=post;
Vue.prototype.$get=get;
Vue.prototype.$put=put;
Vue.prototype.$del=del;
Vue.prototype.$postFormData=postFormData;
Vue.prototype.$postFormData2=postFormData2;
Vue.prototype.$getFormData=getFormData;
Vue.prototype.$postExportJson=postExportJson;

Vue.use(common); // 添加



VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

// // 引入ecahrs图表
// let echarts = require('echarts/lib/echarts')
// // 引入折线图等组件
// require('echarts/lib/chart/line')
// require('echarts/lib/chart/bar')
// require('echarts/lib/chart/radar')

// 引入提示框和title组件，图例
// npm i qs
Vue.component('downloadExcel', JsonExcel)


axios.defaults.withCredentials = true;
Vue.prototype.$axios=axios;
Vue.prototype._ = _;
Vue.prototype.lrz = lrz;

Vue.use(VueIconFont)
Vue.prototype.$axios=axios;

Vue.config.productionTip = false;
//创建事件车
Vue.prototype.$EventBus = new Vue();
Vue.prototype.$filter_rules=rule;
Vue.prototype.required=required;
Vue.prototype.$store = store;
/* eslint-disable no-new */
Vue.use(Fragment.Plugin);

Vue.component('PageBar', PageBar);
Vue.component('Table', Table);
Vue.component('select-client', SelectClient);
Vue.component('select-from-dict', Select);
Vue.component('select-form-kit', SelectKit);
Vue.component('select-from-enum', SelectFromEnum);
Vue.component('select-from-table', SelectFromTable);
Vue.component('select-department', SelectDepartment);
Vue.component('pagination', TablePagination);
Vue.component("DataPicker",DataPicker);

new Vue({
  el: '#app',
  router,
  store,
    render: h => h(App)
}).$mount("#app")
