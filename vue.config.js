/*
 * @Description: <page></page>页面
 * @Author: Simon Shen
 * @Date: 2021-01-05 11:24:33
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-15 09:26:58
 */
const webpack = require('webpack')
const environment = require('./build/environment')

module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env.STAGE': JSON.stringify(environment.stage),
                'process.env.LOCAL_URL': JSON.stringify(environment.localUrl)
            })
        ]
    },
    devServer: {
        public: 'local.test.com',
        port: 88,
        proxy: {
            '/api': {
                target: 'http://test.w110119.f3322.net:10446',
                changeOrigin: true,
                ws: true
            },
            '/socket': {
                target: 'http://test.w110119.f3322.net:10446', //开发
                changeOrigin: true,
                ws: true
            }
        }

    }
};