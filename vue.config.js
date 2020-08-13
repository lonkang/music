const path = require('path');//引入path模块
function resolve(dir) {
  return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('common', resolve('src/common'))
      .set('views', resolve('src/views'))
  },
  devServer: {
    open: true, //配置自动启动浏览器
    proxy: {
      '/api': {
        target: 'https://api.qq.jsososo.com',   // 需要请求的地址
        ws: true,
        secure: false,
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }  // 配置多个代理
  }
}
