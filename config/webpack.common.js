const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    main: {
      import: path.resolve(__dirname, "..", "src", "index.js"),
      // runtime: "runtime-main", // 运行时包
    },
    app: path.resolve(__dirname, "..", "src", "app.js"),
  },
  output: {
    filename: "js/[name].[contenthash:8].js", // 打包后的文件名
    chunkFilename: "js/[name].[contenthash:8].chunk.js", // 动态导入的 chunk 命名
    path: path.resolve(__dirname, "..", "dist"), // 路径必须是一个绝对路径
    clean: true,
    publicPath: "/",
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
    noParse: (content) => /jquery/.test(content), // 忽略 jQuery 模块的解析
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
      // 用 SWC 处理 JS/TS（自带多线程）
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader", // SWC 替代 Babel
        },
      },
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "less-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(sass|scss)$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      context: path.resolve(__dirname, "..", "src"), // 明确指定上下文路径
      overrideConfigFile: path.resolve(__dirname, "..", "eslint.config.js"), // 显式指定配置文件
      extensions: ["js", "ts", "jsx", "tsx"], // 检测的文件扩展名
      exclude: "node_modules", // 排除目录
      formatter: require("eslint-friendly-formatter"), // 使用友好格式化
      emitWarning: true, // 将 lint 错误显示为警告
      failOnError: isProduction, // 生产环境构建失败
    }),
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "..", "public", "index.html"),
      filename: "app.html",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
      },
      hash: true,
      chunks: ["app"],
    }),
    // 添加全局变量
    new webpack.ProvidePlugin({
      isArray: ["lodash-es", "isArray"],
    }),
    // 添加全局变量
    new webpack.DefinePlugin({
      IS_PRODUCTION: isProduction,
    }),
    // 添加静态资源
    new HtmlWebpackTagsPlugin({
      publicPath: "",
      append: false,
      tags: [
        {
          path: "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js",
          hash: true,
        },
      ],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
};
