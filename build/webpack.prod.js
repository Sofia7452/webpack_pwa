//css单独打包，一般用在线上打包配置中，因为该插件不支持HMR
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//css文件压缩打包
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//一般线上才会用pwa
const WorkboxPlugin = require('workbox-webpack-plugin')
const prodConfig = {
  mode: 'production',
  // devtool: 'cheap-module-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use:
          [MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true
            }
          },
            'sass-loader',
            'postcss-loader']
      },
      {
        test: /\.css$/,
        use:
          [MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
      },
    ]
  },
  output: {
    //线上环境最好加一个[contenthash]，这样线上访问的时候就可以保证在代码改变后还去访问缓存的问题
    filename: "[name].[contenthash].js",
    chunkFilename: '[name].[contenthash].chunk.js',
  },
}
module.exports = prodConfig
