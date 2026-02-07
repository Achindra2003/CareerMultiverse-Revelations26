import { ChatGroq } from "@langchain/groq";
import { StateGraph, MessagesAnnotation, START, END } from "@langchain/langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";

// Initialize the Groq model
const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// Define the state interface extending MessagesAnnotation
interface AgentState {
  messages: BaseMessage[];
}

// Planner Node: Career Reality Architect
async function plannerNode(state: AgentState): Promise<Partial<AgentState>> {
  const userMessage = state.messages[state.messages.length - 1];
  
  const plannerPrompt = `ROLE: You are the 'Career Reality Architect' (CRA).

TASK:
1. DETECT INTENT: Is the user 'Forking' a new path (e.g. 'I want to be a pilot') or 'Merging' two paths (e.g. 'MBA vs Pilot')?
2. GENERATE TIMELINE: Create a structured 3-phase career plan with dates and milestones.
3. DETECT GLITCHES: If comparing/merging, identify conflicts (e.g. 'Time Conflict', 'Skill Gap').

OUTPUT FORMAT: Use Markdown with emojis.
- Header: ## 🌌 Reality Status: [Active/Forked/Glitched]
- Badges: **Alignment:** SDG 4 (Quality Education) & SDG 8 (Decent Work)
- Section: ### 📍 Timeline Milestones
- Section: ### ⚠️ Reality Glitches (Collision Check)
- Section: ### 💡 Architect's Advice

User Request: ${userMessage.content}

Generate the career reality simulation now:`;

  const response = await model.invoke([new HumanMessage(plannerPrompt)]);
  
  return {
    messages: [new AIMessage({
      content: `${response.content}`,
      name: "Career Reality Architect"
    })],
  };
}

// Executor Node: Simulates executing the planned steps
async function executorNode(state: AgentState): Promise<Partial<AgentState>> {
  const plannerMessage = state.messages[state.messages.length - 1];
  
  const executorPrompt = `You are an executor. The planner has created the following steps:

${plannerMessage.content}

Now simulate executing these steps. For each step, provide a brief status update showing it's being executed. Be creative and show progress.`;

  const response = await model.invoke([new HumanMessage(executorPrompt)]);
  
  return {
    messages: [new AIMessage({
      content: `⚡ **Execution Phase**\n\n${response.content}`,
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
