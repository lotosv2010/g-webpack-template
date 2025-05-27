const express = require('express');
const app = express();
const cors = require('cors');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const config = require('./webpack.config');

// 中间件
// const compiler = webpack(config);
// 告知 express 使用 webpack-dev-middleware，
// 以及将 webpack.config.js 配置文件作为基础配置。
// app.use(
//   webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath,
//   })
// );

app.use(cors());

app.get('/user', (req, res) => {
  res.json({ name: 'test' });
});
app.listen(6060);