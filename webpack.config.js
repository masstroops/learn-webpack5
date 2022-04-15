const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/entry/main.js', // 产业数据 影视城
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    // publicPath: '../dist'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/assets/js/'),
          to: 'js'
        },
        {
          from: path.resolve(__dirname, './src/assets/js/laydate/'),
          to: 'laydate'
        },
      ]
    }),
    new HtmlWebpackPlugin({
      title: '产业数据 影视城',
      template: './src/template/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace:true,    //压缩空格
        removeAttributeQuotes:true, //移除引号
        removeComments:true,        //移除注释
      },
      chunks: ['index', 'vender']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      echarts: 'echarts',
      laydate: 'laydate',
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset/resource', // 5.0内置asset可以处理资源
        generator: {
          filename:'img/[name].[hash:6][ext]'
        },
        // parser:{
        //   dataUrlCondition: {
        //     maxSize: 30*1024
        //   }
        // }
      },
      {
        test: /\.(eot|TTF|svg|woff|woff2|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename:'font/[name].[hash:3][ext]'
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'less-loader'
        ]
      },
      // html-loader 处理html中引入的资源和图片
      // 使用了html-loader之后，html-webpack-plugin的<%= %>功能就全部失效了，也就是说失去了ejs的解析能力
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  // https://blog.csdn.net/u012987546/article/details/100555672 通过CDN的方式引入一个库,并通过 webpack在项目中优化
  externals: {
    // 引入模块的名字: 该模块暴露出来的名字
    // import $ from 'jquery'
    jquery: '$',
    echarts: 'echarts',
    laydate: 'laydate',
  },
  optimization: { //优化
    splitChunks: {
      cacheGroups: { //缓存组，一个对象。它的作用在于，可以对不同的文件做不同的处理
        commons: {
          name: 'vender', //输出的名字（提出来的第三方库）
          test: /\.js/, //通过条件找到要提取的文件
          chunks: 'initial', //只对入口文件进行处理
          minChunks: 2, // 导入调用中的并行请求数为 2
        }
      }
    }
  },
  devServer: {
    port: 8000,
    open: true,
    hot: true,
    proxy: {
      '/ysc/api': {
        ws: false,
        changeOrigin: true,
        target: 'https://asset.appmans.cn',
        // target: 'http://ycsadmin.ictdog.com',
        // pathRewrite: {"^/api": "/api"} // 将/api重写为""空字符串
        pathRewrite: {"^/ysc/api": "/ysc/api"} // 将/api重写为""空字符串
      },
    }
  }
}
