"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Play, AlertTriangle, XCircle, CheckCircle, Loader2, Bug, Zap, Lightbulb, Activity, Send, MessageSquareCode, Home, Copy, CheckCheck, Brain, Upload, History, Code2
} from "lucide-react";

type ReviewResult = {
  id: string;
  date: string;
  staticAnalysis: Array<{ type: "error" | "warning"; message: string; line: number | null }>;
  aiReview: Array<{ category: string; severity: "High" | "Medium" | "Low"; description: string; suggestion: string }>;
  metrics: {
    linesOfCode: number;
    cyclomaticComplexity: number;
    functions: number;
    classes: number;
  };
  chainOfThought?: string;
  fullRefactoredCode?: string;
};

export default function CodeReviewIDEPage() {
  const [code, setCode] = useState("// Paste your source code here...\n\nfunction helloWorld() {\n  console.log('Hello, World!');\n}");
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewResult | null>(null);
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: any}[]>([]);
  const [provider, setProvider] = useState<string>("Groq");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  const [pastReviews, setPastReviews] = useState<any[]>([]);

  // Load provider from localStorage if available
  useEffect(() => {
    const savedProvider = localStorage.getItem("ai-provider");
    if (savedProvider) setProvider(savedProvider);
  }, []);

  // Save provider to localStorage when changed
  useEffect(() => {
    localStorage.setItem("ai-provider", provider);
  }, [provider]);

  const handleReview = async (context?: string) => {
    if (!code.trim()) return;
    
    if (context) {
        setChatLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: context }]);
    } else {
        setLoading(true);
    }
    
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, provider, promptContext: context })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.details || data.message || data.error || "Failed to analyze code");
      }
      
      const newReview: ReviewResult = {
        ...data,
        id: Math.random().toString(36).substring(7),
        date: new Date().toISOString()
      };
      
      setCurrentReview(newReview);

      // Save to database
      fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              projectName: "Code Snippet",
              summary: "Code review",
              metrics: data.metrics,
              chainOfThought: data.chainOfThought,
              fullCode: data.fullRefactoredCode,
              findings: data.aiReview
          })
      }).then(res => {
          if (res.status === 401) {
              window.location.href = "/login";
          }
      }).catch(err => console.error("Failed to save to history", err));
      
      
      if (context) {
          setChatHistory(prev => [...prev, { role: 'ai', content: newReview }]);
          setChatPrompt("");
      }
    } catch (error: any) {
      console.error(error);
      if (context) {
          setChatHistory(prev => [...prev, { role: 'ai', content: error.message }]);
      } else {
          alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
      setChatLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        if (event.target?.result) {
            setCode(event.target.result as string);
        }
    };
    reader.readAsText(file);
  };

  const toggleHistory = async () => {
    if (!historySidebarOpen) {
        // Fetch history
        try {
            const res = await fetch("/api/reviews");
            if (res.status === 401) {
                window.location.href = "/login";
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setPastReviews(data.reviews || []);
            }
        } catch (e) {}
    }
    setHistorySidebarOpen(!historySidebarOpen);
  };

  const loadPastReview = (review: any) => {
    setCurrentReview(review);
    if (review.fullCode) setCode(review.fullCode);
    setHistorySidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-screen bg-black overflow-hidden relative selection:bg-violet-500/30">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-grid-white pointer-events-none opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
      
      {/* Animated Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-cyan-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl z-10 shadow-2xl">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mr-4">
            Code Review <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Studio</span>
          </h1>
          <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            {["Groq", "OpenAI", "Gemini"].map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                  provider === p 
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".ts,.tsx,.js,.jsx,.py,.java,.go,.rs,.cpp,.c"
                onChange={handleFileUpload} 
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white shadow-sm transition-colors">
                <Upload className="mr-2 h-4 w-4 text-cyan-400" />
                Upload File
            </Button>
            <Button variant="outline" onClick={toggleHistory} className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white shadow-sm transition-colors">
                <History className="mr-2 h-4 w-4 text-violet-400" />
                History
            </Button>
            <Button onClick={() => handleReview()} disabled={loading || chatLoading} className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-violet-500/25 transition-all">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Run Full Review
            </Button>
        </div>
      </div>

      {/* Main IDE Area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {historySidebarOpen && (
            <div className="absolute inset-y-0 left-0 w-80 bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 z-50 shadow-2xl flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-semibold flex items-center gap-2 text-white"><History className="h-4 w-4 text-violet-400" /> Review History</h3>
                    <Button variant="ghost" size="icon" onClick={() => setHistorySidebarOpen(false)} className="text-zinc-400 hover:text-white hover:bg-white/10">
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {pastReviews.length === 0 ? (
                        <p className="text-sm text-zinc-500 text-center mt-10">No past reviews found.</p>
                    ) : (
                        pastReviews.map((rev) => (
                            <div key={rev.id} onClick={() => loadPastReview(rev)} className="p-3 border border-white/5 bg-white/[0.02] rounded-xl hover:bg-white/10 hover:border-violet-500/30 cursor-pointer transition-all duration-200">
                                <p className="font-semibold text-sm text-zinc-200 truncate mb-1">{rev.project?.projectName || "Snippet"}</p>
                                <p className="text-[10px] font-mono text-zinc-500">{new Date(rev.createdAt).toLocaleString()}</p>
                                {rev.summary && <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{rev.summary}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Left Pane: Code Editor */}
        <div className="w-1/2 border-r border-white/10 flex flex-col bg-zinc-950/50 backdrop-blur-md">
            <div className="bg-white/5 px-4 py-3 border-b border-white/10 text-xs font-bold uppercase tracking-wider flex justify-between items-center text-zinc-400">
                <span className="flex items-center gap-2 text-zinc-300"><Code2 className="w-4 h-4 text-cyan-400"/> editor.ts</span>
                <span className="text-[10px] text-zinc-500">Monaco Engine</span>
            </div>
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 }
                    }}
                />
            </div>
        </div>

        {/* Right Pane: Review & Chat */}
        <div className="w-1/2 flex flex-col bg-black/60 backdrop-blur-xl">
            <Tabs defaultValue="review" className="w-full flex flex-col h-full">
                <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-white/5 px-4 py-6 h-auto gap-4">
                    <TabsTrigger value="review" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300 data-[state=active]:shadow-sm data-[state=active]:shadow-violet-500/10 data-[state=active]:border-violet-500/30 border border-transparent rounded-lg px-4 py-2 text-zinc-400 hover:text-white transition-all">
                        <Activity size={16} className="mr-2"/> Analysis Report
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 data-[state=active]:shadow-sm data-[state=active]:shadow-cyan-500/10 data-[state=active]:border-cyan-500/30 border border-transparent rounded-lg px-4 py-2 text-zinc-400 hover:text-white transition-all">
                        <MessageSquareCode size={16} className="mr-2"/> AI Chat
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="review" className="flex-1 overflow-auto p-0 m-0 data-[state=active]:flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6">
                        {!currentReview && !loading && (
                            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-60">
                                <Activity className="h-16 w-16 mb-4" />
                                <p>Click "Run Full Review" to analyze your code.</p>
                            </div>
                        )}
                        
                        {loading && (
                             <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                                <Loader2 className="h-10 w-10 mb-4 animate-spin text-primary" />
                                <p>Analyzing code structure and finding bugs...</p>
                            </div>
                        )}

                        {currentReview && !loading && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <ReviewDashboard review={currentReview!} onApplyCode={setCode} />
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="chat" className="flex-1 overflow-hidden p-0 m-0 data-[state=active]:flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6">
                         {chatHistory.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-60 text-center">
                                 <MessageSquareCode className="h-12 w-12 mb-4" />
                                 <p>Ask the AI to rewrite your code, find specific bugs, or explain how it works.</p>
                             </div>
                         )}
                         <div className="space-y-6">
                             {chatHistory.map((msg, i) => (
                                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                     <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-white/10 text-zinc-200 border border-white/10 backdrop-blur-md'}`}>
                                         {msg.role === 'user' ? (
                                             <p className="text-sm leading-relaxed">{msg.content}</p>
                                         ) : (
                                             typeof msg.content === 'string' ? (
                                                 <p className="text-sm text-red-400">{msg.content}</p>
                                             ) : (
                                                <ReviewDashboard review={msg.content} compact onApplyCode={setCode} />
                                             )
                                         )}
                                     </div>
                                 </div>
                             ))}
                             {chatLoading && (
                                 <div className="flex justify-start">
                                     <div className="max-w-[80%] rounded-2xl p-4 bg-white/5 border border-white/10 text-zinc-400 flex items-center gap-3">
                                         <Loader2 className="h-4 w-4 animate-spin" />
                                         <span className="text-sm">Generating better code...</span>
                                     </div>
                                 </div>
                             )}
                         </div>
                    </div>
                    <div className="p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/10">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleReview(chatPrompt); }}
                            className="relative flex items-center group"
                        >
                            <Input 
                                placeholder="E.g., Can you optimize this code? Or find potential null pointer errors..." 
                                value={chatPrompt}
                                onChange={(e) => setChatPrompt(e.target.value)}
                                disabled={chatLoading || loading}
                                className="pr-12 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 h-12 rounded-xl focus-visible:ring-violet-500 transition-all"
                            />
                            <Button 
                                type="submit" 
                                disabled={!chatPrompt.trim() || chatLoading || loading}
                                size="icon"
                                className="absolute right-1 top-1 bottom-1 h-10 w-10 bg-transparent hover:bg-violet-500/20 text-violet-400 disabled:opacity-50 transition-colors"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </form>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}

