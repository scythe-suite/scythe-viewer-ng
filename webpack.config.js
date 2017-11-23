var path = require('path')
var webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = require('webpack').optimize.CommonsChunkPlugin;

module.exports = {
  entry: {
    routed: './src/routed.js',
    app: './src/app.js',
    overview: './src/overview.js',
    charts: './src/charts.js',
  },
  plugins: [
      new CommonsChunkPlugin({
          name: 'common'
      }),
      new HtmlWebpackPlugin({
          inject: false,
          template: require('html-webpack-template'),
          title: 'Scythe Viewer - Routed Sessions',
          appMountId: 'app',
          filename: 'routed.html',
          chunks: ['routed', 'common']
      }),
      new HtmlWebpackPlugin({
          inject: false,
          template: require('html-webpack-template'),
          title: 'Scythe Viewer - Sessions',
          appMountId: 'app',
          filename: 'index.html',
          chunks: ['app', 'common']
      }),
      new HtmlWebpackPlugin({
          inject: false,
          template: require('html-webpack-template'),
          title: 'Scythe Viewer - Overview',
          appMountId: 'app',
          filename: 'overview.html',
          chunks: ['overview', 'common']
      }),
      new HtmlWebpackPlugin({
          inject: false,
          template: require('html-webpack-template'),
          title: 'Scythe Viewer - Charts',
          appMountId: 'app',
          filename: 'charts.html',
          chunks: ['charts', 'common']
      }),
  ],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    proxy: {
        '/r': {
            target: 'http://localhost/',
            pathRewrite: {'^/r' : '/st/tester/r'}
        }
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
