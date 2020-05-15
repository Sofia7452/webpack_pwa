const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//lazy loading就是用了import的这部分在使用到的时候才加载
//而不是一开始就全部加载
//不需要配置
//chunk就是打包之后都是一个chunk
const commonConfig = {
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [{
      test: /\.(jpg|png|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
          limit: 204800
        }
      }
    },
    {
      test: /\.(eot|ttf|avg)$/,
      use: {
        loader: 'file-loader',
      }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
        }],
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(),
  ],
  optimization: {
    // 1.tree-shaking只支持es module的引入，不支持CommonJS
    // CommonJS是动态引入，es6 module是一种静态引入，
    // tree-shaking只支持静态引入

    //2.production只需要package.json里面写入 "sideEffects"的配置即可

    //3.development模式配置usedExports: true
    //以及package.json里面写入 "sideEffects":false,

    //4.如果代码里面需要引入import '@babel/polyfill'
    //注释：@babel/polyfill是在window里面加入一些全局变量
    //实际上没有导入任何东西，如果用tree-shaking但是又用了"sideEffects":false,
    //那么在打包的时候这一行代码就会被删除，而实际上是有用处的，这样会造成问题，所以要改成"sideEffects":true
    usedExports: true,

    //同步加载，加载时常会重叠
    // import * as _ from 'lodash'
    // let element = document.createElement('div')
    // element.innerHTML = _.min([3, 90]);
    // document.body.appendChild(element)

    //异步：加载时长不重叠（不需要在webapck配置里面设置splitChunks）
    // code Splitting
    // function getComponent() {
    //   //import 是异步加载
    //   //default:_ 针对commonJS做的兼容
    //   ///* webpackChunkName:"lodash" */是magic comments
    //   return import(/* webpackChunkName:"lodash" */'lodash').then(({ default: _ }) => {
    //     let element = document.createElement('div')
    //     element.innerHTML = _.min([3, 90]);
    //     return element
    //   })
    // }
    // getComponent().then(element => {
    //   document.body.appendChild(element)
    // })


    //总结：
    // 代码分割和webpack无关
    //webpack中的code splitting只是帮助我们不用手动实现代码分割
    // webpack中是西南代码分割，两种方式
    // 1.同步代码：只需要在webpack.common.js中做optimization的配置即可
    // 2.异步代码(import)：异步代码，无需做任何配置就可以做代码分割，但是如果配置optimization里面的参数可以做更多的配置

    splitChunks: {
      chunks: 'all',//配置选同步或异步代码进行分割
      //同步代码chunks可以是 all或者iniital
      //异步代码chunks可以是 all或者async，
      //如何打包依赖cacheGroups配置
      //默认async因为webapckr认为尽量异步的代码是比较好的，就是提高代码的利用率是好的

      //缓存带来的优化比较低，
      //最好使用异步的方式使得代码利用率变高，比如交互才出现的就用异步懒加载，
      //如果担心用的时候才加载速度慢，就用webpackPrefetch: true让代码预加载
      //webpackPrefetch和webpackPreload都是预加载
      //但是webpackPrefetch是在空闲的时候加载，
      //而webpackPreload是和当前的代码一起加载的，webpack更推荐webpackPrefetch
      //webpackPrefetch在某些浏览器可能会有兼容性问题，到时候要注意


      minSize: 30000,
      // maxSize: 0,//可配置也可以不配置
      minChunks: 1,//至少用一次就代码分割
      maxAsyncRequests: 6,//同时加载的模块最多5个
      maxInitialRequests: 4,//入口文件代码分割最多4个
      automaticNameDelimiter: '~',//文件名字连接符
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,//同时满足一个以上的条件就看优先级
          name: 'vendors'
        },
        default: {
          priority: -20,
          reuseExistingChunk: true,//一个模块被使用多次，如果已经被打包过，就不再次打包
          filename: 'common.js'
        }
      }
    },
    //老版本用
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  //不以提示性能的问题
  performance: false,
  output: {
    //如果静态资源放在cdn上（这里有问题）
    // publicPath: '/',
    //[]是占位符，多个文件需要写成占位符的形式
    // filename: "[name].js",
    //不在main.html引用，而是间接引入的就会chunkFilename这个命名配置
    // chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist')
  },
}

module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}