"use client";

import { SavedReality } from "@/lib/storage";
import { compareRealities } from "@/lib/merge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle2, X, GitMerge } from "lucide-react";
import { motion } from "framer-motion";

interface ComparisonViewProps {
  realityA: SavedReality;
  realityB: SavedReality;
  onMerge: () => void;
  onClose: () => void;
}

export function ComparisonView({ realityA, realityB, onMerge, onClose }: ComparisonViewProps) {
  const comparison = compareRealities(realityA, realityB);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <Card className="w-full max-w-6xl max-h-[90vh] bg-slate-900/95 border-cyan-500/50">
        <CardHeader className="border-b border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
              <GitMerge className="w-6 h-6" />
              Reality Comparison
            </CardTitle>
            <Button
              onClick={onClose}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <ScrollArea className="h-[calc(90vh-180px)]">
          <CardContent className="p-6">
            {/* Reality Headers */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Reality A */}
              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-100">
                    {realityA.data.reality_name}
                  </h3>
                  {realityA.data.status === "BREACH DETECTED" ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <Badge className={
                  realityA.data.status === "BREACH DETECTED"
                    ? "border-red-500/50 text-red-400"
                    : "border-green-500/50 text-green-400"
                }>
                  {realityA.data.status}
                </Badge>
                <p className="text-sm text-slate-400 mt-2">
                  Duration: {comparison.totalDurationA} months
                </p>
              </div>

              {/* Reality B */}
              <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-100">
                    {realityB.data.reality_name}
                  </h3>
                  {realityB.data.status === "BREACH DETECTED" ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <Badge className={
                  realityB.data.status === "BREACH DETECTED"
                    ? "border-red-500/50 text-red-400"
                    : "border-green-500/50 text-green-400"
                }>
                  {realityB.data.status}
                </Badge>
                <p className="text-sm text-slate-400 mt-2">
                  Duration: {comparison.totalDurationB} months
                </p>
              </div>
            </div>

            {/* SDG Alignment Comparison */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                📁 SDG Alignment
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Reality A SDGs */}
                <div className="space-y-2">
                  {realityA.data.sdg_alignment.map((sdg, idx) => (
                    <Badge
                      key={idx}
                      className={
                        comparison.sdgs.common.includes(sdg)
                          ? "border-green-500/50 text-green-400 bg-green-900/20"
                          : "border-yellow-500/50 text-yellow-400 bg-yellow-900/20"
                      }
                    >
                      {sdg} {comparison.sdgs.common.includes(sdg) ? "✓" : ""}
                    </Badge>
                  ))}
                </div>

                {/* Reality B SDGs */}
                <div className="space-y-2">
                  {realityB.data.sdg_alignment.map((sdg, idx) => (
                    <Badge
                      key={idx}
                      className={
                        comparison.sdgs.common.includes(sdg)
                          ? "border-green-500/50 text-green-400 bg-green-900/20"
                          : "border-yellow-500/50 text-yellow-400 bg-yellow-900/20"
                      }
                    >
                      {sdg} {comparison.sdgs.common.includes(sdg) ? "✓" : ""}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Comparison */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">
                ⏳ Timeline Phases
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Reality A Timeline */}
                <div className="space-y-2">
                  {realityA.data.timeline_phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/50 rounded-lg p-3 border border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="border-purple-500/50 text-purple-400 bg-purple-900/20 text-xs">
                          Phase {idx + 1}: {phase.phase}
                        </Badge>
                        <span className="text-xs text-slate-500 font-mono">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        {phase.action}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reality B Timeline */}
                <div className="space-y-2">
                  {realityB.data.timeline_phases.map((phase, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/50 rounded-lg p-3 border border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge className="border-purple-500/50 text-purple-400 bg-purple-900/20 text-xs">
                          Phase {idx + 1}: {phase.phase}
                        </Badge>
                        <span className="text-xs text-slate-500 font-mono">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        {phase.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Glitches Comparison */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                ⚠️ Upside Down Incursions
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Reality A Glitches */}
                <div className="space-y-2">
                  {realityA.data.glitches.length > 0 ? (
                    realityA.data.glitches.map((glitch, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-2 border ${
                          comparison.glitches.common.includes(glitch)
                            ? "bg-orange-950/20 border-orange-500/30"
                            : "bg-red-950/20 border-red-500/30"
                        }`}
                      >
                        <p className="text-xs text-red-300 font-mono">
                          [{glitch.severity}] {glitch.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No risks detected</p>
                  )}
                </div>

                {/* Reality B Glitches */}
                <div className="space-y-2">
                  {realityB.data.glitches.length > 0 ? (
                    realityB.data.glitches.map((glitch, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-2 border ${
                          comparison.glitches.common.includes(glitch)
                            ? "bg-orange-950/20 border-orange-500/30"
                            : "bg-red-950/20 border-red-500/30"
                        }`}
                      >
                        <p className="text-xs text-red-300 font-mono">
                          [{glitch.severity}] {glitch.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No risks detected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Comparison Summary */}
            <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                Comparison Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">
                    Common SDGs: <span className="text-green-400">{comparison.sdgs.common.length}</span>
                  </p>
                  <p className="text-slate-400">
                    Unique to A: <span className="text-yellow-400">{comparison.sdgs.uniqueA.length}</span>
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">
                    Common Risks: <span className="text-orange-400">{comparison.glitches.common.length}</span>
                  </p>
                  <p className="text-slate-400">
                    Total Duration Difference: <span className="text-purple-400">
                      {Math.abs(comparison.totalDurationA - comparison.totalDurationB)} months
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 p-4 flex justify-between items-center">
          <p className="text-sm text-slate-400">
            ✓ Common items • ⚠️ Shared risks • Unique items shown
          </p>
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="bg-slate-700 hover:bg-slate-600"
            >
              Close
            </Button>
            <Button
              onClick={onMerge}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
            >
              <GitMerge className="mr-2 h-4 w-4" />
              Merge These Realities
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
