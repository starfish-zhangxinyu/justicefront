import axios from 'axios';
import story from "./store";

(() => {
    const urlMap = {
        local: 'http://test.w110119.f3322.net:10446', //测试版地址
        // local: 'http://192.168.66.111:8080',//连接张本地调试
        // local: 'http://192.168.66.51:8080',//连接罗本地调试
        test1: 'http://test.w110119.f3322.net:10446',
        test2: 'http://192.168.66.181:81',
        test3: 'http://192.168.1.136:80',
        test4: 'http://192.168.1.77:80',
        test5: 'http://192.168.1.78:80',
        test6: 'http://192.168.1.207:80',
        test: 'http://test.w110119.f3322.net:10446',
        prod: 'http://{subdomain}.qihelc.com',
        zhongyi: 'http://zhongyinew.qihelc.com',
        demo: 'http://demo.w110119.f3322.net:10446'
    }
    //sit,uat,prod
    let stage = process.env.STAGE;
    console.log('stage:'+stage)
    //development,production
    const nodeEnv = process.env.NODE_ENV;
    //nodeEnv为production并且stage不存在默认为生产环境
    if (nodeEnv === 'production' && !stage) {
        stage = 'prod'
    } else {
        //stage不存在默认为本地开发环境
        stage = stage || 'local'
        axios.defaults.baseURL = urlMap[stage];
    }

    //test版本用
    /*  stage = 'test'
     axios.defaults.baseURL = urlMap[stage]; */

    axios.interceptors.request.use(function (config) {
        let url = config.url;
        let baseUrl = urlMap[stage];
        if (stage === 'prod' || stage === 'test') {
            let location = window.location.href;
            let subdomain = location.substring(location.indexOf("//") + 2, location.indexOf("."));
            baseUrl = baseUrl.replace('{subdomain}', subdomain);
            axios.defaults.baseURL = baseUrl;
        }
        if (config.method == 'get' && config.params) {
            url += '?';
            let params = config.params;
            if (params['page.pageSize'] && params['page.pageSize'] == 1000) {
                config.params['page.pageSize'] = 1000000;
            }
            let keys = Object.keys(config.params);
            for (let key of keys) {
                if (!(config.params[key] === undefined || config.params[key] === null)) {
                    url += `${key}=${encodeURIComponent(config.params[key])}&`
                }
            }
            url = url.substring(0, url.length - 1);
            config.url = url;
            config.params = {};
        }
        return config;
    }, function (error) {
        // Do something with request error
        return Promise.reject(error);
    });
    axios.defaults.timeout = 100000; //全局配置请求时间
    /* axios.defaults.withCredentials = true; */
    // console.log('ip:' + urlMap[stage]);
    // console.log('route:', window.location.href);
    story.commit("barcode/barcodeBaseUrlChange", urlMap[stage]); //全局配置打印条码地址
    /*  story.commit("barcode/barcodeBaseUrlChange", 'http://new.test.kkou.cn:81');//全局配置打印条码地址 */
})()