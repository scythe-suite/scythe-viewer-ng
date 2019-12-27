module.exports = {

  publicPath: './',

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    proxy: {
      '/r': {
        target: 'http://localhost/',
        pathRewrite: {
          '^/r': '/st/tester/r'
        }
      }
    }
  },

  lintOnSave: undefined
};