module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    webpackChain(chain) {
      /**
       * 如果生产环境，开启压缩
       */
      if (process.env.NODE_ENV === 'production') {
        chain.optimization.minimize(true)
      }
    },
    /**
     * 用于配置 H5 端的 webpack 配置
     * @docs https://webpack.js.org/configuration/dev-server/#devserver
     */
    devServer: {
      port: 10086
    }
  }
}