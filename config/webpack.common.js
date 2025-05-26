const path = require("path");
const os = require("os");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    main: {
      import: path.resolve(__dirname, "..", "src", "index.js"),
      runtime: "runtime-main", // 运行时包
    },
  },
  output: {
    filename: "js/[name].[contenthash:8].js", // 打包后的文件名
    path: path.resolve(__dirname, "..", "dist"), // 路径必须是一个绝对路径
    clean: true,
  },
  stats: "minimal", // 只在发生错误或新的编译开始时输出
  infrastructureLogging: {
    level: "none",
  },
  resolve: {
    // 尝试按顺序解析这些后缀名
    extensions: [".js", ".json", ".ts", ".tsx"],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      "@": path.resolve(__dirname, "..", "src"),
      "@js": path.resolve(__dirname, "..", "src", "js"),
      "@ts": path.resolve(__dirname, "..", "src", "ts"),
      "@assets": path.resolve(__dirname, "..", "src", "assets"),
    },
    // 解析目录时要使用的文件名
    mainFiles: ["index"],
  },
  module: {
    rules: [
      {
        test: /\.(svg)$/i,
        type: "asset/inline",
      },
      {
        test: /\.(jpe?g|png)$/i,
        //oneOf是一个优化选项，用于提高打包的速度
        oneOf: [
          {
            //resourceQuery是一个用于匹配请求资源的URL中查询字符中
            resourceQuery: /sizes/,
            use: [
              {
                loader: "responsive-loader",
                options: {
                  // sizes: [300, 600, 1024],
                  adapter: require("responsive-loader/sharp"),
                  outputPath: "images/",
                },
              },
            ],
          },
          {
            generator: {
              filename: "images/[name].[hash:8][ext]",
            },
            type: "asset/resource",
          },
        ],
      },
      {
        test: /\.(html)$/i,
        use: {
          loader: "html-loader",
          options: {
            minimize: true,
            sources: true,
          },
        },
      },
      {
        test: /\.(ts|tsx)$/i,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
      {
        test: require.resolve("jquery"),
        loader: "expose-loader",
        options: {
          exposes: ["$", "jQuery"],
        },
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader", // 多线程提升大型构建性能
            options: {
              workers: os.cpus().length, // 根据 CPU 调整
            },
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,   // 启用 Babel 缓存（保存在 node_modules/.cache/babel-loader）
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          !isProduction ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/i,
        use: [
          !isProduction ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(sass|scss)$/i,
        use: [
          !isProduction ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "public", "index.html"),
      filename: "index.html",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
      hash: true,
      chunks: ["main"],
    }),
    new webpack.ProvidePlugin({
      _: "lodash",
      _map: ["lodash", "map"],
    }),
    new webpack.DefinePlugin({
      IS_PRODUCTION: isProduction,
    }),
  ],
};
