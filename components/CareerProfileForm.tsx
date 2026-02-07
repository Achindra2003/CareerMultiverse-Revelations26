"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, GraduationCap, Target, Code, Save, X } from "lucide-react";
import { motion } from "framer-motion";
import { CareerProfile, saveProfile, getProfile, createDefaultProfile } from "@/lib/storage";

interface CareerProfileFormProps {
  onSave?: (profile: CareerProfile) => void;
  onClose?: () => void;
}

export function CareerProfileForm({ onSave, onClose }: CareerProfileFormProps) {
  const [profile, setProfile] = useState<CareerProfile>(createDefaultProfile());
  const [skillInput, setSkillInput] = useState("");
  const [roleInput, setRoleInput] = useState("");

  useEffect(() => {
    const existing = getProfile();
    if (existing) {
      setProfile(existing);
    }
  }, []);

  const handleSave = () => {
    saveProfile(profile);
    onSave?.(profile);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkill = {
        name: skillInput.trim(),
        proficiency: "Intermediate" as const,
        yearsOfExperience: 0,
      };
      setProfile({
        ...profile,
        skills: {
          ...profile.skills,
          technical: [...profile.skills.technical, newSkill],
        },
      });
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    setProfile({
      ...profile,
      skills: {
        ...profile.skills,
        technical: profile.skills.technical.filter((_, i) => i !== index),
      },
    });
  };

  const addRole = () => {
    if (roleInput.trim()) {
      const newRole = {
        role: roleInput.trim(),
        priority: "High" as const,
        targetCompanies: [],
        requiredSkills: [],
        currentReadiness: 0,
      };
      setProfile({
        ...profile,
        targetRoles: [...profile.targetRoles, newRole],
      });
      setRoleInput("");
    }
  };

  const removeRole = (index: number) => {
    setProfile({
      ...profile,
      targetRoles: profile.targetRoles.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-slate-100">
                <User className="w-5 h-5 text-cyan-400" />
                Subject Profile
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter your career profile for personalized reality simulations
              </CardDescription>
            </div>
            {onClose && (
              <Button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-100 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="john@christuniversity.in"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={profile.education.cgpa || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: {
                      ...profile.education,
                      cgpa: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="8.5"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Degree</label>
              <input
                type="text"
                value={profile.education.degree}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, degree: e.target.value },
                  })
                }
                placeholder="B.Tech CSE"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Current Year</label>
              <select
                value={profile.education.currentYear}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    education: { ...profile.education, currentYear: e.target.value },
                  })
                }
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="">Select</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Final Year">Final Year</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1">
              <Code className="w-4 h-4" />
              Technical Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
                placeholder="e.g., Python, React, Machine Learning"
                className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Button onClick={addSkill} className="bg-cyan-600 hover:bg-cyan-500">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.technical.map((skill, idx) => (
                <Badge
                  key={idx}
                  className="bg-purple-900/30 border-purple-500/50 text-purple-300 cursor-pointer hover:bg-purple-900/50"
                  onClick={() => removeSkill(idx)}
                >
                  {skill.name} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Roles */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block flex items-center gap-1">
              <Target className="w-4 h-4" />
              Target Roles
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addRole()}
                placeholder="e.g., Software Engineer, Data Scientist"
                className="flex-1 bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Button onClick={addRole} className="bg-cyan-600 hover:bg-cyan-500">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.targetRoles.map((role, idx) => (
                <Badge
                  key={idx}
                  className="bg-blue-900/30 border-blue-500/50 text-blue-300 cursor-pointer hover:bg-blue-900/50"
                  onClick={() => removeRole(idx)}
                >
                  {role.role} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-6 text-lg"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
