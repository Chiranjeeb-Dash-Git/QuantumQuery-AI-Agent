"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles, Send, Brain, Shield, Zap, AlertCircle, Loader2, Trash2, History, X, ExternalLink } from "lucide-react";

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

  const handleClear = () => {
    setQuery("");
    setResult(null);
    setError(null);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
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
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to fetch from backend");
      }

      setResult(data);
      
      // Add to history
      const newHistoryItem: ChatHistoryItem = {
        id: Date.now().toString(),
        query: query,
        result: data,
        timestamp: Date.now(),
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50)); // Keep last 50 items

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-black overflow-hidden selection:bg-violet-500/30">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      
      {/* Animated Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-cyan-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px] animate-blob animation-delay-4000" />

      {/* History Sidebar/Overlay */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-md bg-zinc-950 border-l border-white/10 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-violet-400" />
                <h2 className="text-xl font-bold text-white tracking-tight">Query History</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <History className="w-6 h-6 text-zinc-600" />
                  </div>
                  <p className="text-zinc-500 text-sm font-light">No history yet. Start asking questions to see them here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => selectHistoryItem(item)}
                    className="group relative p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate mb-1">{item.query}</p>
                        <p className="text-zinc-500 text-[10px] font-mono">
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

      <main className="w-full max-w-3xl z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium tracking-wider uppercase mb-2">
            <Zap className="w-3 h-3" />
            Designed by Chiranjeeb Dash
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            AI Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Quantum</span> Query
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto font-light">
            Experience structured insights powered by Groq's lightning-fast inference.
          </p>
        </div>

        <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <Input
                placeholder="Ask your quantum question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-xl transition-all duration-300"
              />
              <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
            </div>
            <div className="flex gap-3">
              <Button 
                type="button"
                onClick={() => setShowHistory(true)}
                variant="outline"
                className="h-14 px-4 bg-white/5 border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl transition-all duration-300"
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
                className="h-14 px-8 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-violet-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:scale-100"
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

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-in zoom-in-95 duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700">
            {/* Summary Card */}
            <Card className="md:col-span-2 glass-card border-white/5 overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Brain className="w-5 h-5 text-violet-400" />
                  Insight Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-zinc-100 leading-relaxed text-lg">
                    {result.summary}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/10">
                  <p className="text-violet-200 text-sm italic">
                    "{result.short}"
                  </p>
                </div>
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Detailed Analysis</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {result.paragraph}
                  </p>
                </div>

                {result.sources && result.sources.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Sources & References</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((source: string, i: number) => (
                        <a
                          key={i}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200"
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
              <Card className="glass-card border-white/5">
                <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                  <CardTitle className="text-sm flex items-center gap-2 text-white uppercase tracking-wider">
                    <Shield className="w-4 h-4 text-cyan-400" />
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
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * result.confidence)}
                        className="text-cyan-500 transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black text-white">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-zinc-400 leading-relaxed">
                    {result.confidenceDescription}
                  </p>
                </CardContent>
              </Card>

              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Inference Speed</p>
                  <p className="text-white font-mono text-sm">Ultra-Low Latency</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 flex flex-col items-center gap-2 z-10">
        <div className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-medium">
          AI Quantum Engine • v2.0-Alpha
        </div>
        <div className="text-zinc-500 text-[11px] font-light tracking-wide">
          Designed & Created by <span className="text-zinc-300 font-medium">Chiranjeeb Dash</span>
        </div>
      </footer>
    </div>
  );
}
