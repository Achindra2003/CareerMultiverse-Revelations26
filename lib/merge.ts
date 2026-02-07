import { CareerRealityData, SavedReality } from "./storage";

export interface Conflict {
  type: "time" | "skill" | "goal" | "phase";
  description: string;
  optionA: any;
  optionB: any;
  autoResolvable: boolean;
  suggested?: any;
}

export interface ConflictResolution {
  conflictIndex: number;
  selectedOption: "A" | "B" | "suggested";
}

export interface MergeResult {
  merged: CareerRealityData;
  conflicts: Conflict[];
  autoResolved: number;
}

/**
 * Detect conflicts between two career realities
 */
export function detectConflicts(
  realityA: CareerRealityData,
  realityB: CareerRealityData
): Conflict[] {
  const conflicts: Conflict[] = [];

  // 1. Time conflict - total duration too long
  const totalDurationA = calculateTotalDuration(realityA.timeline_phases);
  const totalDurationB = calculateTotalDuration(realityB.timeline_phases);
  const combinedDuration = totalDurationA + totalDurationB;

  if (combinedDuration > 36) {
    // More than 3 years is concerning
    conflicts.push({
      type: "time",
      description: `Combined timeline is ${combinedDuration} months (too long for practical career planning)`,
      optionA: `${totalDurationA} months (${realityA.reality_name})`,
      optionB: `${totalDurationB} months (${realityB.reality_name})`,
      autoResolvable: false,
      suggested: Math.min(totalDurationA, totalDurationB),
    });
  }

  // 2. Status conflict - one is BREACH DETECTED
  if (realityA.status !== realityB.status) {
    conflicts.push({
      type: "goal",
      description: "Realities have different stability statuses",
      optionA: realityA.status,
      optionB: realityB.status,
      autoResolvable: true,
      suggested: "STABLE", // Prefer stable
    });
  }

  // 3. Phase count mismatch
  if (Math.abs(realityA.timeline_phases.length - realityB.timeline_phases.length) > 1) {
    conflicts.push({
      type: "phase",
      description: "Different number of career phases",
      optionA: `${realityA.timeline_phases.length} phases`,
      optionB: `${realityB.timeline_phases.length} phases`,
      autoResolvable: true,
      suggested: Math.max(realityA.timeline_phases.length, realityB.timeline_phases.length),
    });
  }

  // 4. Glitch conflicts - both have different risks
  const uniqueGlitchesA = realityA.glitches.filter(g => !realityB.glitches.includes(g));
  const uniqueGlitchesB = realityB.glitches.filter(g => !realityA.glitches.includes(g));

  if (uniqueGlitchesA.length > 0 && uniqueGlitchesB.length > 0) {
    conflicts.push({
      type: "goal",
      description: "Different risk factors identified",
      optionA: `${uniqueGlitchesA.length} unique risks from ${realityA.reality_name}`,
      optionB: `${uniqueGlitchesB.length} unique risks from ${realityB.reality_name}`,
      autoResolvable: true,
      suggested: "Combine all risks",
    });
  }

  return conflicts;
}

/**
 * Calculate total duration in months from timeline phases
 */
function calculateTotalDuration(phases: Array<{ duration: string }>): number {
  return phases.reduce((total, phase) => {
    const match = phase.duration.match(/(\d+)/);
    return total + (match ? parseInt(match[1]) : 0);
  }, 0);
}

/**
 * Merge skills from two realities
 */
export function mergeSkills(skillsA: string[], skillsB: string[]): {
  merged: string[];
  conflicts: string[];
} {
  // Union of all skills
  const allSkills = [...new Set([...skillsA, ...skillsB])];
  
  // No real conflicts in skills - more is better
  return {
    merged: allSkills,
    conflicts: [],
  };
}

/**
 * Merge timeline phases intelligently
 */
