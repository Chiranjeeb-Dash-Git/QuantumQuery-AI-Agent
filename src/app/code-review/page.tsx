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
  Play, AlertTriangle, XCircle, CheckCircle, Loader2, Bug, Zap, Lightbulb, Activity, Send, MessageSquareCode, Home, Copy, CheckCheck, Brain, Upload, History
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
    <div className="flex flex-col h-[calc(100vh-80px)] max-h-screen bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">AI Code Review Studio</h1>
          <Badge variant="outline" className="ml-2 font-mono text-xs">{provider}</Badge>
        </div>
        <div className="flex items-center gap-3">
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept=".ts,.tsx,.js,.jsx,.py,.java,.go,.rs,.cpp,.c"
                onChange={handleFileUpload} 
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="shadow-sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload File
            </Button>
            <Button variant="outline" onClick={toggleHistory} className="shadow-sm">
                <History className="mr-2 h-4 w-4" />
                History
            </Button>
            <Button onClick={() => handleReview()} disabled={loading || chatLoading} className="shadow-sm">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Run Full Review
            </Button>
        </div>
      </div>

      {/* Main IDE Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {historySidebarOpen && (
            <div className="absolute inset-y-0 left-0 w-80 bg-background border-r z-50 shadow-2xl flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                    <h3 className="font-semibold flex items-center gap-2"><History className="h-4 w-4" /> Review History</h3>
                    <Button variant="ghost" size="icon" onClick={() => setHistorySidebarOpen(false)}>
                        <XCircle className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {pastReviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center mt-10">No past reviews found.</p>
                    ) : (
                        pastReviews.map((rev) => (
                            <div key={rev.id} onClick={() => loadPastReview(rev)} className="p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors">
                                <p className="font-semibold text-sm truncate">{rev.project?.projectName || "Snippet"}</p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                {rev.summary && <p className="text-xs mt-2 line-clamp-2">{rev.summary}</p>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {/* Left Pane: Code Editor */}
        <div className="w-1/2 border-r flex flex-col">
            <div className="bg-muted px-4 py-2 border-b text-sm font-semibold flex justify-between items-center text-muted-foreground">
                <span>editor.ts</span>
                <span className="text-xs">Monaco Engine</span>
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
        <div className="w-1/2 flex flex-col bg-muted/20">
            <Tabs defaultValue="review" className="w-full flex flex-col h-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-4 py-6 h-auto">
                    <TabsTrigger value="review" className="data-[state=active]:bg-card rounded-md px-4 py-2"><Activity size={16} className="mr-2"/> Analysis Report</TabsTrigger>
                    <TabsTrigger value="chat" className="data-[state=active]:bg-card rounded-md px-4 py-2"><MessageSquareCode size={16} className="mr-2"/> AI Chat</TabsTrigger>
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
                                <ReviewDashboard review={currentReview} onApplyCode={setCode} />
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
                                     <div className={`max-w-[85%] p-4 rounded-xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-card border shadow-sm'}`}>
                                         {msg.role === 'user' ? (
                                             <p className="text-sm">{msg.content}</p>
                                         ) : (
                                             typeof msg.content === 'string' ? (
                                                 <p className="text-sm text-destructive">{msg.content}</p>
                                             ) : (
                                                <ReviewDashboard review={msg.content} compact onApplyCode={setCode} />
                                             )
                                         )}
                                     </div>
                                 </div>
                             ))}
                             {chatLoading && (
                                 <div className="flex justify-start">
                                     <div className="bg-card border shadow-sm p-4 rounded-xl flex items-center gap-3">
                                         <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                         <span className="text-sm text-muted-foreground">Generating better code...</span>
                                     </div>
                                 </div>
                             )}
                         </div>
                    </div>
                    <div className="p-4 bg-card border-t">
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleReview(chatPrompt); }}
                            className="flex gap-2"
                        >
                            <Input 
                                placeholder="E.g., Can you optimize this code? Or find potential null pointer errors..." 
                                value={chatPrompt}
                                onChange={(e) => setChatPrompt(e.target.value)}
                                disabled={chatLoading || loading}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={!chatPrompt.trim() || chatLoading || loading}>
                                <Send className="h-4 w-4" />
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
        <Card className="bg-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-3 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">{review.metrics?.cyclomaticComplexity}</span>
            <span className="text-xs text-muted-foreground text-center">Complexity</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-3 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">{review.metrics?.linesOfCode}</span>
            <span className="text-xs text-muted-foreground text-center">Lines</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-3 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">{review.metrics?.functions}</span>
            <span className="text-xs text-muted-foreground text-center">Functions</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-3 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">{review.metrics?.classes}</span>
            <span className="text-xs text-muted-foreground text-center">Classes</span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {review.staticAnalysis?.length > 0 && (
            <Card className="shadow-none border-dashed border-2">
                <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" /> Static Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                    <div className="space-y-2">
                        {review.staticAnalysis.map((issue, i) => (
                            <div key={i} className="flex gap-3 items-start p-2 rounded bg-muted/50">
                                {issue.type === 'error' ? (
                                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                                ) : (
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <div className="font-semibold text-xs capitalize">{issue.type} {issue.line && `at Line ${issue.line}`}</div>
                                    <div className="text-xs text-muted-foreground">{issue.message}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}

        <Card className="shadow-none border-primary/20 border-2 bg-primary/5">
            <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" /> AI Insights & Generation
                </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
                {review.chainOfThought && (
                    <div className="mb-6 p-4 rounded-lg bg-black/5 dark:bg-white/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                            <Brain className="h-4 w-4" /> Principal Architect's Analysis
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {review.chainOfThought}
                        </p>
                    </div>
                )}
                {review.aiReview?.length > 0 ? (
                    <div className="space-y-4">
                        {review.aiReview.map((item, i) => (
                            <div key={i} className="p-3 rounded-lg bg-background border space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {item.category.includes('Bug') ? <Bug className="h-3.5 w-3.5 text-destructive" /> : <Lightbulb className="h-3.5 w-3.5 text-primary" />}
                                        <span className="font-semibold text-sm">{item.category}</span>
                                    </div>
                                    <Badge variant={item.severity === 'High' ? 'destructive' : item.severity === 'Medium' ? 'default' : 'secondary'} className="text-[10px]">
                                        {item.severity}
                                    </Badge>
                                </div>
                                <p className="text-sm text-foreground">{item.description}</p>
                                <Separator className="my-2" />
                                <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                    <span className="font-semibold text-primary block mb-1">Generated Fix / Suggestion:</span>
                                    <pre className="whitespace-pre-wrap font-mono text-xs">{item.suggestion}</pre>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-muted-foreground gap-2">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        Code looks great! No issues found.
                    </div>
                )}
            </CardContent>
        </Card>

        {review.fullRefactoredCode && (
            <Card className="shadow-none border-green-500/20 border-2 bg-green-500/5">
                <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2 text-green-600">
                        <CheckCheck className="h-4 w-4" /> Full Updated Code
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => {
                                navigator.clipboard.writeText(review.fullRefactoredCode!);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                        >
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                        {onApplyCode && (
                            <Button 
                                size="sm" 
                                className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => onApplyCode(review.fullRefactoredCode!)}
                            >
                                <Play className="h-3.5 w-3.5 mr-2" />
                                Apply to Editor
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="py-2">
                    <div className="bg-background border p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs font-mono whitespace-pre-wrap">{review.fullRefactoredCode}</pre>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
