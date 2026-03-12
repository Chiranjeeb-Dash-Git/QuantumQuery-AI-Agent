<p align="center">⚛️ QuantumQuery AI Agent</p><p align="center"><i align="center">A sophisticated, full-stack AI orchestrator for real-time, structured insights.</i></p><p align="center"><img src="https://img.shields.io/badge/Next.js-15+-black?style=for-the-badge&logo=next.js" alt="Next.js"><img src="https://img.shields.io/badge/LangChain.js-v0.3-1C3C3C?style=for-the-badge&logo=chainlink" alt="LangChain"><img src="https://img.shields.io/badge/UI-Shadcn-black?style=for-the-badge&logo=shadcnui" alt="Shadcn"><img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render"></p>🌌 OverviewQuantumQuery is an advanced agentic system built with Next.js 15 and LangChain.js. Unlike standard chatbots, it functions as an autonomous agent that dynamically decides whether to rely on internal training data or deploy the Tavily Search API to fetch up-to-the-minute web information.✨ Key Capabilities🤖 Agentic Search: Intelligent decision-making to browse the web for real-time data (weather, news, stock trends).🔗 LCEL Core: Engineered using LangChain Expression Language for modular and highly maintainable AI chains.📋 Structured Outputs: Rigorous validation via Zod, ensuring every response includes confidence scores and detailed metadata.🕵️ Source Verification: Transparent AI; every web-assisted answer includes clickable, verified source URLs.⚡ Multi-Provider Support: Hot-swap between Groq (Llama 3.3), OpenAI (GPT-4o), and Google Gemini (2.0 Flash).🎨 Quantum UI: A sleek, futuristic "glassmorphism" interface crafted with Tailwind CSS and Shadcn/UI.🛠 Tech StackLayerTechnologyFrameworkNext.js 15+ (App Router)OrchestrationLangChain.js (v0.3)StylingTailwind CSS & Shadcn/UIInferenceGroq, OpenAI, Google GeminiSearch EngineTavily AIValidationZod⚙️ Environment VariablesTo get started, create a .env.local file in the /frontend directory and populate it with your API keys:Code snippetOPENAI_API_KEY=your_key
GROQ_API_KEY=your_key
GEMINI_API_KEY=your_key
TAVILY_API_KEY=your_key
PROVIDER=Groq
📦 Installation & SetupGet the environment up and running in minutes:Bash# 1. Clone the repository
git clone https://github.com/yourusername/quantumquery-ai.git

# 2. Navigate to the frontend directory
cd frontend

# 3. Install dependencies (using legacy peer deps for compatibility)
npm install --legacy-peer-deps

# 4. Launch the Quantum UI
npm run dev
👤 Author Chiranjeeb Dash