export function mergeTimelines(
  phasesA: Array<{ phase: string; action: string; duration: string; weeklyHours?: number; milestones?: string[]; dependencies?: string[] }>,
  phasesB: Array<{ phase: string; action: string; duration: string; weeklyHours?: number; milestones?: string[]; dependencies?: string[] }>
): {
  merged: Array<{ phase: string; action: string; duration: string; weeklyHours: number; milestones: string[]; dependencies: string[] }>;
  conflicts: string[];
} {
  const merged: Array<{ phase: string; action: string; duration: string; weeklyHours: number; milestones: string[]; dependencies: string[] }> = [];
  const conflicts: string[] = [];

  // Take the longer timeline as base
  const longerPhases = phasesA.length >= phasesB.length ? phasesA : phasesB;
  const shorterPhases = phasesA.length >= phasesB.length ? phasesB : phasesA;

  // Merge phases by combining actions
  for (let i = 0; i < longerPhases.length; i++) {
    const phaseA = longerPhases[i];
    const phaseB = shorterPhases[i];

    if (phaseB) {
      // Both have this phase - combine actions
      merged.push({
        phase: phaseA.phase,
        action: `${phaseA.action} + ${phaseB.action}`,
        duration: selectShorterDuration(phaseA.duration, phaseB.duration),
        weeklyHours: Math.max(phaseA.weeklyHours || 0, phaseB.weeklyHours || 0),
        milestones: [...new Set([...(phaseA.milestones || []), ...(phaseB.milestones || [])])],
        dependencies: [...new Set([...(phaseA.dependencies || []), ...(phaseB.dependencies || [])])],
      });
    } else {
      // Only longer has this phase
      merged.push({
        phase: phaseA.phase,
        action: phaseA.action,
        duration: phaseA.duration,
        weeklyHours: phaseA.weeklyHours || 0,
        milestones: phaseA.milestones || [],
        dependencies: phaseA.dependencies || [],
      });
    }
  }

  return { merged, conflicts };
}

/**
 * Select the shorter of two durations
 */
function selectShorterDuration(durationA: string, durationB: string): string {
  const monthsA = parseInt(durationA.match(/(\d+)/)?.[1] || "0");
  const monthsB = parseInt(durationB.match(/(\d+)/)?.[1] || "0");
  return monthsA <= monthsB ? durationA : durationB;
}

/**
 * Main merge function - combines two realities
 */
