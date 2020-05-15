// const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpack = require('webpack')
//plugin可以在webpack运行在某个时刻的时候帮助做一些事情
const devConfig = {
  //默认为production，打包的文件会被压缩，development则不会被压缩
  mode: 'development',
  //development模式下默认有SourceMap
  //SourceMap就是针对打包之后的文件和源文件的映射关系，
  //比如出错的时候可以马上知道原来的出错的地方
  devtool: 'cheap-module-eval-source-map',
  //inline-source-map和source-map之间的区别就是
  //inline-source-map把对应的.map文件打包到了main.js文件
  //development模式用cheap-module-eval-source-map
  //production模式用cheap-module-source-map

  //开始打包的文件
  // entry: {
  //   //打包多个文件如何配置
  //   main: './src/index.js',
  //   // sub: './src/index.js',
  // },

  //webpack-dev-server可以实时根据更改页面也更改
  //webpack 可以在node中使用,也可以在命令行中使用webpack
  //webpack-dev-server会把生成的dist目录放到内存中
  devServer: {
    //./dist目录下起一个服务器，这样可以发送请求
    contentBase: './dist',
    //自动打开浏览器
    open: true,
    //端口更改
    port: 8009,
    //proxy代理可以跨域
    // proxy: {
    //   './api':''
    // }
    //开启热更新，代码改变时页面无需重新加载重新请求
    hot: true,
    //即使hmr没有生效，浏览器也不会自动刷新
    // hotOnly: true
  },

  // module: {
  //   rules: [{
  //     test: /\.(jpg|png|gif)$/,
  //     use: {
  //       loader: 'url-loader',
  //       //placeHolder占位符约定打包出来的图片名称
  //       options: {
  //         name: '[name].[ext]',
  //         outputPath: 'images/',
  //         //超过就用file-loader的方式单独打包出来
  //         //url-loader是把图片直接以base64的形式放到bundle里面了
  //         limit: 204800
  //       }
  //     }
  //   },
  //   {
  //     //打包字体文件
  //     test: /\.(eot|ttf|avg)$/,
  //     use: {
  //       loader: 'file-loader',

  //     }
  //   },
  //   {
  //     test: /\.scss$/,
  //     //css-loader作用是把多个css文件合并，style-loader是把这些css挂载在html页面的body里面
  //     //执行顺序从下到上，从右到左
  //     use:
  //       ['style-loader',
  //         {
  //           loader: 'css-loader',
  //           options: {
  //             //一个样式文件里面引入文件，里面的文件也要走下面两个loader
  //             importLoaders: 2,
  //             //所引入的样式只会作用在样式文件所在的文件
  //             modules: true
  //           }
  //         },
  //         'sass-loader',
  //         //在使用postcss-loader之前会使用autoprefixer这个插件
  //         'postcss-loader']
  //   },
  //   {
  //     test: /\.css$/,
  //     //css-loader作用是把多个css文件合并，style-loader是把这些css挂载在html页面的body里面
  //     //执行顺序从下到上，从右到左
  //     use:
  //       ['style-loader',
  //         'css-loader',
  //         //在使用postcss-loader之前会使用autoprefixer这个插件
  //         'postcss-loader'
  //       ]
  //   },
  //   {
  //     test: /\.js$/,
  //     //exclude就是不包括这个文件里面的，也就是在这个文件里面不使用babel-loader
  //     exclude: /node_modules/,
  //     loader: "babel-loader",
  //     // options: {
  //     //   // presets: [
  //     //   //   //还安装了babel/polifill 这个是用来满足低版本浏览器不能识别某些es6语法的时候使用，可以将es6编译成es5
  //     //   //   //useBuiltIns就是只会打包本项目代码里面用到的es6语法
  //     //   //   [
  //     //   //     '@babel/preset-env',
  //     //   //     {
  //     //   //       "targets": {
  //     //   //         "chrome": "67",
  //     //   //       },
  //     //   //       useBuiltIns: 'usage'
  //     //   //     },
  //     //   //   ],
  //     //   // ]
  //     //   //@babel/preset-env只是写业务代码没有影响
  //     //   //但是写第三方插件或者组件库的时候会污染全局变量
  //     //   //就要下载@babel/plugin-transform-runtime
  //     //   "plugins": [
  //     //     [
  //     //       "@babel/plugin-transform-runtime",
  //     //       {
  //     //         "absoluteRuntime": false,
  //     //         "corejs": 2,
  //     //         "helpers": true,
  //     //         "regenerator": true,
  //     //         "useESModules": false,
  //     //         "version": "7.0.0-beta.0"
  //     //       }]
  //     //   ]
  //     // }
  //   }
  //   ]
  // },
  //HtmlWebpackPlugin会在打包结束后自动生成一个html文件，
  //并把打包生成的js自动引入到这个html文件里面


  module: {
    rules: [
      {
        test: /\.scss$/,
        use:
          ['style-loader',
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
          ['style-loader',
            'css-loader',
            'postcss-loader'
          ]
      },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
  },


  //输出文件的名字和位置
  output: {
    filename: "[name].js",
    chunkFilename: '[name].chunk.js',
  },
}

module.exports = devConfig