function ReviewDashboard({ review, compact = false, onApplyCode }: { review: ReviewResult, compact?: boolean, onApplyCode?: (code: string) => void }) {
  const [copied, setCopied] = useState(false);
  
  if (!review) return null;

  return (
    <div className={`space-y-${compact ? '4' : '6'}`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-cyan-400">{review.metrics?.linesOfCode}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Lines</span>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-violet-400">{review.metrics?.cyclomaticComplexity}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Complexity</span>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-blue-400">{review.metrics?.functions}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Functions</span>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
          <span className="text-2xl font-black text-fuchsia-400">{review.metrics?.classes}</span>
          <span className="text-[10px] uppercase font-bold text-zinc-500 mt-1 tracking-widest">Classes</span>
        </div>
      </div>

      <div className="space-y-8">
        {review.staticAnalysis?.length > 0 && (
            <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" /> Static Analysis
                </h3>
                <div className="space-y-2">
                    {review.staticAnalysis.map((issue, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            {issue.type === 'error' ? (
                                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                                <div className="font-semibold text-xs capitalize text-white">{issue.type} {issue.line && <span className="text-zinc-500 ml-1 font-mono">Line {issue.line}</span>}</div>
                                <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{issue.message}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="space-y-6">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Brain className="h-4 w-4 text-violet-400" /> Principal Architect's Analysis
            </h3>
            
            {review.chainOfThought && (
                <div className="p-5 rounded-xl bg-violet-500/5 border border-violet-500/20 shadow-inner">
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed font-light">
                        {review.chainOfThought}
                    </p>
                </div>
            )}
            
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2 pt-4">
                <Bug className="h-4 w-4 text-cyan-400" /> Code Review Findings
            </h3>
            
            {review.aiReview?.length > 0 ? (
                <div className="space-y-4">
                    {review.aiReview.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    {item.category.includes('Bug') ? <Bug className="h-4 w-4 text-red-400" /> : <Lightbulb className="h-4 w-4 text-cyan-400" />}
                                    <span className="font-bold text-sm text-white">{item.category}</span>
                                </div>
                                <Badge className={`text-[10px] uppercase tracking-widest border font-mono ${item.severity === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : item.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'}`}>
                                    {item.severity}
                                </Badge>
                            </div>
                            <p className="text-sm text-zinc-300 font-light leading-relaxed">{item.description}</p>
                            
                            <div className="mt-4 p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg">
                                <span className="font-semibold text-violet-300 block mb-1 text-xs uppercase tracking-wider">Suggested Fix</span>
                                <p className="font-mono text-xs text-violet-200/80 whitespace-pre-wrap leading-relaxed">{item.suggestion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-3 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                    <CheckCheck className="h-8 w-8 text-green-500 opacity-50" />
                    <span className="font-light tracking-wide">Code looks great! No issues found.</span>
                </div>
            )}
        </div>

        {review.fullRefactoredCode && (
            <div className="space-y-4 pt-6 border-t border-white/10 mt-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-green-400" /> Full Updated Code
                    </h3>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-[10px] uppercase tracking-wider bg-white/5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/10"
                            onClick={() => {
                                navigator.clipboard.writeText(review.fullRefactoredCode!);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                        >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            {copied ? "Copied!" : "Copy Code"}
                        </Button>
                        {onApplyCode && (
                            <Button 
                                size="sm" 
                                className="h-8 text-[10px] uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 shadow-sm"
                                onClick={() => onApplyCode(review.fullRefactoredCode!)}
                            >
                                <Play className="h-3.5 w-3.5 mr-2" />
                                Apply to Editor
                            </Button>
                        )}
                    </div>
                </div>
                <div className="p-4 bg-black/60 rounded-xl border border-white/10 overflow-x-auto shadow-inner">
                    <pre className="text-xs font-mono whitespace-pre-wrap text-zinc-300">{review.fullRefactoredCode}</pre>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
