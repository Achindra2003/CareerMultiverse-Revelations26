"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Brain, GitFork, AlertTriangle, CheckCircle2, User, Save, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CareerProfileForm } from "@/components/CareerProfileForm";
import { RealitySidebar } from "@/components/RealitySidebar";
import { ComparisonView } from "@/components/ComparisonView";
import { MergeDialog } from "@/components/MergeDialog";
import { 
  CareerRealityData, 
  CareerProfile, 
  SavedReality,
  saveReality, 
  getProfile,
  getRealityById 
} from "@/lib/storage";
import { mergeRealities, Conflict, ConflictResolution } from "@/lib/merge";

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
  const [parsedData, setParsedData] = useState<CareerRealityData | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<CareerProfile | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [realityName, setRealityName] = useState("");
  const [forkParentId, setForkParentId] = useState<string | null>(null);
  
  // Comparison and merge state
  const [compareMode, setCompareMode] = useState(false);
  const [compareRealityA, setCompareRealityA] = useState<SavedReality | null>(null);
  const [compareRealityB, setCompareRealityB] = useState<SavedReality | null>(null);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeConflicts, setMergeConflicts] = useState<Conflict[]>([]);

  // Load profile on mount
  useEffect(() => {
    const profile = getProfile();
    setCurrentProfile(profile);
    if (!profile) {
      setShowProfileForm(true);
    }
  }, []);

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
          // Auto-open save dialog
          setSaveDialogOpen(true);
          setRealityName(parsed.reality_name || "New Reality");
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

  const handleSaveReality = () => {
    if (!parsedData || !currentProfile) return;

    try {
      saveReality(realityName, parsedData, currentProfile, prompt, forkParentId);
      setSaveDialogOpen(false);
      setForkParentId(null);
      window.dispatchEvent(new Event('realitiesChanged'));
    } catch (error) {
      alert('Failed to save reality: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleSelectReality = (reality: SavedReality) => {
    setParsedData(reality.data);
    setPrompt(reality.prompt);
    setCurrentProfile(reality.profile);
    setResponse({
      success: true,
      finalResult: JSON.stringify(reality.data, null, 2),
      messageHistory: [],
    });
  };

  const handleForkReality = (parentId: string) => {
    const parent = getRealityById(parentId);
    if (parent) {
      const forkName = window.prompt(`Fork "${parent.name}" - Enter a name for the new reality:`, `${parent.name} (Fork)`);
      if (forkName) {
        setForkParentId(parentId);
        setPrompt(parent.prompt);
        setParsedData(null);
        setResponse(null);
        setRealityName(forkName);
        
        // Scroll to prompt field
        setTimeout(() => {
          const promptInput = document.querySelector('textarea');
          if (promptInput) {
            promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            promptInput.focus();
          }
        }, 100);
        
        alert(`✅ Fork created: "${forkName}"\n\n📝 The prompt field below has been filled with the parent's prompt.\n\n👉 NEXT STEPS:\n1. Modify the prompt to create a different career path\n2. Click "Open Gate to New Reality"\n3. Save the generated reality`);
      }
    }
  };

  const handleCompare = (realityA: SavedReality, realityB: SavedReality) => {
    setCompareRealityA(realityA);
    setCompareRealityB(realityB);
    setCompareMode(true);
  };

  const handleMerge = () => {
    if (!compareRealityA || !compareRealityB) return;
    
    const result = mergeRealities(compareRealityA, compareRealityB);
    setMergeConflicts(result.conflicts);
    setMergeDialogOpen(true);
  };

  const handleMergeWithResolutions = (resolutions: ConflictResolution[]) => {
    if (!compareRealityA || !compareRealityB || !currentProfile) return;

    const result = mergeRealities(compareRealityA, compareRealityB, resolutions);
    
    // Save the merged reality
    const mergedName = `${compareRealityA.name} + ${compareRealityB.name}`;
    saveReality(mergedName, result.merged, currentProfile, `Merged from ${compareRealityA.name} and ${compareRealityB.name}`);
    
    // Update UI
    setParsedData(result.merged);
    setResponse({
      success: true,
      finalResult: JSON.stringify(result.merged, null, 2),
      messageHistory: [],
    });
    
    // Close dialogs
    setMergeDialogOpen(false);
    setCompareMode(false);
    setCompareRealityA(null);
    setCompareRealityB(null);
    
    window.dispatchEvent(new Event('realitiesChanged'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Animated background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          {/* Classified Files Badges */}
          <div className="flex gap-3 justify-center mb-4">
            <Badge className="border-yellow-600 text-yellow-500 bg-yellow-900/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider">
              📁 Classified: SDG 4
            </Badge>
            <Badge className="border-yellow-600 text-yellow-500 bg-yellow-900/20 px-4 py-2 text-sm font-semibold uppercase tracking-wider">
              📁 Classified: SDG 8
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
            <h1 className="text-4xl font-bold text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] uppercase tracking-wide">
              HAWKINS CAREER LAB: REALITY ARCHITECT
            </h1>
          </div>

          {/* Profile and Sidebar Controls */}
          <div className="flex gap-2 justify-center mt-4">
            <Button
              onClick={() => setShowProfileForm(!showProfileForm)}
              className="bg-cyan-600 hover:bg-cyan-500"
            >
              <User className="mr-2 h-4 w-4" />
              {currentProfile ? currentProfile.name : "Create Profile"}
            </Button>
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-purple-600 hover:bg-purple-500"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              {showSidebar ? "Hide" : "Show"} Realities
            </Button>
          </div>
        </motion.div>

        {/* Profile Form Modal */}
        <AnimatePresence>
          {showProfileForm && (
            <div className="mb-6">
              <CareerProfileForm
                onSave={(profile) => {
                  setCurrentProfile(profile);
                  setShowProfileForm(false);
                }}
                onClose={() => setShowProfileForm(false)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className={`grid gap-6 ${showSidebar ? 'grid-cols-[320px_1fr]' : 'grid-cols-1'}`}>
          {/* Sidebar */}
          {showSidebar && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <RealitySidebar
                onSelectReality={handleSelectReality}
                onForkReality={handleForkReality}
                onCompare={handleCompare}
              />
            </motion.div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setPrompt("Create a timeline for becoming an AI Startup Founder")}
                      className="bg-yellow-900/30 border border-yellow-600/50 text-yellow-400 hover:bg-yellow-900/50 text-sm"
                    >
                      ⚡ Open Gate: AI Startup
                    </Button>
                    <Button
                      onClick={() => setPrompt("Create a timeline for a Corporate Software Engineer role")}
                      className="bg-blue-900/30 border border-blue-600/50 text-blue-400 hover:bg-blue-900/50 text-sm"
                    >
                      🎓 Enter Lab: Corporate Job
                    </Button>
                    <Button
                      onClick={() => setPrompt("Compare becoming a Startup Founder vs getting an MBA")}
                      className="bg-purple-900/30 border border-purple-600/50 text-purple-400 hover:bg-purple-900/50 text-sm"
                    >
                      ⚔️ Close Gate: Startup vs MBA
                    </Button>
                  </div>

                  <Separator className="bg-slate-700" />

                  {/* Input */}
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Create a timeline for becoming a Data Scientist' or 'Compare MBA vs Startup'"
                    className="w-full min-h-[120px] bg-slate-950/50 border border-slate-700 rounded-lg p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                  />

                  <Button
                    onClick={handleRunAgent}
                    disabled={loading || !prompt.trim()}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-6 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Accessing Lab...
                      </>
                    ) : (
                      <>
                        <GitFork className="mr-2 h-5 w-5" />
                        Open Gate
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Dialog */}
            <AnimatePresence>
              {saveDialogOpen && parsedData && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="bg-cyan-900/20 border-cyan-500/50">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Save This Reality?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <input
                        type="text"
                        value={realityName}
                        onChange={(e) => setRealityName(e.target.value)}
                        placeholder="Reality name..."
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveReality}
                          className="flex-1 bg-cyan-600 hover:bg-cyan-500"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Reality
                        </Button>
                        <Button
                          onClick={() => setSaveDialogOpen(false)}
                          className="bg-slate-700 hover:bg-slate-600"
                        >
                          Skip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Output Section */}
            <AnimatePresence>
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {response.error ? (
                    <Card className="bg-red-950/30 border-red-500/50">
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
                    <Card className={`backdrop-blur-sm ${
                      parsedData.status === "BREACH DETECTED"
                        ? "bg-red-950/30 border-red-500/50 animate-pulse"
                        : "bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-cyan-800/50"
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2 text-slate-100">
                            {parsedData.status === "BREACH DETECTED" ? (
                              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                            ) : (
                              <CheckCircle2 className="w-6 h-6 text-green-400" />
                            )}
                            {parsedData.reality_name}
                          </CardTitle>
                          <Badge className={
                            parsedData.status === "BREACH DETECTED"
                              ? "border-red-500/50 text-red-400 animate-pulse uppercase tracking-wider"
                              : "border-green-500/50 text-green-400 uppercase tracking-wider"
                          }>
                            {parsedData.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {parsedData.sdg_alignment.map((sdg, idx) => (
                            <Badge key={idx} className={
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
                            ⏳ TIME STREAM
                          </h3>
                          <div className="space-y-3">
                            {parsedData.timeline_phases.map((phase, idx) => (
                              <div key={idx} className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className="border-purple-500/50 text-purple-400 bg-purple-900/20 uppercase tracking-wider">
                                        Phase {idx + 1}: {phase.phase}
                                      </Badge>
                                      <span className="text-slate-500 text-sm font-mono">{phase.duration}</span>
                                    </div>
                                    <p className="text-slate-300 font-mono text-sm">{phase.action}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Glitches */}
                        {parsedData.glitches.length > 0 && (
                          <div>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                              parsedData.status === "BREACH DETECTED" ? "text-red-400 animate-pulse" : "text-yellow-400"
                            }`}>
                              ⚠️ UPSIDE DOWN INCURSIONS
                            </h3>
                            <div className="space-y-2">
                              {parsedData.glitches.map((glitch, idx) => (
                                <div key={idx} className="bg-red-950/20 border border-red-500/30 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-semibold ${
                                      glitch.severity === "Critical" ? "text-red-400" :
                                      glitch.severity === "High" ? "text-orange-400" :
                                      glitch.severity === "Medium" ? "text-yellow-400" :
                                      "text-slate-400"
                                    }`}>
                                      [{glitch.severity}] {glitch.type}
                                    </span>
                                  </div>
                                  <p className="text-red-300 text-sm font-mono">{glitch.description}</p>
                                  {glitch.resolution && (
                                    <p className="text-green-400 text-xs mt-1">→ {glitch.resolution}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardHeader>
                        <CardTitle>Raw Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[400px]">
                          <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                            {response.finalResult}
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Comparison View */}
        <AnimatePresence>
          {compareMode && compareRealityA && compareRealityB && (
            <ComparisonView
              realityA={compareRealityA}
              realityB={compareRealityB}
              onMerge={handleMerge}
              onClose={() => setCompareMode(false)}
            />
          )}
        </AnimatePresence>

        {/* Merge Dialog */}
        <AnimatePresence>
          {mergeDialogOpen && compareRealityA && compareRealityB && (
            <MergeDialog
              realityAName={compareRealityA.name}
              realityBName={compareRealityB.name}
              conflicts={mergeConflicts}
              onMerge={handleMergeWithResolutions}
              onCancel={() => setMergeDialogOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
