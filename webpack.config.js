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
    path: path.join(__dirname, "./dist"),
    clean: true,
    library: "math",
    libraryExport: 'add',
    libraryTarget: 'umd'
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = [
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
  })
];