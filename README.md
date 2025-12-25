# 🎨 VectorCraft AI

> Transform your imagination into high-quality, scalable vector graphics using the power of Gemini 3 Pro.

[![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_3_Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

VectorCraft AI is a sophisticated web application that leverages Google's **Gemini 3 Pro** model to generate production-ready SVG assets from natural language prompts. Whether you need a futuristic icon, a minimalist logo, or a complex vector scene, VectorCraft AI handles the pathing and gradients for you.

---

## ✨ Key Features

- 🚀 **AI-Powered Generation**: Instantly create SVGs from simple or complex text descriptions.
- 🎨 **Visual Preview**: Real-time rendering of generated vectors on a sleek, textured canvas.
- 💻 **Code Extraction**: One-click copying of raw SVG code for immediate use in your projects.
- 📥 **Instant Download**: Save your creations directly as `.svg` files.
- 🌙 **Modern Dark UI**: A high-performance, responsive interface built with Tailwind CSS and Lucide icons.
- ⚡ **Optimized Performance**: Lightweight architecture using ES6 modules and modern React patterns.

---

## 🛠️ Tech Stack

- **Framework**: [React 19+](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Intelligence**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini 3 Pro Preview)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

To run this application, you will need a Google Gemini API Key. You can obtain one for free at the [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vector-craft-ai.git
   cd vector-craft-ai
   ```

2. **Environment Configuration**
   The application requires an environment variable named `API_KEY` to interact with the Gemini API.
   
   - In a local development environment, ensure `process.env.API_KEY` is accessible.
   - For cloud platforms (like Vercel or Netlify), add `API_KEY` to your environment secrets.

3. **Running the App**
   This project is structured as a standard ES module-based frontend application. You can serve it using any local dev server like `vite` or `live-server`.

---

## 📖 How It Works

1. **System Prompting**: We provide Gemini with a specialized system instruction that enforces strict SVG syntax, encourages the use of gradients/shadows, and forbids conversational filler.
2. **Generation**: The `gemini-3-pro-preview` model processes your prompt and generates the corresponding XML/SVG code.
3. **Rendering**: The application cleans the output and injects the SVG into the DOM safely, allowing for real-time manipulation and inspection.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ using Gemini & React
</p>
