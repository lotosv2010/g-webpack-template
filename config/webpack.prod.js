const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common,{
  mode: 'production',
  watch: false,
  watchOptions: {
    ignored: '**/node_modules',
    aggregateTimeout: 300,
    poll: 1000
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
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
    })
  ]
});
