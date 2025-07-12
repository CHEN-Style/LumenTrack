# LumenTrack – 一站式专注与生产力管理工具

> 你不仅需要管理任务，更需要理解注意力、情绪与思维的流动。  
> **LumenTrack** 旨在帮助你记录任务、捕捉灵感、保持专注、追踪习惯，构建高效而有意识的个人工作流。

---

## 项目进度

- 目前已完成**任务优先级矩阵**第一版的开发，您可以访问 lumen-track-gamma.vercel.app 来体验，注意请点击左下角的Task Management来体验优先级矩阵，其他功能仍在开发中
- **拖拽功能仍存在bug**：您在拖拽任务卡时，有时会遇到卡片静止在页面中无法正常回到原来的位置，请点击左下角的Refresh Page进行重置，该bug正在修复中
- 如果您想在本地部署，需要安装vscode，clone这个repo，然后在终端中输入指令npm install，安装完成后输入第二个指令，npm run dev进行本地运行，如果您有任何其他问题，可以通过我的邮箱联系我：chenstyle2022@outlook.com


## 🧠 项目概述

**LumenTrack** 是一个重前端、轻后端的生产力管理系统，包含以下核心模块：

- 🧩 **任务优先级矩阵**：基于艾森豪威尔四象限的可拖拽任务卡片系统
- ⏲️ **专注模式管理器**：结合番茄钟与分心统计，帮助提升专注力
- 💡 **灵感与笔记系统**：从“闪念记录”到完整 Markdown 笔记，支持任务联动
- 😊 **情绪记录器**：记录任务完成后的情绪状态，分析效率与心情关系
- 📈 **习惯追踪**：每日打卡并可视化展示行为趋势

本项目主要使用 React + Vite  开发，支持离线使用（基于 localStorage&IndexedDB），后续支持接入 Firebase/Supabase 实现跨设备同步。

---

## 🌟 技术亮点

| 技术点 | 描述 |
|--------|------|
| 🧭 模块化前端架构 | 每个核心功能均为独立组件模块，解耦、易维护 |
| 📦 状态管理 | 使用 React context 管理全局任务、笔记等状态数据 |
| 🧠 富文本 + Markdown 支持 | 使用 `react-markdown` 构建灵活的笔记编辑器 |
| 📊 数据可视化 | 使用 Chart.js 展示分心频率与情绪趋势图 |
| 🧩 拖拽交互 | 使用 react-beautiful-dnd 实现任务拖拽分类与排序 |
| 🗂️ 本地持久化 | 全模块支持 localStorage 自动保存用户数据 |
| ✨ 响应式设计 + 动画 | React Bits + Framer Motion 实现流畅过渡与美观布局 |

---

## 📁 项目结构概览

```bash
LumenTrack/
│
├── public/                  # 静态资源
│   └── vite.svg
│
├── src/
│   ├── assets/              # 图片等静态资源
│   │   ├── logoLight.png
│   │   ├── react.svg
│   │   └── welcomeImage.png
│   │
│   ├── compoments/          # 可复用组件（如按钮、输入框等）
│   │   └── ...              
│   │
│   ├── contexts/            # 全局状态管理
│   │   └── modeContext.jsx  # 主题/语言Context
│   │
│   ├── locales/             # 多语言文本
│   │   ├── zh-CN.js
│   │   └── en-US.js
│   │
│   ├── theme/               # 主题配置
│   │   └── theme.js         # 明暗主题变量
│   │
│   ├── page/                # 页面组件
│   │   ├── welcomePage.jsx
│   │   └── welcomePage.css
│   │
│   ├── utils/               # 工具函数
│   │   └── ...
│   │
│   ├── App.jsx              # 根组件，包裹Provider
│   ├── main.jsx             # 入口文件
│   ├── App.css
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 👨‍💻 作者 & 技术展示目的

本项目由 **Ethan Wang** 设计与开发，旨在展示：

- ⚙️ 前端组件架构设计能力
- 🧩 高交互体验的实现（拖拽、动画、图表）
- 📦 状态管理与模块解耦
- 💾 数据持久化与结构建模能力

欢迎 Fork、Star 或提出改进建议 🙌
