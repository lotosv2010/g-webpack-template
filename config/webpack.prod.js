const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FileManagerPlugin = require('filemanager-webpack-plugin');
const WebpackLogPlugin = require('./webpack-log-plugin');
const { EsbuildPlugin } = require('esbuild-loader');

module.exports = merge(common,{
  mode: 'production',
  devtool: 'hidden-source-map',
  watch: false,
  watchOptions: {
    ignored: '**/node_modules',
    aggregateTimeout: 300,
    poll: 1000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new EsbuildPlugin({
        target: 'es2015',
        css: true // ✅ 默认开启压缩 CSS
      })
    ],
    // 代码分割核心配置
    splitChunks: {
      chunks: 'all', // 处理所有类型的 chunk（async、initial）
      minSize: 20000, // 最小分割体积 20KB
      maxSize: 100000, // 尝试拆分大于 100KB 的 chunk
      minChunks: 1, // 至少被引用 1 次才拆分
      cacheGroups: {
        // 第三方库分组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          minSize: 0,
          priority: 10, // 优先级高于默认分组
          reuseExistingChunk: true,
        },
        // 公共模块分组
        commons: {
          name: 'commons',
          minSize: 0,
          minChunks: 2, // 至少被 2 个入口引用
          priority: 5,  // 优先级高于默认分组
          reuseExistingChunk: true,
        },
      },
    },
    // 提取 Webpack 运行时代码
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`, // 运行时包
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '..', 'src', 'doc'),
          to: path.resolve(__dirname, '..', 'dist', 'doc'),
          globOptions: {
            ignore: ['**/icon.png']
          }
        }
      ]
    }),
    new WebpackBar({
      profile: false,    // Show build duration
    }),
    new webpack.BannerPlugin({
      banner: 'This file is created by gwb'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',      // 生成静态HTML报告
      reportFilename: path.resolve(__dirname, '..', 'reports', 'index.html'), // 输出路径（相对于 output.path）
      openAnalyzer: Boolean(process.env.OPEN_ANALYZER)         // 是否自动打开浏览器
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map[query]',
      // TODO 正式上线时，append 需要修改为本地地址
      append: '\n//# sourceMappingURL=http://127.0.0.1:7070/[url]',
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            // TODO 正式上线时，destination 需要修改为正式上线的目录
            { source: './dist/**/*.map', destination: './sourcemap', options: { overwrite: true, flat: true }}
          ],
          delete: [
            './dist/**/*.map',
          ],
          archive: [
            { source: './dist', destination: './dist/dist.zip' },
          ],
        },
      },
    }),
    new WebpackLogPlugin()
  ]
});
