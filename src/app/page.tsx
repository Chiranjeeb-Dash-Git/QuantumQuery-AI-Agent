"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Send,
  Brain,
  Shield,
  Zap,
  AlertCircle,
  Loader2,
  Trash2,
  History,
  X,
  ExternalLink,
  Code2,
  Layers,
  MessageSquare,
  Lock,
  Activity,
  Settings,
  ChevronRight,
  Menu,
} from "lucide-react";
import Link from "next/link";

interface ChatHistoryItem {
  id: string;
  query: string;
  result: any;
  timestamp: number;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [provider, setProvider] = useState<string>("Gemini");
  const [copied, setCopied] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const chatSectionRef = useRef<HTMLElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("chat-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chat-history", JSON.stringify(history));
  }, [history]);

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setNavScrolled(scrollY > 50);
      setScrollIndicatorOpacity(Math.max(0, 1 - scrollY / 200));

      // Reveal animations
      document.querySelectorAll(".nexus-reveal").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // trigger initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResult(null);
    setError(null);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const selectHistoryItem = (item: ChatHistoryItem) => {
    setQuery(item.query);
    setResult(item.result);
    setError(null);
    setShowHistory(false);
  };

  const clearAllHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, provider }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.details || data.message || data.error || "Failed to fetch from backend"
        );
      }

      setResult(data);

      // Add to history
      const newHistoryItem: ChatHistoryItem = {
        id: Date.now().toString(),
        query: query,
        result: data,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 50));
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const scrollToChat = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen" style={{ background: "var(--obsidian)" }}>
      {/* ======== BACKGROUND LAYERS ======== */}
      <div className="nexus-grid-bg" />
      <div className="nexus-gradient-ribbons">
        <div className="nexus-ribbon nexus-ribbon-1" />
        <div className="nexus-ribbon nexus-ribbon-2" />
        <div className="nexus-ribbon nexus-ribbon-3" />
      </div>
      <div className="nexus-glow-orb nexus-glow-orb-1" />
      <div className="nexus-glow-orb nexus-glow-orb-2" />
      <div className="nexus-code-stream" style={{ left: "15%" }} />
      <div className="nexus-code-stream" style={{ left: "45%", animationDelay: "-3s" }} />
      <div className="nexus-code-stream" style={{ left: "75%", animationDelay: "-5s" }} />
      <div className="nexus-code-stream" style={{ left: "90%", animationDelay: "-2s" }} />

      {/* ======== NAVIGATION ======== */}
      <nav className={`nexus-nav ${navScrolled ? "scrolled" : ""}`}>
        <a href="#" className="nexus-nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <div className="nexus-nav-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#d4a853" strokeWidth="2" width="20" height="20">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="nexus-nav-logo-text">NEXUS</span>
        </a>

        <ul className="nexus-nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#review">Review</a></li>
          <li><a href="#chat">Chat</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#docs">Docs</a></li>
        </ul>

        <button
          className="nexus-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <button className="nexus-nav-cta" onClick={scrollToChat}>
          Get Started
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-6"
          style={{ background: "rgba(10, 10, 15, 0.95)", backdropFilter: "blur(20px)" }}
        >
          <button
            className="absolute top-5 right-5 text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          {["Features", "Review", "Chat", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium tracking-widest uppercase"
              style={{ color: "var(--platinum)" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button
            className="nexus-btn-primary mt-4"
            onClick={() => { setMobileMenuOpen(false); scrollToChat(); }}
          >
            Get Started
          </button>
        </div>
      )}

      {/* ======== MAIN CONTENT ======== */}
      <div className="relative" style={{ zIndex: 10 }}>
        {/* ======== HERO SECTION ======== */}
        <section className="nexus-hero">
          <div className="nexus-hero-left">
            <div className="nexus-hero-badge">
              <span className="dot" />
              Designed by Chiranjeeb Dash
            </div>

            <h1 className="nexus-hero-title">
              <span className="line1">The Future of Development</span>
              <span className="gold-text">
                Elevate Your<br />Codebase
              </span>
            </h1>

            <p className="nexus-hero-subtitle">
              A dual-powered AI platform combining intelligent code review with conversational
              assistance. Ship cleaner, faster, and more secure code with enterprise-grade precision.
            </p>

            <div className="nexus-status-badges">
              <div className="nexus-status-badge">
                <span className="badge-dot" />
                BUILD: PASSED
              </div>
              <div className="nexus-status-badge">
                <span className="badge-dot" />
                OPTIMIZATION: 98%
              </div>
              <div className="nexus-status-badge amber">
                <span className="badge-dot" />
                3 SUGGESTIONS
              </div>
            </div>

            <div className="nexus-hero-actions">
              <button className="nexus-btn-primary" onClick={scrollToChat}>
                <Zap className="w-4 h-4" />
                Get Started
              </button>
              <Link href="/code-review" className="nexus-btn-secondary">
                <Code2 className="w-4 h-4" />
                Code Review
              </Link>
            </div>
          </div>

          {/* Hero Right — Interface Mockup */}
          <div className="nexus-hero-right">
            <div className="nexus-interface-mockup">
              <div className="nexus-mockup-glow" />
              <div className="nexus-mockup-container">
                <div className="nexus-mockup-toolbar">
                  <div className="nexus-toolbar-dot red" />
                  <div className="nexus-toolbar-dot yellow" />
                  <div className="nexus-toolbar-dot green" />
                  <span className="nexus-toolbar-title">nexus-ai — code-review.tsx</span>
                </div>
                <div className="nexus-mockup-body">
                  {/* Chat Panel */}
                  <div className="nexus-chat-panel">
                    <div className="nexus-chat-header">
                      <div className="nexus-chat-header-icon">
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="nexus-chat-header-text">AI Assistant</span>
                    </div>

                    <div className="nexus-chat-message user" style={{ animationDelay: "0.5s" }}>
                      <span className="msg-label">You</span>
                      Review the auth middleware for vulnerabilities
                    </div>
                    <div className="nexus-chat-message ai" style={{ animationDelay: "1s" }}>
                      <span className="msg-label">Nexus AI</span>
                      Found 2 issues. JWT validation lacks expiration checks, rate limiting missing.
                    </div>
                    <div className="nexus-chat-message user" style={{ animationDelay: "1.5s" }}>
                      <span className="msg-label">You</span>
                      Suggest fixes with code examples
                    </div>
                    <div className="nexus-chat-message ai" style={{ animationDelay: "2s" }}>
                      <span className="msg-label">Nexus AI</span>
                      Applying patches now. Added expiry validation and Redis-based rate limiter.
                    </div>

                    <div className="nexus-chat-input-mock">
                      <span>Ask Nexus anything...</span>
                      <div className="cursor-blink" />
                    </div>
                  </div>

                  {/* Diff Panel */}
                  <div className="nexus-diff-panel">
                    <div className="nexus-diff-header">
                      <div className="nexus-diff-header-icon">
                        <Code2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="nexus-diff-header-text">Live Diff</span>
                    </div>

                    <div className="nexus-diff-line context" style={{ animationDelay: "0.3s" }}>
                      <span className="line-num">42</span>
                      <span className="line-content">
                        <span className="keyword">const</span>{" "}
                        <span className="fn">verifyToken</span> = (token) =&gt; {"{"}
                      </span>
                    </div>
                    <div className="nexus-diff-line removed" style={{ animationDelay: "0.5s" }}>
                      <span className="line-num">43</span>
                      <span className="line-content">
                        {"  "}<span className="keyword">return</span> jwt.<span className="fn">verify</span>(token, SECRET);
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "0.7s" }}>
                      <span className="line-num">43</span>
                      <span className="line-content">
                        {"  "}<span className="keyword">const</span> decoded = jwt.<span className="fn">verify</span>(token, SECRET);
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "0.9s" }}>
                      <span className="line-num">44</span>
                      <span className="line-content">
                        {"  "}<span className="keyword">if</span> (decoded.exp {"<"} Date.<span className="fn">now</span>() / 1000) {"{"}
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "1.1s" }}>
                      <span className="line-num">45</span>
                      <span className="line-content">
                        {"    "}<span className="keyword">throw new</span> <span className="fn">Error</span>(<span className="string">&apos;Token expired&apos;</span>);
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "1.3s" }}>
                      <span className="line-num">46</span>
                      <span className="line-content">{"  }"}</span>
                    </div>
                    <div className="nexus-diff-line added highlighted" style={{ animationDelay: "1.5s" }}>
                      <span className="line-num">47</span>
                      <span className="line-content">
                        {"  "}<span className="keyword">return</span> decoded;
                      </span>
                    </div>
                    <div className="nexus-diff-line context" style={{ animationDelay: "1.7s" }}>
                      <span className="line-num">48</span>
                      <span className="line-content">{"};"}</span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "2.1s" }}>
                      <span className="line-num">50</span>
                      <span className="line-content">
                        <span className="comment">{"// Rate limiter added"}</span>
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "2.3s" }}>
                      <span className="line-num">51</span>
                      <span className="line-content">
                        <span className="keyword">const</span> limiter = rateLimit({"{"}
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "2.5s" }}>
                      <span className="line-num">52</span>
                      <span className="line-content">
                        {"  "}windowMs: <span className="string">15 * 60 * 1000</span>,
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "2.7s" }}>
                      <span className="line-num">53</span>
                      <span className="line-content">
                        {"  "}max: <span className="string">100</span>
                      </span>
                    </div>
                    <div className="nexus-diff-line added" style={{ animationDelay: "2.9s" }}>
                      <span className="line-num">54</span>
                      <span className="line-content">{"})"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== STATS SECTION ======== */}
        <section className="nexus-stats nexus-reveal">
          <div className="nexus-stat-item">
            <div className="nexus-stat-value">98.7%</div>
            <div className="nexus-stat-label">Accuracy Rate</div>
          </div>
          <div className="nexus-stat-item">
            <div className="nexus-stat-value">2.4M</div>
            <div className="nexus-stat-label">Reviews Completed</div>
          </div>
          <div className="nexus-stat-item">
            <div className="nexus-stat-value">14ms</div>
            <div className="nexus-stat-label">Avg Response Time</div>
          </div>
          <div className="nexus-stat-item">
            <div className="nexus-stat-value">50K+</div>
            <div className="nexus-stat-label">Developers</div>
          </div>
        </section>

        {/* ======== FEATURES SECTION ======== */}
        <section className="nexus-features" id="features">
          <div className="nexus-section-label nexus-reveal">Capabilities</div>
          <h2 className="nexus-section-title nexus-reveal">
            Engineered for<br />Developer Excellence
          </h2>

          <div className="nexus-features-grid">
            <div className="nexus-feature-card nexus-reveal">
              <div className="nexus-feature-icon">
                <Layers className="w-6 h-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="nexus-feature-title">Intelligent Code Review</h3>
              <p className="nexus-feature-desc">
                AI-powered analysis that catches bugs, security vulnerabilities, and performance
                issues before they reach production.
              </p>
            </div>

            <div className="nexus-feature-card nexus-reveal">
              <div className="nexus-feature-icon">
                <MessageSquare className="w-6 h-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="nexus-feature-title">Conversational AI</h3>
              <p className="nexus-feature-desc">
                Natural language interface for codebase exploration, architecture decisions, and
                real-time debugging assistance.
              </p>
            </div>

            <div className="nexus-feature-card nexus-reveal">
              <div className="nexus-feature-icon">
                <Lock className="w-6 h-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="nexus-feature-title">Enterprise Security</h3>
              <p className="nexus-feature-desc">
                SOC 2 Type II certified with end-to-end encryption. Your code never leaves your
                infrastructure.
              </p>
            </div>

            <div className="nexus-feature-card nexus-reveal">
              <div className="nexus-feature-icon">
                <Activity className="w-6 h-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="nexus-feature-title">Real-time Metrics</h3>
              <p className="nexus-feature-desc">
                Live dashboards tracking code quality, technical debt, and team velocity with
                actionable insights.
              </p>
            </div>

            <div className="nexus-feature-card nexus-reveal">
              <div className="nexus-feature-icon">
                <Settings className="w-6 h-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="nexus-feature-title">Custom Rules Engine</h3>
              <p className="nexus-feature-desc">
                Define team-specific coding standards and let AI enforce them consistently across
                every pull request.
              </p>
            </div>

            <div className="nexus-feature-card nexus-reveal">
              <div className="nexus-feature-icon">
                <Zap className="w-6 h-6" style={{ color: "var(--gold)" }} />
              </div>
              <h3 className="nexus-feature-title">Lightning Fast</h3>
              <p className="nexus-feature-desc">
                Sub-15ms analysis powered by our proprietary inference engine. Zero impact on your
                CI/CD pipeline.
              </p>
            </div>
          </div>
        </section>

        {/* ======== AI CHAT SECTION (Preserved Functionality) ======== */}
        <section className="nexus-chat-section" id="chat" ref={chatSectionRef}>
          <div className="nexus-chat-container">
            <div className="nexus-section-label nexus-reveal">AI Engine</div>
            <h2 className="nexus-section-title nexus-reveal" style={{ marginBottom: "40px" }}>
              Quantum Query<br />Intelligence
            </h2>

            {/* Model Selector */}
            <div className="nexus-reveal" style={{ marginBottom: "24px" }}>
              <div
                className="inline-flex gap-2 p-1 rounded-xl"
                style={{
                  background: "rgba(200, 200, 208, 0.05)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {["Groq", "OpenAI", "Gemini"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setProvider(p)}
                    className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background:
                        provider === p
                          ? "linear-gradient(135deg, var(--gold), #b8922e)"
                          : "transparent",
                      color: provider === p ? "var(--obsidian)" : "rgba(200, 200, 208, 0.5)",
                      letterSpacing: "1px",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input */}
            <div className="nexus-chat-input-card nexus-reveal">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Input
                    placeholder="Ask your quantum question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-[#d4a853] focus-visible:border-[#d4a853] rounded-xl transition-all duration-300"
                  />
                  <div
                    className="absolute inset-x-0 -bottom-px h-px opacity-0 group-focus-within:opacity-100 transition-opacity"
                    style={{
                      background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setShowHistory(true)}
                    variant="outline"
                    className="h-14 px-4 bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400 hover:text-[#d4a853] rounded-xl transition-all duration-300"
                    title="View History"
                  >
                    <History className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClear}
                    variant="outline"
                    className="h-14 px-4 bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all duration-300"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 px-8 text-white font-bold rounded-xl shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:scale-100"
                    style={{
                      background: "linear-gradient(135deg, var(--gold), #b8922e)",
                      color: "var(--obsidian)",
                      boxShadow: "0 4px 20px rgba(212, 168, 83, 0.25)",
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>Analyze</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* Error Display */}
            {error && (
              <div
                className="flex items-center gap-3 p-4 rounded-xl animate-in zoom-in-95 duration-300 mt-6"
                style={{
                  background: "rgba(255, 80, 80, 0.08)",
                  border: "1px solid rgba(255, 80, 80, 0.2)",
                  color: "#ff6b6b",
                }}
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700 mt-8">
                {/* Summary Card */}
                <Card
                  className="md:col-span-2 overflow-hidden"
                  style={{
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <CardHeader
                    style={{
                      borderBottom: "1px solid var(--glass-border)",
                      background: "rgba(10, 10, 15, 0.3)",
                    }}
                  >
                    <CardTitle className="text-lg flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5" style={{ color: "var(--gold)" }} />
                        Insight Summary
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-zinc-500 hover:text-[#d4a853]"
                      >
                        {copied ? "Copied!" : "Copy Raw"}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <p className="text-zinc-100 leading-relaxed text-lg">{result.summary}</p>
                    </div>
                    <div
                      className="p-4 rounded-xl"
                      style={{
                        background: "rgba(107, 63, 160, 0.08)",
                        border: "1px solid rgba(107, 63, 160, 0.15)",
                      }}
                    >
                      <p className="text-sm italic" style={{ color: "rgba(200, 200, 208, 0.7)" }}>
                        &quot;{result.short}&quot;
                      </p>
                    </div>
                    <div className="space-y-4 pt-4">
                      <h4
                        className="text-xs font-bold uppercase"
                        style={{
                          letterSpacing: "0.2em",
                          color: "var(--gold)",
                        }}
                      >
                        Detailed Analysis
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(200, 200, 208, 0.5)" }}
                      >
                        {result.paragraph}
                      </p>
                    </div>

                    {result.sources && result.sources.length > 0 && (
                      <div
                        className="space-y-4 pt-6"
                        style={{ borderTop: "1px solid var(--glass-border)" }}
                      >
                        <h4
                          className="text-xs font-bold uppercase"
                          style={{ letterSpacing: "0.2em", color: "var(--gold)" }}
                        >
                          Sources & References
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.sources.map((source: string, i: number) => (
                            <a
                              key={i}
                              href={source}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                              style={{
                                background: "rgba(200, 200, 208, 0.05)",
                                border: "1px solid var(--glass-border)",
                                color: "rgba(200, 200, 208, 0.5)",
                              }}
                              onMouseOver={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(212, 168, 83, 0.3)";
                                (e.currentTarget as HTMLElement).style.color = "var(--gold-light)";
                              }}
                              onMouseOut={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)";
                                (e.currentTarget as HTMLElement).style.color = "rgba(200, 200, 208, 0.5)";
                              }}
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span className="max-w-[200px] truncate">
                                {(() => {
                                  try {
                                    return new URL(source).hostname;
                                  } catch {
                                    return source;
                                  }
                                })()}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Metrics Sidebar */}
                <div className="space-y-6">
                  <Card
                    style={{
                      background: "var(--glass-bg)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <CardHeader
                      style={{
                        borderBottom: "1px solid var(--glass-border)",
                        background: "rgba(10, 10, 15, 0.3)",
                      }}
                    >
                      <CardTitle className="text-sm flex items-center gap-2 text-white uppercase tracking-wider">
                        <Shield className="w-4 h-4" style={{ color: "var(--gold)" }} />
                        Accuracy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 text-center">
                      <div className="relative inline-flex">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-white/5"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="#d4a853"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - 251.2 * result.confidence}
                            className="transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-black text-white">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <p
                        className="mt-4 text-xs leading-relaxed"
                        style={{ color: "rgba(200, 200, 208, 0.4)" }}
                      >
                        {result.confidenceDescription}
                      </p>
                    </CardContent>
                  </Card>

                  <div
                    className="p-4 rounded-xl flex items-center gap-4"
                    style={{
                      border: "1px solid var(--glass-border)",
                      background: "var(--glass-bg)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(212, 168, 83, 0.1)" }}
                    >
                      <Sparkles className="w-5 h-5" style={{ color: "var(--gold)" }} />
                    </div>
                    <div>
                      <p
                        className="text-[10px] uppercase font-bold"
                        style={{ letterSpacing: "0.2em", color: "rgba(200, 200, 208, 0.4)" }}
                      >
                        Inference Speed
                      </p>
                      <p className="text-white font-mono text-sm">Ultra-Low Latency</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======== FOOTER ======== */}
        <footer className="nexus-footer">
          <span>© 2026 Nexus AI. All rights reserved.</span>
          <span>
            Designed & Created by{" "}
            <span style={{ color: "var(--gold-light)", fontWeight: 500 }}>Chiranjeeb Dash</span>
          </span>
        </footer>
      </div>

      {/* ======== SCROLL INDICATOR ======== */}
      <div className="nexus-scroll-indicator" style={{ opacity: scrollIndicatorOpacity }}>
        <div className="nexus-scroll-mouse" />
        <span>Scroll</span>
      </div>

      {/* ======== HISTORY SIDEBAR ======== */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10, 10, 15, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowHistory(false)}
          />
          <div
            className="relative w-full max-w-md p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            style={{
              background: "var(--carbon)",
              borderLeft: "1px solid var(--glass-border)",
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5" style={{ color: "var(--gold)" }} />
                <h2 className="text-xl font-bold text-white tracking-tight">Query History</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(200, 200, 208, 0.05)" }}
                  >
                    <History className="w-6 h-6 text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 text-sm font-light">
                    No history yet. Start asking questions to see them here.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectHistoryItem(item)}
                    className="group relative p-4 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      border: "1px solid var(--glass-border)",
                      background: "rgba(200, 200, 208, 0.02)",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(212, 168, 83, 0.2)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(200, 200, 208, 0.05)";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--glass-border)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(200, 200, 208, 0.02)";
                    }}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate mb-1">
                          {item.query}
                        </p>
                        <p
                          className="text-[10px] font-mono"
                          style={{ color: "rgba(200, 200, 208, 0.3)" }}
                        >
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {history.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllHistory}
                className="mt-6 w-full border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
              >
                Clear All History
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
