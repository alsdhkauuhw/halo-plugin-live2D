<h1 align="center">MiSide Live2D Plugin for Halo</h1>
<p align="center">
  <a href="https://github.com/halo-dev/halo"><img alt="Halo version" src="https://img.shields.io/badge/halo-2.21.0%2B-brightgreen?style=for-the-badge" /></a>
  <a href="https://github.com/alsdhkauuhw/halo-plugin-live2D"><img alt="Build Status" src="https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge"></a>
  <a href="https://github.com/alsdhkauuhw/halo-plugin-live2D"><img alt="Release" src="https://img.shields.io/badge/release-1.0.0-blue?style=for-the-badge"></a>
  <a href="./LICENSE"><img alt="LICENSE GPL-3.0" src="https://img.shields.io/badge/license-GPL--3.0-blue.svg?style=for-the-badge"></a>
</p>

> 为您的 Halo 博客添加可爱的米塔看板娘！ (ノ≧∇≦)ノ |

## 简介
一个为 Halo 2.0 博客系统开发的 Live2D 插件，内置《MiSide》游戏中的米塔角色模型，支持表情切换、高清渲染和主题自适应。

## 特性
- ✨ **内置米塔模型** - 来自《MiSide》的可爱角色
- 🎭 **表情切换** - 支持 6 种表情：默认、微笑、开心、悲伤、惊讶、生气
- 📱 **高清渲染** - 完美支持高 DPI 屏幕（Retina 等）
- 🎨 **主题适配** - 自动适配所有 Halo 主题，无需特殊配置
- ⚡ **性能优化** - IndexDB 缓存，第二次加载秒开
- 🛠️ **自定义工具箱** - 简洁的浮动工具栏，支持显示/隐藏和表情切换
- 📦 **配置灵活** - 支持自定义模型路径、大小、位置和表情列表

## 下载及使用说明

### 安装步骤

1. 前往 [GitHub Releases](https://github.com/alsdhkauuhw/halo-plugin-live2D/releases/latest) 下载最新版 JAR 包
2. 登录 Halo 后台，进入 **插件** 页面
3. 点击右上角 **安装插件** 按钮，上传下载的 JAR 文件
4. 启用插件
5. 刷新博客前台页面，即可在右下角看到米塔！

### 快速体验

```bash
# 通过源码构建
git clone https://github.com/alsdhkauuhw/halo-plugin-live2D.git
cd halo-plugin-live2D
./gradlew build

# JAR 包位置: build/libs/plugin-starter-1.0.0-SNAPSHOT.jar
```

## 功能说明

### 自定义工具箱

插件提供了简洁的浮动工具箱（默认位于右下角）：

- 🎯 **切换按钮** - 点击展开/收起工具面板
- 👁️ **显示/隐藏** - 控制模型的显示和隐藏
- 😊 **表情切换** - 点击按钮顺序切换所有表情

### 表情列表

| 表情名称 | Emoji | 说明 |
|---------|-------|------|
| default | 😐 | 默认表情 |
| smile | 😊 | 微笑 |
| happy | 😄 | 开心 |
| sad | 😢 | 悲伤 |
| surprised | 😲 | 惊讶 |
| angry | 😠 | 生气 |

## 自定义配置

### 修改模型大小和位置

编辑插件源码中的配置文件：

```json
// src/main/resources/static/live2d-config.json
{
  "modelPath": "/plugins/MiSide_live2d/assets/live2d/mita/3.model3.json",
  "canvasPosition": "right",    // 位置: "right" 或 "left"
  "canvasWidth": 400,            // 宽度（像素）
  "canvasHeight": 500,           // 高度（像素）
  "loadFromCache": true          // 启用缓存
}
```

修改后重新构建插件：
```bash
./gradlew build
```

### 自定义表情列表

在配置文件中添加或修改表情：

```json
{
  "expressionList": [
    {
      "name": "smile",           // 表情名称（需与 model3.json 中一致）
      "displayName": "微笑",     // 显示名称
      "emoji": "😊"              // 按钮图标
    }
    // 添加更多表情...
  ]
}
```

### 更换 Live2D 模型

1. 准备 Live2D Cubism 3.0+ 模型文件（包含 `.model3.json`、`.moc3`、纹理等）
2. 将模型文件放置在 `src/main/resources/static/live2d/your-model/` 目录
3. 修改配置文件中的 `modelPath`
4. 重新构建插件

支持的模型格式：
- Live2D Cubism 3.x 模型 (`.model3.json`)
- 包含表情文件 (`.exp3.json`)
- 包含物理文件 (`.physics3.json`)

## 技术栈

- **前端**: TypeScript + Vite + live2d-render
- **后端**: Java 17 + Spring Boot + Halo Plugin API
- **Live2D**: Cubism SDK for Web

## 开发说明

### 项目结构

```
halo-plugin-live2D/
├── src/main/
│   ├── java/                          # Java 后端代码
│   │   └── run/halo/starter/
│   │       ├── StarterPlugin.java     # 插件主类
│   │       └── Live2DHeadProcessor.java  # 脚本注入器
│   └── resources/
│       ├── plugin.yaml                # 插件元信息
│       ├── extensions/                # Halo 扩展配置
│       │   ├── live2d-head-processor.yaml
│       │   └── live2d-reverse-proxy.yaml
│       └── static/                    # 静态资源
│           ├── live2d-config.json     # 配置文件
│           ├── frontend-live2d.js     # 前端脚本
│           └── live2d/mita/           # 米塔模型文件
└── ui/                                # 前端项目
    └── src/
        ├── index.ts                   # 插件入口
        └── frontend-live2d.js         # Live2D 初始化脚本
```

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/alsdhkauuhw/halo-plugin-live2D.git
cd halo-plugin-live2D

# 安装前端依赖
cd ui
pnpm install

# 构建前端
pnpm build

# 构建插件
cd ..
./gradlew build

# 输出: build/libs/plugin-starter-1.0.0-SNAPSHOT.jar
```

### 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 常见问题

### Q: 模型不显示怎么办？
A: 请检查：
1. 插件是否已启用
2. 浏览器控制台是否有错误信息
3. 清除浏览器缓存后重试
4. 确保网络可以访问 CDN 资源

### Q: 如何调整模型大小？
A: 修改 `live2d-config.json` 中的 `canvasWidth` 和 `canvasHeight`，然后重新构建插件。

### Q: 支持移动端吗？
A: 支持，插件会自动适配移动端屏幕。

### Q: 表情切换失效？
A: 避免快速连续点击，插件有 500ms 的防抖保护。

## 鸣谢

- Live2D 模型来源于游戏《[MiSide](https://store.steampowered.com/app/2527500/MiSide/)》
- Live2D 渲染基于 [live2d-render](https://github.com/LSTM-Kirigaya/Live2dRender)
- Live2D 官方网站 [https://www.live2d.com/](https://www.live2d.com/)

## 许可证

**halo-plugin-live2D** © [Lieey](https://github.com/alsdhkauuhw)，基于 [GPL-3.0](./LICENSE) 许可证发行。

本仓库使用的 Live2D 模型版权归原游戏开发商所有，仅供学习交流使用，不得用于商业用途。

> GitHub [@alsdhkauuhw](https://github.com/alsdhkauuhw)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=alsdhkauuhw/halo-plugin-live2D&type=Date)](https://star-history.com/#alsdhkauuhw/halo-plugin-live2D&Date)

---

**如果觉得这个插件不错，请给个 ⭐ Star 支持一下吧！**
