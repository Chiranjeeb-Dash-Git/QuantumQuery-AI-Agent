# 🌌 Quantum AI Agent: Structured Inference Engine

![Banner](./public/banner.png)

<div align="center">
  <h3>✨ Next-Generation AI Assistant & Elite Code Reviewer ✨</h3>
  <br />
  <a href="https://quantum-query-ai-agent.vercel.app/">
    <img src="https://img.shields.io/badge/LAUNCH-LIVE_DEMO-8B5CF6?style=for-the-badge&logoColor=white&logo=render" height="50" alt="Live Demo" />
  </a>
  <a href="https://quantum-query-ai-agent-89d5md1iv-chiranjeeb-dash-gits-projects.vercel.app/">
    <img src="https://img.shields.io/badge/LAUNCH-LIVE_DEMO-000000?style=for-the-badge&logoColor=white&logo=vercel" height="50" alt="Live Demo" />
  </a>
  <br />
  <br />
  <p align="center">
    <a href="https://github.com/Chiranjeeb-Dash-Git/QuantumQuery-AI-Agent">🧬 <strong>Source Code</strong></a> • 
    <a href="https://quantum-query-ai-agent-89d5md1iv-chiranjeeb-dash-gits-projects.vercel.app/">💻 <strong>Hosted App</strong></a>
  </p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Powered_By-Gemini_&_Groq-orange?style=for-the-badge&logo=fastapi" alt="AI Providers" />
  <img src="https://img.shields.io/badge/LangChain-Integration-green?style=for-the-badge&logo=python" alt="LangChain" />
</p>

---

## 📖 About The Project

**Quantum AI Agent** is an elite, multi-modal reasoning engine and advanced Code Review Studio designed by **Chiranjeeb Dash**. 

Built to redefine developer productivity, this application provides an unparalleled, zero-friction IDE environment right in your browser. It leverages the cutting-edge capabilities of **Google Gemini**, **Groq (Llama-3)**, and **OpenAI**, orchestrating them through **LangChain** to perform deep architectural analysis, static code linting, and constructive AI feedback. 

Unlike standard chat interfaces, Quantum AI Agent strictly enforces a structured output schema, ensuring that the AI responds with highly predictable, actionable, and mathematically accurate code metrics. It adopts the persona of a highly encouraging, elite Principal Engineer—praising good practices while identifying Big-O bottlenecks and OWASP vulnerabilities.

---

## 🚀 Key Features

### 🧑‍💻 **Elite AI Code Review Studio**
- **Zero-Friction IDE**: A completely open, authentication-free environment using the **Monaco Editor**. Just drop your code and go.
- **File Uploads**: Seamlessly upload source files (`.ts, .py, .java`, etc.) directly into the editor for instant analysis.
- **Principal Architect AI**: Programmed with a strict, encouraging persona. It highlights exactly what you did perfectly, before constructively suggesting minor improvements to make your code 100% bulletproof.
- **Static Analysis & Metrics**: Automatically calculates cyclomatic complexity, lines of code, and function counts while flagging syntax errors and unused imports.

### ⚡ **Multi-Model Orchestration**
Switch instantly between **Google Gemini (Flash)**, **Groq**, and **OpenAI**. The system is dynamically wired to handle the specific rate limits and context windows of each provider natively.

### 🔍 **Structured JSON Inference**
Utilizing LangChain's `.withStructuredOutput()`, the application forces the LLMs to return complex, multi-layered reviews strictly as typed JSON objects, ensuring the UI always renders beautifully.

---

## 🧠 How I Created This Project

1. **Foundation**: I started by bootstrapping a Next.js App Router project, choosing Tailwind CSS for an ultra-modern, glassmorphic UI design.
2. **AI Integration**: I integrated `@langchain/google-genai` and `@langchain/groq` to build a unified abstraction layer. This allowed the user to effortlessly swap between AI brains on the frontend.
3. **The Code Review Engine**: I embedded the Monaco Editor to provide a true IDE feel. Then, I engineered a highly specific system prompt using Zod schemas to force the AI to return structured data (Metrics, Static Analysis, Code Smells, and Refactored Code).
4. **Persona Engineering**: I heavily iterated on the AI's prompt to ensure it didn't just act like a robot, but rather a supportive, elite senior developer that praises good architecture while catching bugs.
5. **Frictionless UX**: After initially building a complex database and JWT authentication system, I completely tore it down to provide a seamless, instant-access experience for developers without the hassle of logging in.

---

## 🚧 Challenges & Errors Faced

Building a complex AI orchestration layer came with unique modern challenges:

- **The "404 Not Found" AI Deprecation Error**: While working with the Google Generative AI integration, the application suddenly crashed with a `404 Not Found` error. After intense debugging, I discovered that the legacy `gemini-1.5` generation of models had been completely deprecated and removed by Google! **Solution**: I dynamically updated the integration to point to the `gemini-flash-latest` alias, ensuring the app always resolves to the current active endpoint.
- **Groq Rate Limiting & TPM**: Groq's LPU is incredibly fast but has extremely strict Tokens-Per-Minute (TPM) limits on the free tier, leading to `429 Too Many Requests` timeouts during large code reviews. **Solution**: I shifted the default provider to Gemini for heavy lifting, dialed in the token constraints, and implemented an automatic `maxRetries: 3` configuration with a 120-second timeout buffer to gracefully handle API hiccups.
- **Structured JSON Escaping**: Forcing LLMs to return massive blocks of refactored code inside a JSON schema often caused parsing crashes due to unescaped double quotes and newlines. **Solution**: I fortified the LangChain system prompt with absolute rules commanding the AI to strictly escape characters, ensuring flawless JSON parsing on the client side.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, Monaco Editor, Lucide Icons |
| **Styling** | Tailwind CSS 4, Radix UI, Framer Motion |
| **AI Orchestration** | LangChain Core, Zod Structured Outputs |
| **AI Providers** | Google Gemini, Groq LPU, OpenAI |
| **Deployment** | Vercel |

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- API Keys: `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` (as needed).

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
OPENAI_API_KEY=your_key
```

### 4. Launch the Engine
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to witness the quantum shift.

---

## 👨‍💻 Author

**Chiranjeeb Dash**
- [LinkedIn](https://www.linkedin.com/in/chiranjeeb-dash-)
- [GitHub](https://github.com/chiranjeebdash)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>"Redefining the speed of thought."</i>
</p>
