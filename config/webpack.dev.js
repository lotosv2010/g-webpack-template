const path = require("path");
const os = require("os");
const clipboardy = require("clipboardy");
const chalk = require("chalk");
const webpack = require("webpack");
const WebpackBar = require("webpackbar");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const port = 3030;

const mergedConfig = merge(common, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: path.join(__dirname, "public"),
    compress: true,
    port,
    open: false,
    client: {
      progress: false, // 显示进度
      overlay: {
        // 编译错误时浏览器全屏覆盖
        errors: true,
        warnings: false,
      },
    },
    hot: true, // 开启热更新
    proxy: [
      {
        context: ["/api"],
        target: "http://localhost:6060",
        pathRewrite: { "^/api": "" },
      },
    ],
  },
  cache: {
    type: "filesystem", // 使用文件缓存
    name: "webpack-cache", // 可选：多个构建配置时用于区分缓存目录
    version: "1.0", // 可选：更改版本号可以手动让缓存失效
    buildDependencies: {
      config: [__filename], // 追踪配置文件依赖
      tsconfig: [
        // 可选：追踪 ts 配置变化
        path.resolve(__dirname, "tsconfig.json"),
      ],
    },
  },
  plugins: [
    new WebpackBar({
      profile: false, // Show build duration
      reporter: {
        allDone() {
          if (process.env.NODE_ENV === "development") {
            const interfaces = os.networkInterfaces();
            const ipv4 = Object.values(interfaces)
              .flat()
              .find((i) => i.family === "IPv4" && !i.internal)?.address;

            const localUrl = `http://localhost:${port}`;
            const networkUrl = `http://${ipv4}:${port}`;

            try {
              clipboardy.writeSync(localUrl);
            } catch {
              console.log("⚠️ Could not copy to clipboard");
            }

            console.log(`
    App running at:
    - Local:   ${chalk.cyanBright(localUrl)} (copied to clipboard)
    - Network: ${chalk.cyanBright(networkUrl)}
            `);
          }
        },
      },
    }),
    // 模块热替换的插件
    new webpack.HotModuleReplacementPlugin(),
  ],
});

module.exports = mergedConfig;
