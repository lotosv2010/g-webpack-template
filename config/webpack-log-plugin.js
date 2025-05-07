const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

class WebpackLogPlugin {
  constructor(options = {}) {
    this.options = {
      threshold: 2 * 1024 * 1024, // 超过 2MB 的文件显示为黄色警告
      ...options
    };
    this.isFirstRun = true;
  }

  apply(compiler) {
    compiler.hooks.done.tap('WebpackLogPlugin', stats => {
      // 防止重复输出
      if (!this.isFirstRun && process.env.NODE_ENV === 'production') {
        return;
      }
      this.isFirstRun = false;

      const { assets } = stats.toJson();
      const outputPath = stats.compilation.outputOptions.path;

      // 按文件类型对文件进行分组
      const fileGroups = {
        js: [],
        css: [],
        html: [],
        images: [],
        others: []
      };

      // 格式化大小函数
      const formatSize = bytes => {
        if (bytes < 1024) {
          return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
          return (bytes / 1024).toFixed(2) + ' KB';
        } else {
          return (bytes / 1024 / 1024).toFixed(2) + ' MB';
        }
      };

      // 添加尺寸百分比指示器
      const getSizeIndicator = (size, gzipSize) => {
        const compressionRatio = Math.round((1 - gzipSize / size) * 100);
        return chalk.gray(`(压缩率: ${compressionRatio}%)`);
      };

      // 处理文件并分组
      assets.forEach(asset => {
        let filename = asset.name;
        const size = asset.size;
        const filePath = path.join(outputPath, filename);
        
        // 只处理存在的文件
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath);
          const gzippedSize = zlib.gzipSync(content).length;
          const ext = path.extname(filename).toLowerCase();
          filename = outputPath.split(path.sep).pop() + '/' + filename;

          const fileInfo = {
            filename,
            size,
            gzippedSize,
            ext
          };
          
          // 根据扩展名分组
          if (ext === '.js') {
            fileGroups.js.push(fileInfo);
          } else if (ext === '.css') {
            fileGroups.css.push(fileInfo);
          } else if (ext === '.html') {
            fileGroups.html.push(fileInfo);
          } else if (['.jpg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
            fileGroups.images.push(fileInfo);
          } else {
            fileGroups.others.push(fileInfo);
          }
        }
      });

      // 延迟输出，确保在其他输出完成后显示
      setTimeout(() => {
        // 输出结果
        console.log('\n' + chalk.bold.cyan('📦 打包输出文件统计:'));
        console.log(chalk.bold.cyan('='.repeat(100)));
        
        let totalFiles = 0;
        let totalSize = 0;
        let totalGzippedSize = 0;
        
        // 定义分组颜色和名称
        const groupConfig = [
          { name: 'JS 文件', files: fileGroups.js, color: chalk.green, icon: '📜' },
          { name: 'CSS 文件', files: fileGroups.css, color: chalk.blue, icon: '🎨' },
          { name: 'HTML 文件', files: fileGroups.html, color: chalk.magenta, icon: '📄' },
          { name: '图片文件', files: fileGroups.images, color: chalk.cyan, icon: '🖼️' },
          { name: '其他文件', files: fileGroups.others, color: chalk.white, icon: '📁' }
        ];
        
        // 遍历每个分组并输出
        groupConfig.forEach(group => {
          if (group.files.length > 0) {
            // 按大小排序
            group.files.sort((a, b) => b.size - a.size);
            
            // 计算该组文件的总大小
            const groupSize = group.files.reduce((sum, file) => sum + file.size, 0);
            const groupGzippedSize = group.files.reduce((sum, file) => sum + file.gzippedSize, 0);
            
            console.log(`\n${group.icon} ${chalk.bold(group.name)} (${group.files.length}个, 共 ${formatSize(groupSize)})`);
            console.log(chalk.dim('file'.padEnd(50) + 'size'.padEnd(15) + 'Gzipped'.padEnd(15) + 'Info'));
            console.log(chalk.dim('─'.repeat(100)));
            
            group.files.forEach(file => {
              let color = group.color;
              
              // 超过阈值显示黄色警告
              if (file.size > this.options.threshold) {
                color = chalk.yellow;
              }
              
              console.log(
                color(
                  file.filename.padEnd(50) + 
                  formatSize(file.size).padEnd(15) + 
                  formatSize(file.gzippedSize).padEnd(15)
                ) + 
                getSizeIndicator(file.size, file.gzippedSize)
              );
            });
            
            totalFiles += group.files.length;
            totalSize += groupSize;
            totalGzippedSize += groupGzippedSize;
          }
        });
        
        // 输出总计信息
        console.log('\n' + chalk.bold.cyan('='.repeat(100)));
        console.log(chalk.bold(`总计: ${totalFiles} 个文件, 总大小: ${formatSize(totalSize)}, Gzipped: ${formatSize(totalGzippedSize)}`));
        console.log(chalk.gray(`平均压缩率: ${Math.round((1 - totalGzippedSize / totalSize) * 100)}%\n`));
      }, 100);
    });
  }
}

module.exports = WebpackLogPlugin; 