"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Brain, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: string;
  content: string;
  name: string | null;
}

interface AgentResponse {
  success: boolean;
  finalResult: string;
  messageHistory: Message[];
  error?: string;
  details?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AgentResponse | null>(null);

  const handleRunAgent = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data: AgentResponse = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        finalResult: "",
        messageHistory: [],
        error: "Failed to connect to agent",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              CareerMultiverse: Reality Architect
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powered by <span className="text-cyan-400 font-semibold">LangGraph</span> and{" "}
            <span className="text-purple-400 font-semibold">Groq Llama 3.3</span>
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              SDG 4: Quality Education
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              SDG 8: Decent Work
            </Badge>
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Next.js 15
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              TypeScript
            </Badge>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Define Your Career Reality
              </CardTitle>
              <CardDescription className="text-slate-400">
                Simulate career paths, fork realities, or merge timelines to explore possibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Define a reality to simulate (e.g., 'Simulate a reality where I drop out and build an AI startup')..."
                className="w-full min-h-[120px] bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent resize-none font-mono text-sm"
                disabled={loading}
              />
              <Button
                onClick={handleRunAgent}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-6 text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Agent Running...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Fork Reality ⚡
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {response.error ? (
                <Card className="bg-red-950/20 border-red-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-red-400">Error</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-red-300">{response.error}</p>
                    {response.details && (
                      <p className="text-red-400/70 text-sm mt-2">{response.details}</p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Thought Process */}
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-100">
                        <Brain className="w-5 h-5 text-purple-400" />
                        Agent Thought Process
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        Step-by-step reasoning and execution
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] w-full rounded-lg border border-slate-800 bg-slate-950/50 p-4">
                        <div className="space-y-4">
                          {response.messageHistory.map((msg, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="flex items-start gap-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    msg.role === "human"
                                      ? "border-cyan-500/50 text-cyan-400"
                                      : "border-purple-500/50 text-purple-400"
                                  }
                                >
                                  {msg.name || msg.role}
                                </Badge>
                                <div className="flex-1">
                                  <p className="text-slate-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                                    {msg.content}
                                  </p>
                                </div>
                              </div>
                              {idx < response.messageHistory.length - 1 && (
                                <Separator className="my-4 bg-slate-800" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Final Result */}
                  <Card className={`bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm ${
                    response.finalResult.includes("Glitches") || response.finalResult.includes("Glitched")
                      ? "border-red-500/50"
                      : "border-cyan-800/50"
                  }`}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-slate-100">
                        <Sparkles className="w-5 h-5 text-yellow-400" />
                        Career Reality Simulation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`bg-slate-950/50 rounded-lg p-6 border ${
                        response.finalResult.includes("Glitches") || response.finalResult.includes("Glitched")
                          ? "border-red-900/30"
                          : "border-cyan-900/30"
                      }`}>
                        <p className="text-slate-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {response.finalResult}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
