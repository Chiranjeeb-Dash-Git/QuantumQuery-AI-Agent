# 🌌 Quantum AI Agent: Structured Inference Engine

![Banner](./public/banner.png)

<div align="center">
  <h3>✨ Next-Generation AI Assistant ✨</h3>
  <br />
  <a href="https://quantum-query-ai-agent.vercel.app/">
    <img src="https://img.shields.io/badge/LAUNCH-LIVE_DEMO-8B5CF6?style=for-the-badge&logoColor=white&logo=render" height="50" alt="Live Demo" />
  <a href="https://quantum-query-ai-agent-89d5md1iv-chiranjeeb-dash-gits-projects.vercel.app/">
    <img src="https://img.shields.io/badge/LAUNCH-LIVE_DEMO-000000?style=for-the-badge&logoColor=white&logo=vercel" height="50" alt="Live Demo" />
  </a>
  <br />
  <br />
  <p align="center">
    <a href="https://github.com/Chiranjeeb-Dash-Git/QuantumQuery-AI-Agent">🧬 <strong>Source Code</strong></a> • 
    <a href="https://quantumquery-ai-agent.onrender.com/">💻 <strong>Hosted App</strong></a>
    <a href="https://quantum-query-ai-agent-89d5md1iv-chiranjeeb-dash-gits-projects.vercel.app/">💻 <strong>Hosted App</strong></a>
  </p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Powered_By-Groq-orange?style=for-the-badge&logo=fastapi" alt="Groq" />
  <img src="https://img.shields.io/badge/LangChain-Integration-green?style=for-the-badge&logo=python" alt="LangChain" />
</p>

---

### **Quantum AI Agent** is a state-of-the-art multi-modal reasoning engine designed for ultra-low latency insights. Designed by **Chiranjeeb Dash**, this application leverages the lightning-fast inference of **Groq**, **OpenAI**, and **Google Gemini** through a unified **LangChain** orchestration layer.

---

## 📖 About
A full-stack Next.js & LangChain app where an AI agent autonomously performs live web searches for real-time questions (e.g., weather, news) or answers directly. It returns structured, source-backed JSON data, ensuring verifiable and reliable insights for the user.

---

## 🚀 Key Features

### 🧑‍💻 **AI Code Review Studio**
A dedicated IDE experience using the **Monaco Editor**. 
- **File Uploads**: Drag and drop or upload source files (`.ts, .py, .java`, etc.) to instantly load them into the editor.
- **Static Analysis**: Identifies unused variables, missing imports, and syntax warnings.
- **Principal Architect AI**: Leverages "Chain-of-Thought" reasoning to analyze code, find bugs, and suggest highly optimized, production-ready refactors.
- **Code Metrics**: Calculates cyclomatic complexity, lines of code, and function counts automatically.

### 🔐 **Secure Authentication & Database**
- **JWT Authentication**: Fully protected code review API endpoints and custom-built beautiful Login/Signup pages.
- **Prisma + SQLite**: A robust local database schema storing Users, Projects, Reviews, and Review Findings.
- **History Dashboard**: A sliding drawer UI that allows users to seamlessly browse, click, and reload all past AI code reviews from the database.

### ⚡ **Multi-Model Orchestration**
Switch between **Groq (Llama-3)**, **OpenAI (GPT-4o)**, and **Google (Gemini 2.0)** instantly. Each provider is optimized for structured reasoning and tool-calling using LangChain.

### 🔍 **Real-Time Web Intelligence**
Integrated with **Tavily Search**, the agent breaks through training-cutoff barriers by fetching live web data, complete with clickable sources and hostname references.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, Monaco Editor, Lucide Icons |
| **Styling** | Tailwind CSS 4, Radix UI, Motion |
| **Backend & DB** | Next.js API Routes, Prisma ORM, SQLite |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **AI Orchestration** | LangChain Core, Zod Structured Outputs |
| **AI Providers** | Groq LPU, OpenAI, Google Gemini |

---

## 📂 Project Structure

```bash
root/
├── src/
│   ├── app/          # Next.js App Router (UI & API)
│   ├── lib/ai/       # AI Reasoning Engine & Model Adapters
│   └── components/   # Premium UI Components (Shadcn)
├── public/           # Static Assets & Banner
├── .env.local        # Security Credentials
└── package.json      # Dependencies & Scripts
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- API Keys: `GROQ_API_KEY`, `TAVILY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY` (as needed).

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_key
TAVILY_API_KEY=your_key
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
```

### 4. Launch the Engine
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to witness the quantum shift.

---

## 👨‍💻 Author

**Chiranjeeb Dash**
- [LinkedIn](https://www.linkedin.com/in/chiranjeeb-dash/)
- [GitHub](https://github.com/chiranjeebdash)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>"Redefining the speed of thought."</i>
</p>
