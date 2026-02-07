"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Folder, 
  FolderOpen, 
  GitBranch, 
  Trash2, 
  Clock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  SavedReality, 
  getAllRealities, 
  deleteReality, 
  getActiveRealityId,
  getChildRealities 
} from "@/lib/storage";

interface RealitySidebarProps {
  onSelectReality: (reality: SavedReality) => void;
  onForkReality?: (parentId: string) => void;
  onCompare?: (realityA: SavedReality, realityB: SavedReality) => void;
}

export function RealitySidebar({ onSelectReality, onForkReality, onCompare }: RealitySidebarProps) {
  const [realities, setRealities] = useState<SavedReality[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());

  // Load realities on mount and set up listener
  useEffect(() => {
    loadRealities();
    setActiveId(getActiveRealityId());

    // Listen for storage changes
    const handleStorageChange = () => {
      loadRealities();
      setActiveId(getActiveRealityId());
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('realitiesChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('realitiesChanged', handleStorageChange);
    };
  }, []);

  // Auto-expand path to active reality
  useEffect(() => {
    if (!activeId || realities.length === 0) return;

    let current = realities.find(r => r.id === activeId);
    const toExpand = new Set<string>();

    while (current && current.parentId) {
      const pid = current.parentId;
      toExpand.add(pid);
      current = realities.find(r => r.id === pid);
    }

    if (toExpand.size > 0) {
      setExpandedIds(prev => {
        const next = new Set(prev);
        let changed = false;
        toExpand.forEach(id => {
          if (!next.has(id)) {
            next.add(id);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
  }, [activeId, realities]);

  const loadRealities = () => {
    setRealities(getAllRealities());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this reality? This action cannot be undone.')) {
      deleteReality(id);
      loadRealities();
      window.dispatchEvent(new Event('realitiesChanged'));
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleFork = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onForkReality?.(parentId);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedForCompare);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      if (newSelected.size >= 2) {
        // Only allow 2 selections
        return;
      }
      newSelected.add(id);
    }
    setSelectedForCompare(newSelected);
  };

  const handleCompare = () => {
    if (selectedForCompare.size === 2) {
      const [idA, idB] = Array.from(selectedForCompare);
      const realityA = realities.find(r => r.id === idA);
      const realityB = realities.find(r => r.id === idB);
      if (realityA && realityB && onCompare) {
        onCompare(realityA, realityB);
        setSelectedForCompare(new Set()); // Clear selection
      }
    }
  };

  // Get root realities (no parent)
  const rootRealities = realities.filter(r => !r.parentId);

  // Recursive component to render reality tree
  const RealityNode = ({ reality, depth = 0 }: { reality: SavedReality; depth?: number }) => {
    const children = getChildRealities(reality.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(reality.id);
    const isActive = activeId === reality.id;
    const isSelected = selectedForCompare.has(reality.id);

    return (
      <div className="mb-1">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`
            group relative rounded-lg p-3 cursor-pointer transition-all duration-200
            ${isActive 
              ? 'bg-cyan-900/30 border border-cyan-500/50' 
              : isSelected
              ? 'bg-purple-900/30 border border-purple-500/50'
              : 'bg-slate-900/30 border border-slate-800 hover:border-cyan-500/30'
            }
          `}
          style={{ marginLeft: `${depth * 16}px` }}
          onClick={() => onSelectReality(reality)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Checkbox for comparison */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => toggleSelect(reality.id, e.nativeEvent as any as React.MouseEvent)}
                onClick={(e) => e.stopPropagation()}
                className="w-4 h-4 rounded border-slate-600 text-purple-600 focus:ring-purple-500"
                disabled={!isSelected && selectedForCompare.size >= 2}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {hasChildren && (
                  <button
                    onClick={(e) => toggleExpand(reality.id, e)}
                    className="text-slate-400 hover:text-cyan-400"
                  >
                    {isExpanded ? (
                      <FolderOpen className="w-4 h-4" />
                    ) : (
                      <Folder className="w-4 h-4" />
                    )}
                  </button>
                )}
                <h4 className="text-sm font-semibold text-slate-100 truncate">
                  {reality.name}
                </h4>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Badge className={
                  reality.data.status === "BREACH DETECTED"
                    ? "border-red-500/50 text-red-400 text-xs"
                    : "border-green-500/50 text-green-400 text-xs"
                }>
                  {reality.data.status === "BREACH DETECTED" ? (
                    <AlertTriangle className="w-3 h-3 mr-1" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  {reality.data.status}
                </Badge>
                {reality.parentId && (
                  <Badge className="border-purple-500/50 text-purple-400 text-xs">
                    <GitBranch className="w-3 h-3 mr-1" />
                    Forked
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                {new Date(reality.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex gap-1 transition-opacity">
              <Button
                onClick={(e) => handleFork(reality.id, e)}
                className="h-7 w-7 p-0 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30"
                title="Fork this reality"
              >
                <GitBranch className="w-3 h-3" />
              </Button>
              <Button
                onClick={(e) => handleDelete(reality.id, e)}
                className="h-7 w-7 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                title="Delete reality"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Render children if expanded */}
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1"
            >
              {children.map(child => (
                <RealityNode key={child.id} reality={child} depth={depth + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-100">
          <Folder className="w-5 h-5 text-yellow-500" />
          Saved Realities
        </CardTitle>
        <p className="text-xs text-slate-400">
          {realities.length} {realities.length === 1 ? 'reality' : 'realities'} in lab
        </p>
        {selectedForCompare.size > 0 && (
          <Button
            onClick={handleCompare}
            disabled={selectedForCompare.size !== 2}
            className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
          >
            Compare Selected ({selectedForCompare.size}/2)
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] pr-4">
          {realities.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Folder className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No saved realities yet</p>
              <p className="text-xs mt-1">Generate and save your first reality</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rootRealities.map(reality => (
                <RealityNode key={reality.id} reality={reality} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
