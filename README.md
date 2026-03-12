<p align="center">⚛️ QuantumQuery AI Agent</p><p align="center"><i align="center">A sophisticated, full-stack AI orchestrator for real-time, structured insights.</i></p><p align="center"><img src="https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js" alt="Next.js"><img src="https://img.shields.io/badge/LangChain.js-v0.3-1C3C3C?style=for-the-badge&logo=chainlink" alt="LangChain"><img src="https://img.shields.io/badge/UI-Shadcn-black?style=for-the-badge&logo=shadcnui" alt="Shadcn"><img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"></p>
### QuantumQuery AI Agent 
( https://quantumquery-ai-agent.onrender.com/ )

QuantumQuery is a sophisticated, full-stack AI agent that provides real-time, structured insights by dynamically orchestrating large language models (LLMs) and web search tools. Built with Next.js 15+ and LangChain.js , it features an advanced agentic architecture where the AI autonomously decides whether to answer from internal knowledge or browse the web for up-to-the-minute information.

### 🚀 Key Features
- Agentic Search : Intelligently uses the Tavily Search API to fetch real-time data (weather, news, etc.) only when necessary.
- LCEL Core : Built using LangChain Expression Language for modular, readable, and maintainable AI chains.
- Structured Outputs : Uses Zod to ensure all AI responses follow a strict JSON schema, including confidence scores and detailed analysis.
- Source Verification : Automatically extracts and displays clickable source URLs for all web-assisted answers.
- Multi-Provider Support : Seamlessly switch between Groq (Llama 3.3) , OpenAI (GPT-4o) , and Google Gemini (2.0 Flash) .
- Quantum UI : A sleek, futuristic "glassmorphism" interface built with Tailwind CSS and Shadcn/UI .
- Persistent History : Integrated sidebar to manage and revisit previous queries using localized state management.
### 🛠️ Tech Stack
- Framework : Next.js 15+ (App Router)
- AI Orchestration : LangChain.js (v0.3)
- Styling : Tailwind CSS & Shadcn/UI
- Inference : Groq, OpenAI, Google Gemini
- Search Engine : Tavily AI
- Validation : Zod
- Deployment : Render (Server-side)
### ⚙️ Environment Variables
To run this project locally, create a .env.local file in the frontend directory:

```
OPENAI_API_KEY=your_key
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key
TAVILY_API_KEY=your_key
PROVIDER=Groq
```
### 📦 Installation & Setup
```
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev
```
Designed & Developed by Chiranjeeb Dash
