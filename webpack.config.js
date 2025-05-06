const path = require("path");
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
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