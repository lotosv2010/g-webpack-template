const path = require('path');
const os = require('os');
const clipboardy = require('clipboardy');
const chalk = require('chalk');
const ESLintPlugin = require('eslint-webpack-plugin');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const port = 3030;

module.exports = merge(common,{
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port,
    open: false,
    client: {
      progress: false,
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:6060',
        pathRewrite: { '^/api': '' },
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname), // 明确指定上下文路径
      overrideConfigFile: path.resolve(__dirname, 'eslint.config.cjs'), // 显式指定配置文件
      extensions: ['js'], // 检测的文件扩展名
      exclude: 'node_modules', // 排除目录
      formatter: require('eslint-friendly-formatter'), // 使用友好格式化
      emitWarning: true, // 将 lint 错误显示为警告
      failOnError: process.env.NODE_ENV === 'production' // 生产环境构建失败
    }),
    new WebpackBar({
      profile: false,    // Show build duration
      reporter: {
        allDone(context) {
          if (process.env.NODE_ENV === 'development') {
            const interfaces = os.networkInterfaces();
            const ipv4 = Object.values(interfaces)
              .flat()
              .find((i) => i.family === 'IPv4' && !i.internal)?.address;
  
            const localUrl = `http://localhost:${port}`;
            const networkUrl = `http://${ipv4}:${port}`;
            
            try {
              clipboardy.writeSync(localUrl);
            } catch (err) {
              console.log('⚠️ Could not copy to clipboard');
            }
  
            console.log(`
    App running at:
    - Local:   ${chalk.cyanBright(localUrl)} (copied to clipboard)
    - Network: ${chalk.cyanBright(networkUrl)}
            `);
          }
        }
      }
    })
  ]
});