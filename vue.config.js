/**
 * Created by 陈继斌 on 2018/6/3.
 */
const path = require('path')
const resolve = dir => {
    return path.join(__dirname, dir)
}
module.exports = {
    baseUrl: '/oa/',
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))// key,value自行定义，比如.set('@@', resolve('src/components'))
        config
            .plugin('html')
            .tap(args => {
                args[0].chunksSortMode = 'none'
                return args
            })
    },
    devServer: {
        // host: '192.168.18.146',
        port: 8052,
        proxy: { // 消炎 'http://192.168.15.22:8080' 孙运超 'http://192.168.17.27:80' 张瑞 'http://192.168.15.169:8080' 胡 'http://192.168.14.51:8081'
            '/oa': {
                target: 'http://192.168.15.22:8080',
                changeOrigin: true
            }
        }
    }
}
