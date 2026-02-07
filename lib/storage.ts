// Storage system for career realities using localStorage

// ============================================
// ENHANCED CAREER PROFILE INTERFACE
// ============================================

export interface Coursework {
  course: string;
  grade: string;
  credits: number;
  semester: string;
}

export interface Education {
  degree: string;
  major: string;
  university: string;
  cgpa: number;
  currentYear: string;
  expectedGraduation: string;
  coursework: Coursework[];
}

export interface TechnicalSkill {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  yearsOfExperience: number;
  projects?: string[];
}

export interface SoftSkill {
  name: string;
  level: "Developing" | "Competent" | "Proficient";
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface Skills {
  technical: TechnicalSkill[];
  soft: SoftSkill[];
  certifications: Certification[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  startDate: string;
  endDate?: string;
  achievements: string[];
}

export interface Internship {
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate?: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface Achievement {
  title: string;
  description: string;
  date: string;
  category: "Academic" | "Technical" | "Leadership" | "Other";
}

export interface TargetRole {
  role: string;
  priority: "High" | "Medium" | "Low";
  targetCompanies: string[];
  requiredSkills: string[];
  currentReadiness: number; // 0-100
}

export interface CareerProfile {
  // Personal Information
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  
  // Academic Details
  education: Education;
  
  // Skills
  skills: Skills;
  
  // Experience
  projects: Project[];
  internships: Internship[];
  achievements: Achievement[];
  
  // Career Goals
  targetRoles: TargetRole[];
}

// ============================================
// ENHANCED CAREER REALITY DATA INTERFACE
// ============================================

export interface RequiredSkill {
  skill: string;
  priority: "Critical" | "Important" | "Nice-to-have";
  currentLevel: number; // 0-100
  targetLevel: number; // 0-100
  learningPath: string[];
}

export interface RequiredSoftSkill {
  skill: string;
  importance: "High" | "Medium" | "Low";
  developmentActivities: string[];
}

export interface RequiredCertification {
  name: string;
  deadline: string;
  cost: number;
  priority: "Must-have" | "Recommended" | "Optional";
}

export interface RequiredSkills {
  technical: RequiredSkill[];
  soft: RequiredSoftSkill[];
  certifications: RequiredCertification[];
}

export interface LearningResource {
  title: string;
  type: "Course" | "Book" | "Tutorial" | "Project" | "Practice";
  platform: string;
  duration: string;
  cost: number;
  prerequisite: string[];
  status: "Not Started" | "In Progress" | "Completed";
  url?: string;
}

export interface InterviewPrep {
  technical: {
    topics: string[];
    practiceProblems: number;
    mockInterviews: number;
    targetScore: number;
  };
  behavioral: {
    scenarios: string[];
    starStories: number;
    practiceHours: number;
  };
  assessments: {
    platforms: string[];
    targetScore: number;
    completed: number;
  };
}

export interface TimelinePhase {
  phase: string;
  action: string;
  duration: string;
  weeklyHours: number;
  milestones: string[];
  dependencies: string[];
}

export interface PlacementOutcomes {
  targetCompanies: string[];
  expectedCTC: {
    min: number;
    max: number;
    currency: string;
  };
  roleType: "Service-based" | "Product-based" | "Startup" | "Research";
  successProbability: number; // 0-100
  alternativePaths: string[];
}

export interface Glitch {
  type: "Time" | "Prerequisite" | "Goal" | "Resource" | "Skill";
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  resolution?: string;
}

export interface CareerRealityData {
  reality_name: string;
  
  // Skills Focus
  requiredSkills: RequiredSkills;
  
  // Learning Resources
  learningResources: LearningResource[];
  
  // Interview Preparation
  interviewPrep: InterviewPrep;
  
  // Timeline
  timeline_phases: TimelinePhase[];
  
  // Placement Outcomes
  placementOutcomes: PlacementOutcomes;
  
  // Conflicts & Status
  glitches: Glitch[];
  status: "STABLE" | "BREACH DETECTED";
  
  // SDG Alignment (existing)
  sdg_alignment: string[];
}

// ============================================
// SAVED REALITY INTERFACE
// ============================================

export interface SavedReality {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  data: CareerRealityData;
  profile: CareerProfile;
  prompt: string;
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

const STORAGE_KEYS = {
  REALITIES: 'hawkins_lab_realities',
  CURRENT_PROFILE: 'hawkins_lab_profile',
  ACTIVE_REALITY_ID: 'hawkins_lab_active_reality',
};

const isBrowser = typeof window !== 'undefined';

export function generateId(): string {
  return `reality_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getAllRealities(): SavedReality[] {
  if (!isBrowser) return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REALITIES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading realities:', error);
    return [];
  }
}

export function saveReality(
  name: string,
  data: CareerRealityData,
  profile: CareerProfile,
  prompt: string,
  parentId: string | null = null
): SavedReality {
  if (!isBrowser) throw new Error('Cannot save in non-browser environment');

  const reality: SavedReality = {
    id: generateId(),
    name,
    parentId,
    createdAt: new Date().toISOString(),
    data,
    profile,
    prompt,
  };

  const realities = getAllRealities();
  realities.push(reality);
  
  try {
    localStorage.setItem(STORAGE_KEYS.REALITIES, JSON.stringify(realities));
    setActiveRealityId(reality.id);
    return reality;
  } catch (error) {
    console.error('Error saving reality:', error);
    throw new Error('Failed to save reality. Storage may be full.');
  }
}

export function getRealityById(id: string): SavedReality | null {
  const realities = getAllRealities();
  return realities.find(r => r.id === id) || null;
}

export function deleteReality(id: string): void {
  if (!isBrowser) return;

  const realities = getAllRealities();
  const filtered = realities.filter(r => r.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEYS.REALITIES, JSON.stringify(filtered));
    
    if (getActiveRealityId() === id) {
      clearActiveRealityId();
    }
  } catch (error) {
    console.error('Error deleting reality:', error);
  }
}

export function getChildRealities(parentId: string): SavedReality[] {
  const realities = getAllRealities();
  return realities.filter(r => r.parentId === parentId);
}

export function getParentReality(reality: SavedReality): SavedReality | null {
  if (!reality.parentId) return null;
  return getRealityById(reality.parentId);
}

export function getAncestryChain(realityId: string): SavedReality[] {
  const chain: SavedReality[] = [];
  let current = getRealityById(realityId);
  
  while (current) {
    chain.unshift(current);
    current = current.parentId ? getRealityById(current.parentId) : null;
  }
  
  return chain;
}

export function saveProfile(profile: CareerProfile): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

export function getProfile(): CareerProfile | null {
  if (!isBrowser) return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

export function setActiveRealityId(id: string): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_REALITY_ID, id);
}

export function getActiveRealityId(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_REALITY_ID);
}

export function clearActiveRealityId(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_REALITY_ID);
}

export function getActiveReality(): SavedReality | null {
  const id = getActiveRealityId();
  return id ? getRealityById(id) : null;
}

export function clearAllData(): void {
  if (!isBrowser) return;
  
  localStorage.removeItem(STORAGE_KEYS.REALITIES);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_REALITY_ID);
}

export function getStorageInfo(): { used: number; total: number; percentage: number } {
  if (!isBrowser) return { used: 0, total: 0, percentage: 0 };
  
  let used = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }
  
  const total = 5 * 1024 * 1024; // 5MB
  const percentage = (used / total) * 100;
  
  return { used, total, percentage };
}

// ============================================
// HELPER FUNCTIONS FOR PROFILE CREATION
// ============================================

export function createDefaultProfile(): CareerProfile {
  return {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    education: {
      degree: "",
      major: "",
      university: "Christ University",
      cgpa: 0,
      currentYear: "",
      expectedGraduation: "",
      coursework: [],
    },
    skills: {
      technical: [],
      soft: [],
      certifications: [],
    },
    projects: [],
    internships: [],
    achievements: [],
    targetRoles: [],
  };
}
