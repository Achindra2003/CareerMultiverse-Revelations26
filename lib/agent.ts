import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

// Initialize the Groq model
// For faster demo performance, you can switch to "llama-3-8b-instant"
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile", // Change to "llama-3-8b-instant" if slow on 4G
  temperature: 0.7,
});

// Define the state interface extending MessagesAnnotation
interface AgentState {
  messages: BaseMessage[];
}

// Define the strict JSON schema for Career Reality output
export interface CareerRealityOutput {
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

// Planner Node: Career Reality Architect with JSON Output
async function plannerNode(state: AgentState): Promise<Partial<AgentState>> {
  const userMessage = state.messages[state.messages.length - 1];
  
  const plannerPrompt = `ROLE: You are the 'Career Reality Architect' (CRA).

CRITICAL: You MUST respond ONLY with valid JSON. NO MARKDOWN. NO explanatory text. ONLY JSON.

TASK:
1. DETECT INTENT: Is the user 'Forking' a new path (e.g. 'I want to be a pilot') or 'Comparing/Merging' two paths (e.g. 'MBA vs Pilot')?
2. GENERATE TIMELINE: Create a structured 3-phase career plan with specific actions and durations.
3. DETECT GLITCHES: 
   - If the user is COMPARING two or more career paths, you MUST populate the 'glitches' array with AT LEAST 2 conflicts.
   - Common glitches: "Time Conflict", "Skill Gap", "Financial Constraint", "Location Mismatch", "Opportunity Cost"
   - If comparing paths, set status to "Critical". Otherwise, set to "Stable".

STRICT OUTPUT FORMAT (JSON ONLY):
{
  "reality_name": "Brief descriptive name of the career path",
  "sdg_alignment": ["SDG 4", "SDG 8"],
  "timeline_phases": [
     {"phase": "Foundation", "action": "Specific action to take", "duration": "X months/years"},
     {"phase": "Build", "action": "Specific action to take", "duration": "X months/years"},
     {"phase": "Establish", "action": "Specific action to take", "duration": "X months/years"}
  ],
  "glitches": ["Conflict 1", "Conflict 2"],
  "status": "Stable" | "Critical"
}

RULES:
- ALWAYS include exactly 3 timeline phases
- If user is COMPARING paths, glitches array MUST have at least 2 items
- If user is forking a single path, glitches can be empty or contain potential risks
- SDG alignment is always ["SDG 4", "SDG 8"]
- Status is "Critical" if comparing paths, "Stable" otherwise

User Request: ${userMessage.content}

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
  
  // Try to parse the JSON to validate it
  let parsedData: CareerRealityOutput | null = null;
  try {
    // Extract JSON from the response (in case there's any extra text)
    const content = plannerMessage.content as string;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedData = JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("JSON parsing error:", error);
  }

  // If parsing succeeded, return the validated JSON
  if (parsedData) {
    return {
      messages: [new AIMessage({
        content: JSON.stringify(parsedData, null, 2),
        name: "Executor"
      })],
    };
  }

  // If parsing failed, return the original content
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

// Export types for use in API routes
export type { AgentState };
