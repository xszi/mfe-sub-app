const { name } = require('./package')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  // env: {
  //   browser: true,
  //   es2021: true
  // },
  // extends: [
  //   'plugin:vue/vue3-essential',
  //   '@vue/standard',
  //   '@vue/typescript/recommended'
  // ],
  publicPath: './',
  lintOnSave: false,
  devServer: {
    port: 4000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/so': {
        target: 'http://139.159.245.209:5000', // 代理接口
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/so': ''
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .test(/.(ttf|otf|eot|woff|woff2)$/)
      .use('url-loader')
      .loader('url-loader')
      .tap(() => ({ name: '/fonts/[name].[hash:8].[ext]' }))
      .end()
  },
  configureWebpack: {
    output: {
      library: `${name}`,
      libraryTarget: 'umd', // 把子应用打包成 umd 库格式
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
}
