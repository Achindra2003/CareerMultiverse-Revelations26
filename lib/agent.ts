import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { CareerProfile } from "./storage";

// Initialize the Groq model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// Define the state interface
interface AgentState {
  messages: BaseMessage[];
}

// Define the comprehensive Career Reality output schema
export interface CareerRealityOutput {
  reality_name: string;
  sdg_alignment: string[];
  
  requiredSkills: {
    technical: Array<{
      skill: string;
      priority: "Critical" | "Important" | "Nice-to-have";
      currentLevel: number;
      targetLevel: number;
      learningPath: string[];
    }>;
    soft: Array<{
      skill: string;
      importance: "High" | "Medium" | "Low";
      developmentActivities: string[];
    }>;
    certifications: Array<{
      name: string;
      deadline: string;
      cost: number;
      priority: "Must-have" | "Recommended" | "Optional";
    }>;
  };
  
  learningResources: Array<{
    title: string;
    type: "Course" | "Book" | "Tutorial" | "Project" | "Practice";
    platform: string;
    duration: string;
    cost: number;
    prerequisite: string[];
    status: "Not Started" | "In Progress" | "Completed";
    url?: string;
  }>;
  
  interviewPrep: {
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
  };
  
  timeline_phases: Array<{
    phase: string;
    action: string;
    duration: string;
    weeklyHours: number;
    milestones: string[];
    dependencies: string[];
  }>;
  
  placementOutcomes: {
    targetCompanies: string[];
    expectedCTC: {
      min: number;
      max: number;
      currency: string;
    };
    roleType: "Service-based" | "Product-based" | "Startup" | "Research";
    successProbability: number;
    alternativePaths: string[];
  };
  
  glitches: Array<{
    type: "Time" | "Prerequisite" | "Goal" | "Resource" | "Skill";
    description: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    resolution?: string;
  }>;
  
  status: "STABLE" | "BREACH DETECTED";
}

