"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
<<<<<<< Updated upstream
import { Loader2, Sparkles, Brain, GitFork } from "lucide-react";
=======
import { Loader2, Sparkles, Brain, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
>>>>>>> Stashed changes
import { motion, AnimatePresence } from "framer-motion";
import { Timeline } from "@/components/Timeline";

interface Message {
  role: string;
  content: string;
  name: string | null;
}

interface CareerRealityData {
  reality_name: string;
  sdg_alignment: string[];
  timeline_phases: Array<{
    phase: string;
    action: string;
    duration: string;
  }>;
  glitches: string[];
  status: "Stable" | "Critical";
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
  const [parsedData, setParsedData] = useState<CareerRealityData | null>(null);

  const handleRunAgent = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);
    setParsedData(null);

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

      // Try to parse the JSON response
      if (data.success && data.finalResult) {
        try {
          const parsed = JSON.parse(data.finalResult);
          setParsedData(parsed);
        } catch (e) {
          console.error("Failed to parse JSON:", e);
        }
      }
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
          {/* SDG Badges at the top - Prominent Position */}
          <div className="flex gap-3 justify-center mb-6">
            <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10 px-4 py-2 text-sm font-semibold">
              🎓 SDG 4: Quality Education
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400 bg-blue-500/10 px-4 py-2 text-sm font-semibold">
              💼 SDG 8: Decent Work
            </Badge>
          </div>

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
<<<<<<< Updated upstream
          <div className="flex gap-2 justify-center mt-4">
=======
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              SDG 4: Quality Education
            </Badge>
            <Badge variant="outline" className="border-blue-500/50 text-blue-400">
              SDG 8: Decent Work
            </Badge>
>>>>>>> Stashed changes
            <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
              Next.js 16
            </Badge>
            <Badge variant="outline" className="border-purple-500/50 text-purple-400">
              TypeScript
            </Badge>
            <Badge variant="outline" className="border-pink-500/50 text-pink-400">
              Framer Motion
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

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrompt("Simulate a reality where I drop out of college and build an AI startup")}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm font-medium hover:border-yellow-400/50 transition-all duration-200 backdrop-blur-sm"
                  disabled={loading}
                >
                  ⚡ Fork: AI Startup
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrompt("Simulate a reality where I take a corporate job at a Fortune 500 company")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium hover:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                  disabled={loading}
                >
                  🎓 Fork: Corporate Job
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPrompt("Merge two realities: startup founder vs MBA student. Show me the convergence points.")}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium hover:border-purple-400/50 transition-all duration-200 backdrop-blur-sm"
                  disabled={loading}
                >
                  ⚔️ Merge: Startup vs MBA
                </motion.button>
              </div>

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
                    <GitFork className="mr-2 h-5 w-5" />
                    Fork Reality
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
              ) : parsedData ? (
                <>
                  {/* Structured JSON Display */}
                  <Card className={`backdrop-blur-sm ${
                    parsedData.status === "Critical"
                      ? "bg-red-950/30 border-red-500/50"
                      : "bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-cyan-800/50"
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-slate-100">
                          {parsedData.status === "Critical" ? (
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                          )}
                          {parsedData.reality_name}
                        </CardTitle>
                        <Badge variant="outline" className={
                          parsedData.status === "Critical"
                            ? "border-red-500/50 text-red-400"
                            : "border-green-500/50 text-green-400"
                        }>
                          {parsedData.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {parsedData.sdg_alignment.map((sdg, idx) => (
                          <Badge key={idx} variant="outline" className={
                            sdg.includes("4")
                              ? "border-green-500/50 text-green-400"
                              : "border-blue-500/50 text-blue-400"
                          }>
                            {sdg}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Timeline Phases */}
                      <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
                          📍 Timeline Milestones
                        </h3>
                        <div className="space-y-3">
                          {parsedData.timeline_phases.map((phase, idx) => (
                            <div key={idx} className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                                      Phase {idx + 1}: {phase.phase}
                                    </Badge>
                                    <span className="text-slate-500 text-sm">{phase.duration}</span>
                                  </div>
                                  <p className="text-slate-300 font-mono text-sm">{phase.action}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Glitches */}
                      {parsedData.glitches && parsedData.glitches.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                            ⚠️ Reality Glitches (Collision Check)
                          </h3>
                          <div className="space-y-2">
                            {parsedData.glitches.map((glitch, idx) => (
                              <div key={idx} className="bg-red-950/20 rounded-lg p-3 border border-red-900/30">
                                <p className="text-red-300 font-mono text-sm flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  {glitch}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

<<<<<<< Updated upstream
                  {/* Final Result */}
                  <Card className={`bg-gradient-to-br from-cyan-950/30 to-blue-950/30 backdrop-blur-sm ${response.finalResult.includes("Critical") || response.finalResult.includes("Glitches") || response.finalResult.includes("Glitched")
                    ? "border-red-500/50 glitch-effect"
                    : "border-cyan-800/50"
                    }`}>
=======
                  {/* Raw JSON View (for debugging) */}
                  <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
>>>>>>> Stashed changes
                    <CardHeader>
                      <CardTitle className="text-slate-100 text-sm">Raw JSON Output</CardTitle>
                    </CardHeader>
                    <CardContent>
<<<<<<< Updated upstream
                      {/* Timeline Component */}
                      {response.finalResult.includes("Timeline") && (
                        <div className="mb-6">
                          <Timeline
                            milestones={[
                              { id: "1", year: 2024, status: "completed", type: "education" },
                              { id: "2", year: 2025, status: "active", type: "career" },
                              { id: "3", year: 2026, status: "pending", type: "growth" },
                              { id: "4", year: 2027, status: "critical", type: "decision" },
                            ]}
                          />
                        </div>
                      )}

                      <div className={`bg-slate-950/50 rounded-lg p-6 border ${response.finalResult.includes("Critical") || response.finalResult.includes("Glitches") || response.finalResult.includes("Glitched")
                        ? "border-red-900/30"
                        : "border-cyan-900/30"
                        }`}>
                        <p className="text-slate-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                          {response.finalResult}
                        </p>
                      </div>
=======
                      <pre className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                        <code className="text-slate-300 font-mono text-xs">
                          {JSON.stringify(parsedData, null, 2)}
                        </code>
                      </pre>
>>>>>>> Stashed changes
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                      <code className="text-slate-300 font-mono text-sm whitespace-pre-wrap">
                        {response.finalResult}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