export function mergeRealities(
  realityA: SavedReality,
  realityB: SavedReality,
  resolutions: ConflictResolution[] = []
): MergeResult {
  const conflicts = detectConflicts(realityA.data, realityB.data);
  
  // Apply resolutions
  const resolvedConflicts = conflicts.map((conflict, idx) => {
    const resolution = resolutions.find(r => r.conflictIndex === idx);
    if (resolution) {
      return { ...conflict, resolved: true, choice: resolution.selectedOption };
    }
    return conflict;
  });

  // Merge SDG alignment (union)
  const mergedSDGs = [...new Set([...realityA.data.sdg_alignment, ...realityB.data.sdg_alignment])];

  // Merge timeline
  const { merged: mergedTimeline } = mergeTimelines(
    realityA.data.timeline_phases,
    realityB.data.timeline_phases
  );

  // Merge glitches (union)
  const mergedGlitches = [...new Set([...realityA.data.glitches, ...realityB.data.glitches])];

  // Determine status
  let mergedStatus: "STABLE" | "BREACH DETECTED" = "STABLE";
  
  // Check if time conflict exists and wasn't resolved
  const timeConflict = conflicts.find(c => c.type === "time");
  if (timeConflict && !resolutions.find(r => r.conflictIndex === conflicts.indexOf(timeConflict))) {
    mergedStatus = "BREACH DETECTED";
  }

  // If either was BREACH DETECTED and not resolved, keep it
  if ((realityA.data.status === "BREACH DETECTED" || realityB.data.status === "BREACH DETECTED") && 
      !resolutions.find(r => conflicts[r.conflictIndex]?.type === "goal")) {
    mergedStatus = "BREACH DETECTED";
  }

  // Count auto-resolved conflicts
  const autoResolved = conflicts.filter(c => c.autoResolvable).length;

  const merged: CareerRealityData = {
    reality_name: `${realityA.data.reality_name} + ${realityB.data.reality_name}`,
    sdg_alignment: mergedSDGs,
    timeline_phases: mergedTimeline,
    glitches: mergedGlitches,
    status: mergedStatus,
    
    // Merge required skills (combine technical, soft, certifications)
    requiredSkills: {
      technical: [...realityA.data.requiredSkills.technical, ...realityB.data.requiredSkills.technical],
      soft: [...realityA.data.requiredSkills.soft, ...realityB.data.requiredSkills.soft],
      certifications: [...realityA.data.requiredSkills.certifications, ...realityB.data.requiredSkills.certifications],
    },
    
    // Merge learning resources (combine all)
    learningResources: [...realityA.data.learningResources, ...realityB.data.learningResources],
    
    // Merge interview prep (combine topics, sum practice numbers)
    interviewPrep: {
      technical: {
        topics: [...new Set([...realityA.data.interviewPrep.technical.topics, ...realityB.data.interviewPrep.technical.topics])],
        practiceProblems: realityA.data.interviewPrep.technical.practiceProblems + realityB.data.interviewPrep.technical.practiceProblems,
        mockInterviews: realityA.data.interviewPrep.technical.mockInterviews + realityB.data.interviewPrep.technical.mockInterviews,
        targetScore: Math.max(realityA.data.interviewPrep.technical.targetScore, realityB.data.interviewPrep.technical.targetScore),
      },
      behavioral: {
        scenarios: [...new Set([...realityA.data.interviewPrep.behavioral.scenarios, ...realityB.data.interviewPrep.behavioral.scenarios])],
        starStories: realityA.data.interviewPrep.behavioral.starStories + realityB.data.interviewPrep.behavioral.starStories,
        practiceHours: realityA.data.interviewPrep.behavioral.practiceHours + realityB.data.interviewPrep.behavioral.practiceHours,
      },
      assessments: {
        platforms: [...new Set([...realityA.data.interviewPrep.assessments.platforms, ...realityB.data.interviewPrep.assessments.platforms])],
        targetScore: Math.max(realityA.data.interviewPrep.assessments.targetScore, realityB.data.interviewPrep.assessments.targetScore),
        completed: realityA.data.interviewPrep.assessments.completed + realityB.data.interviewPrep.assessments.completed,
      },
    },
    
    // Merge placement outcomes (combine companies, average CTC, average probability)
    placementOutcomes: {
      targetCompanies: [...new Set([...realityA.data.placementOutcomes.targetCompanies, ...realityB.data.placementOutcomes.targetCompanies])],
      expectedCTC: {
        min: Math.min(realityA.data.placementOutcomes.expectedCTC.min, realityB.data.placementOutcomes.expectedCTC.min),
        max: Math.max(realityA.data.placementOutcomes.expectedCTC.max, realityB.data.placementOutcomes.expectedCTC.max),
        currency: realityA.data.placementOutcomes.expectedCTC.currency,
      },
      roleType: realityA.data.placementOutcomes.roleType, // Take first one
      successProbability: (realityA.data.placementOutcomes.successProbability + realityB.data.placementOutcomes.successProbability) / 2,
      alternativePaths: [...new Set([...realityA.data.placementOutcomes.alternativePaths, ...realityB.data.placementOutcomes.alternativePaths])],
    },
  };

  return {
    merged,
    conflicts: resolvedConflicts,
    autoResolved,
  };
}

/**
 * Get comparison data for two realities
 */
export function compareRealities(realityA: SavedReality, realityB: SavedReality) {
  const commonSDGs = realityA.data.sdg_alignment.filter(sdg => 
    realityB.data.sdg_alignment.includes(sdg)
  );
  const uniqueSDGsA = realityA.data.sdg_alignment.filter(sdg => 
    !realityB.data.sdg_alignment.includes(sdg)
  );
  const uniqueSDGsB = realityB.data.sdg_alignment.filter(sdg => 
    !realityA.data.sdg_alignment.includes(sdg)
  );

  const commonGlitches = realityA.data.glitches.filter(g => 
    realityB.data.glitches.includes(g)
  );
  const uniqueGlitchesA = realityA.data.glitches.filter(g => 
    !realityB.data.glitches.includes(g)
  );
  const uniqueGlitchesB = realityB.data.glitches.filter(g => 
    !realityA.data.glitches.includes(g)
  );

  return {
    sdgs: { common: commonSDGs, uniqueA: uniqueSDGsA, uniqueB: uniqueSDGsB },
    glitches: { common: commonGlitches, uniqueA: uniqueGlitchesA, uniqueB: uniqueGlitchesB },
    totalDurationA: calculateTotalDuration(realityA.data.timeline_phases),
    totalDurationB: calculateTotalDuration(realityB.data.timeline_phases),
  };
}