// Planner Node: Enhanced Career Reality Architect
async function plannerNode(state: AgentState): Promise<Partial<AgentState>> {
  const userMessage = state.messages[state.messages.length - 1];
  
  // Extract profile context if available (passed from frontend)
  const profileContext = state.messages.find(m => m.name === "ProfileContext");
  const profileData = profileContext ? (profileContext.content as string) : "No profile data available";
  
  const plannerPrompt = `ROLE: You are the Chief Scientist at Hawkins National Laboratory, specializing in Career Reality Engineering.

CRITICAL: You MUST respond ONLY with valid JSON. NO MARKDOWN. NO explanatory text. ONLY JSON.

SUBJECT PROFILE:
${profileData}

TONE: Use ominous scientific language. Refer to career paths as "timeline divergences" or "reality streams". Be clinical and mysterious.

TASK: Generate a comprehensive career development reality with:

1. REQUIRED SKILLS (with proficiency levels and learning paths)
2. LEARNING RESOURCES (courses, books, platforms with costs and durations)
3. INTERVIEW PREPARATION (technical topics, behavioral scenarios, practice requirements)
4. TIMELINE (3-4 phases with weekly hours, milestones, and dependencies)
5. PLACEMENT OUTCOMES (target companies, CTC range, success probability)
6. UPSIDE DOWN INCURSIONS (conflicts/risks with severity levels)

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "reality_name": "Ominous scientific name for this career path",
  "sdg_alignment": ["SDG 4", "SDG 8"],
  "requiredSkills": {
    "technical": [
      {
        "skill": "Python",
        "priority": "Critical",
        "currentLevel": 30,
        "targetLevel": 85,
        "learningPath": ["Basics", "Data Structures", "Advanced Projects"]
      }
    ],
    "soft": [
      {
        "skill": "Communication",
        "importance": "High",
        "developmentActivities": ["Mock interviews", "Presentations"]
      }
    ],
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "deadline": "6 months",
        "cost": 15000,
        "priority": "Recommended"
      }
    ]
  },
  "learningResources": [
    {
      "title": "Python for Data Science",
      "type": "Course",
      "platform": "Coursera",
      "duration": "3 months",
      "cost": 5000,
      "prerequisite": [],
      "status": "Not Started",
      "url": "https://coursera.org/..."
    }
  ],
  "interviewPrep": {
    "technical": {
      "topics": ["Data Structures", "Algorithms", "System Design"],
      "practiceProblems": 150,
      "mockInterviews": 5,
      "targetScore": 85
    },
    "behavioral": {
      "scenarios": ["Leadership", "Conflict Resolution", "Teamwork"],
      "starStories": 10,
      "practiceHours": 20
    },
    "assessments": {
      "platforms": ["LeetCode", "HackerRank"],
      "targetScore": 90,
      "completed": 0
    }
  },
  "timeline_phases": [
    {
      "phase": "Foundation Protocol",
      "action": "Acquire baseline technical capabilities",
      "duration": "3 months",
      "weeklyHours": 15,
      "milestones": ["Complete Python course", "Build 2 projects"],
      "dependencies": []
    },
    {
      "phase": "Skill Amplification",
      "action": "Advanced technical training and certification",
      "duration": "4 months",
      "weeklyHours": 20,
      "milestones": ["AWS certification", "100 LeetCode problems"],
      "dependencies": ["Foundation Protocol"]
    },
    {
      "phase": "Placement Readiness",
      "action": "Interview preparation and company applications",
      "duration": "2 months",
      "weeklyHours": 25,
      "milestones": ["5 mock interviews", "Apply to 20 companies"],
      "dependencies": ["Skill Amplification"]
    }
  ],
  "placementOutcomes": {
    "targetCompanies": ["Google", "Microsoft", "Amazon"],
    "expectedCTC": {
      "min": 1200000,
      "max": 2000000,
      "currency": "INR"
    },
    "roleType": "Product-based",
    "successProbability": 75,
    "alternativePaths": ["Startup", "Service-based companies"]
  },
  "glitches": [
    {
      "type": "Time",
      "description": "⚠️ TEMPORAL ANOMALY: Timeline requires 25 hrs/week during final phase - may conflict with academic schedule",
      "severity": "Medium",
      "resolution": "Adjust to 15 hrs/week and extend duration"
    },
    {
      "type": "Prerequisite",
      "description": "⚠️ SKILL GAP DETECTED: Advanced algorithms require strong foundation in data structures",
      "severity": "High"
    }
  ],
  "status": "STABLE"
}

RULES:
- Include 2-4 technical skills, 1-2 soft skills, 0-2 certifications
- Provide 3-5 learning resources with realistic costs (INR)
- Include 3-4 timeline phases with realistic weekly hours (10-25)
- Set success probability based on subject's profile (50-90%)
- Add 1-3 glitches with appropriate severity
- Status is "BREACH DETECTED" if comparing paths or critical conflicts exist
- Use ominous scientific language throughout

Subject Request: ${userMessage.content}

Return ONLY the JSON object, nothing else:`;

  const response = await model.invoke([new HumanMessage(plannerPrompt)]);
  
  return {
    messages: [new AIMessage({
      content: `${response.content}`,
      name: "Career Reality Architect"
    })],
  };
}

// Executor Node: Validates and enriches the JSON output
async function executorNode(state: AgentState): Promise<Partial<AgentState>> {
  const plannerMessage = state.messages[state.messages.length - 1];
  
  let parsedData: CareerRealityOutput | null = null;
  try {
    const content = plannerMessage.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("JSON parsing error:", error);
  }

  if (parsedData) {
    return {
      messages: [new AIMessage({
        content: JSON.stringify(parsedData, null, 2),
        name: "Executor"
      })],
    };
  }

  return {
    messages: [new AIMessage({
      content: plannerMessage.content as string,
      name: "Executor"
    })],
  };
}

// Build the LangGraph State Machine
const workflow = new StateGraph(MessagesAnnotation)
  .addNode("planner", plannerNode)
  .addNode("executor", executorNode)
  .addEdge(START, "planner")
  .addEdge("planner", "executor")
  .addEdge("executor", END);

// Compile and export the agent
export const agent = workflow.compile();

// Export types
export type { AgentState };
