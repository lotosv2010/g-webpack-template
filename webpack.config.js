const path = require("path");
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");

const baseConfig = {
  mode: "development",
  devtool: 'source-map',
  entry: "./src/index.js",
  externals: [
    nodeExternals()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./lib"),
    clean: true,
    library: {
      // name: "g-npm-template", // 指定库的名称
      type: 'umd', // 指定导出的模块
      // export: ['g-npm-template', 'add']
    },
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = [
  merge(baseConfig, {
    output: {
      filename: "[name].js",
      libraryTarget: 'umd'
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name]-commonjs.js",
      libraryTarget: 'commonjs'
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name]-amd.js",
      libraryTarget: 'amd'
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name]-commonjs2.js",
      libraryTarget: 'commonjs2'
    },
  }),
  merge(baseConfig, {
    output: {
      filename: "[name]-window.js",
      libraryTarget: 'window'
    },
  }),
];