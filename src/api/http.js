//axios的使用
import Vue from 'vue'
import axios from 'axios';
import qs from 'qs';
let v = new Vue();
import { Message } from 'element-ui';
Vue.prototype.$message = Message;
import store from "@/store.js"
import router from "../router";
let timer = null;
// 请求超时时间
axios.defaults.timeout = 10000;
// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = store.state.moduleLogin.token;
    const token = localStorage.token;
    token && (config.headers['x-auth-token'] = token);
    return config;
  },
  error => {
    return Promise.error(error);
  })


// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve({ data: response });
    }else if (response.status === 304) {
      return Promise.reject(response);
    }else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        case 403:
          let { errMsg } = error.response.data;
          let urlArr = window.location.href.split('?');
          let href = urlArr[0].split('/').reverse()[0];
          let query = window.sessionStorage.getItem('exit') || "false";
          if (href !== "login" && query === "false") {
            clearTimeout(timer);
            timer = setTimeout(() => {
              localStorage.removeItem('token');
              store.dispatch('login/loginChange', false).then(() => {
                router.replace({
                  path: '/login'
                });
                window.location.reload();
              })
            }, 10)
          } else {
            window.sessionStorage.setItem('exit', false);
          }
          // // 清除token
          break;

        // 跳转登录页面

        case 401:
          Message({
            message: '无权限',
            duration: 1000,
            forbidClick: true
          });


          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          // setTimeout(() => {
          //   router.replace({
          //     path: '/login',
          //     query: {
          //       redirect: router.currentRoute.fullPath
          //     }
          //   });
          // }, 1000);

        // 401: 没有权限
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          Message({
            message: '你没有权限进行此操作',
            duration: 1000,
            forbidClick: true
          });

          break;
        // 404请求不存在
        case 404:
          // Message({
          //   message: '网络请求不存在',
          //   duration: 1500,
          //   forbidClick: true
          // });
          break;
        // 其他错误，直接抛出错误提示
        default:
        // Message({
        //   message: error.response.data.errMsg,
        //   duration: 1500,
        //   forbidClick: true
        // });

      }
      return Promise.reject(error.response);
    }
  }
);


export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
};

export function del(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export function put(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios.put(url, params, headers)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export function post(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, headers)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
export function postFormData(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url:url,
      data:params,
      // headers:{
      //   "Content-Type":"application/x-www-form-urlencoded"
      // }
    })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
  });
}
export function postFormData2(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url:url,
      data:params,
      responseType: "blob",
      /* headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      } */
    })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
  });
}
export function postExportJson(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url:url,
      data:params,
      responseType: "blob",
     
    })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
  });
}
export function getFormData(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method:  'get',
      url:url,
      params:params,
      responseType: "blob",
      headers:{
        "Content-Type":"application/x-www-form-urlencoded"
      }
    })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
  });
}