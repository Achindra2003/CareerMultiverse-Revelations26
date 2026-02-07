"use client";

import { useState } from "react";
import { Conflict, ConflictResolution } from "@/lib/merge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, X, GitMerge } from "lucide-react";
import { motion } from "framer-motion";

interface MergeDialogProps {
  realityAName: string;
  realityBName: string;
  conflicts: Conflict[];
  onMerge: (resolutions: ConflictResolution[]) => void;
  onCancel: () => void;
}

export function MergeDialog({
  realityAName,
  realityBName,
  conflicts,
  onMerge,
  onCancel,
}: MergeDialogProps) {
  const [resolutions, setResolutions] = useState<ConflictResolution[]>([]);

  const handleResolutionChange = (conflictIndex: number, option: "A" | "B" | "suggested") => {
    setResolutions(prev => {
      const existing = prev.find(r => r.conflictIndex === conflictIndex);
      if (existing) {
        return prev.map(r =>
          r.conflictIndex === conflictIndex ? { ...r, selectedOption: option } : r
        );
      }
      return [...prev, { conflictIndex, selectedOption: option }];
    });
  };

  const unresolvedConflicts = conflicts.filter(
    (c, idx) => !c.autoResolvable && !resolutions.find(r => r.conflictIndex === idx)
  );

  const canMerge = unresolvedConflicts.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] bg-slate-900/95 border-yellow-500/50">
        <CardHeader className="border-b border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Merge Conflicts Detected
            </CardTitle>
            <Button
              onClick={onCancel}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Merging: <span className="text-cyan-400">{realityAName}</span> +{" "}
            <span className="text-purple-400">{realityBName}</span>
          </p>
        </CardHeader>

        <ScrollArea className="h-[calc(90vh-220px)]">
          <CardContent className="p-6 space-y-4">
            {/* Summary */}
            <div className="bg-yellow-950/20 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-400">
                <strong>{conflicts.length}</strong> conflicts detected •{" "}
                <strong>{conflicts.filter(c => c.autoResolvable).length}</strong> auto-resolved •{" "}
                <strong>{unresolvedConflicts.length}</strong> require your input
              </p>
            </div>

            {/* Conflicts */}
            {conflicts.map((conflict, idx) => {
              const resolution = resolutions.find(r => r.conflictIndex === idx);
              const isResolved = conflict.autoResolvable || !!resolution;

              return (
                <div
                  key={idx}
                  className={`rounded-lg p-4 border ${
                    isResolved
                      ? "bg-green-950/20 border-green-500/30"
                      : "bg-red-950/20 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge className={
                        conflict.type === "time"
                          ? "border-orange-500/50 text-orange-400 bg-orange-900/20"
                          : conflict.type === "skill"
                          ? "border-blue-500/50 text-blue-400 bg-blue-900/20"
                          : conflict.type === "phase"
                          ? "border-purple-500/50 text-purple-400 bg-purple-900/20"
                          : "border-red-500/50 text-red-400 bg-red-900/20"
                      }>
                        {conflict.type.toUpperCase()} CONFLICT
                      </Badge>
                      {conflict.autoResolvable && (
                        <Badge className="ml-2 border-green-500/50 text-green-400 bg-green-900/20">
                          AUTO-RESOLVED
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3">{conflict.description}</p>

                  {/* Resolution Options */}
                  {!conflict.autoResolvable && (
                    <div className="space-y-2">
                      {/* Option A */}
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name={`conflict-${idx}`}
                          checked={resolution?.selectedOption === "A"}
                          onChange={() => handleResolutionChange(idx, "A")}
                          className="w-4 h-4 text-cyan-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-cyan-400">
                            Option A: {realityAName}
                          </p>
                          <p className="text-xs text-slate-400">{String(conflict.optionA)}</p>
                        </div>
                      </label>

                      {/* Option B */}
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-purple-500/50 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name={`conflict-${idx}`}
                          checked={resolution?.selectedOption === "B"}
                          onChange={() => handleResolutionChange(idx, "B")}
                          className="w-4 h-4 text-purple-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-purple-400">
                            Option B: {realityBName}
                          </p>
                          <p className="text-xs text-slate-400">{String(conflict.optionB)}</p>
                        </div>
                      </label>

                      {/* Suggested Option */}
                      {conflict.suggested && (
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-green-500/50 cursor-pointer transition-colors bg-green-950/10">
                          <input
                            type="radio"
                            name={`conflict-${idx}`}
                            checked={resolution?.selectedOption === "suggested"}
                            onChange={() => handleResolutionChange(idx, "suggested")}
                            className="w-4 h-4 text-green-600"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-400">
                              Suggested: Optimized
                            </p>
                            <p className="text-xs text-slate-400">
                              {String(conflict.suggested)} {conflict.type === "time" && "months"}
                            </p>
                          </div>
                        </label>
                      )}
                    </div>
                  )}

                  {/* Auto-resolved display */}
                  {conflict.autoResolvable && conflict.suggested && (
                    <div className="bg-green-950/20 border border-green-500/30 rounded p-3">
                      <p className="text-sm text-green-400">
                        ✓ Automatically resolved: {String(conflict.suggested)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4 flex justify-between items-center">
          <div>
            {!canMerge && (
              <p className="text-sm text-red-400">
                ⚠️ Please resolve all conflicts to proceed
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={onCancel} className="bg-slate-700 hover:bg-slate-600">
              Cancel
            </Button>
            <Button
              onClick={() => onMerge(resolutions)}
              disabled={!canMerge}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GitMerge className="mr-2 h-4 w-4" />
              Merge with Resolutions
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
