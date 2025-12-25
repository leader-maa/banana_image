# 🎨 矢量工坊 (VectorCraft AI)

> 借助 Gemini 3 Pro 的强大功能，将您的想象力转化为高质量、可缩放的矢量图形。

[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_3_Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**矢量工坊 (VectorCraft AI)** 是一款基于 Google **Gemini 3 Pro** 模型构建的高级 Web 应用程序，能够根据自然语言提示词生成可直接用于生产环境的 SVG 资产。无论您需要未来感十足的图标、极简主义的 Logo，还是复杂的矢量场景，矢量工坊都能为您处理好路径和渐变。

---

## ✨ 核心功能

- 🚀 **AI 驱动生成**：通过简单的文字描述，瞬间创作 SVG 矢量图。
- 🎨 **实时预览**：在极具质感的画布上实时渲染生成的矢量图。
- 💻 **代码提取**：一键复制原始 SVG 代码，直接在您的项目中使用。
- 📥 **即时下载**：直接将您的作品保存为 `.svg` 文件。
- 🌙 **现代暗黑 UI**：使用 Tailwind CSS 和 Lucide 图标构建的高性能、响应式界面。
- ⚡ **性能优化**：采用 React 19 和现代前端开发模式，轻量且高效。

---

## 🛠️ 技术栈

- **框架**: [React 19+](https://react.dev/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **大模型**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini 3 Pro Preview)
- **图标**: [Lucide React](https://lucide.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 快速上手

### 环境准备

运行此项目前，您需要一个 Google Gemini API 密钥。您可以在 [Google AI Studio](https://aistudio.google.com/) 免费获取。

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/vector-craft-ai.git
   cd vector-craft-ai
   ```

2. **环境变量配置**
   应用程序需要名为 `API_KEY` 的环境变量来与 Gemini API 进行交互。
   
   - 在本地开发环境中，请确保 `process.env.API_KEY` 可被访问。
   - 在部署平台（如 Vercel 或 Netlify）上，请在环境变量设置中添加 `API_KEY`。

3. **运行应用**
   本项目采用标准的 ES 模块结构。您可以使用任何本地开发服务器（如 `vite` 或 `live-server`）来启动项目。

---

## 📖 工作原理

1. **系统提示词优化**：我们为 Gemini 提供了一套专业的系统指令，强制执行严格的 SVG 语法，鼓励使用渐变和阴影，并禁止生成废话。
2. **AI 生成**：`gemini-3-pro-preview` 模型处理您的提示词，并生成相应的 XML/SVG 代码。
3. **渲染与清洗**：应用程序会对输出进行清洗，并安全地注入 DOM，实现实时预览和检查。

---

## 🤝 贡献指南

我们非常欢迎并感谢任何形式的贡献！

1. Fork 本项目
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

---

## 📄 开源协议

本项目采用 Apache-2.0 协议。详情请参阅 `LICENSE` 文件。

---

<p align="center">
  由 Gemini & React 精心打造 ❤️
</p>
