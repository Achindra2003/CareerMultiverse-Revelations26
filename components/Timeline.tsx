"use client";

import { motion } from "framer-motion";

interface Milestone {
  id: string;
  year: number;
  status: "active" | "completed" | "critical" | "pending";
  type: string;
}

interface TimelineProps {
  milestones: Milestone[];
}

export function Timeline({ milestones }: TimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "active":
        return "bg-cyan-500";
      case "critical":
        return "bg-red-500";
      case "pending":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case "completed":
        return "shadow-[0_0_20px_rgba(34,197,94,0.5)]";
      case "active":
        return "shadow-[0_0_20px_rgba(6,182,212,0.5)]";
      case "critical":
        return "shadow-[0_0_20px_rgba(239,68,68,0.5)]";
      case "pending":
        return "shadow-[0_0_10px_rgba(100,116,139,0.3)]";
      default:
        return "";
    }
  };

  return (
    <div className="relative py-8">
      {/* Vertical connecting line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/20 via-purple-500/20 to-cyan-500/20" />

      {/* Milestones */}
      <div className="space-y-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.15,
              ease: "easeOut",
            }}
            className="relative flex items-center gap-6"
          >
            {/* Milestone dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.15 + 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className={`relative z-10 w-12 h-12 rounded-full ${getStatusColor(
                milestone.status
              )} ${getStatusGlow(milestone.status)} flex items-center justify-center`}
            >
              {/* Inner pulse effect */}
              {milestone.status === "active" && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
              
              {/* Year label inside dot */}
              <span className="relative z-10 text-xs font-bold text-white">
                {milestone.year}
              </span>
            </motion.div>

            {/* Horizontal line extending from dot */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: 0.4,
                delay: index * 0.15 + 0.3,
              }}
              className={`h-0.5 flex-1 ${
                milestone.status === "critical"
                  ? "bg-gradient-to-r from-red-500/50 to-transparent"
                  : milestone.status === "active"
                  ? "bg-gradient-to-r from-cyan-500/50 to-transparent"
                  : milestone.status === "completed"
                  ? "bg-gradient-to-r from-green-500/50 to-transparent"
                  : "bg-gradient-to-r from-slate-500/30 to-transparent"
              }`}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
