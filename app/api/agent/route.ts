import { NextRequest, NextResponse } from "next/server";
import { agent } from "@/lib/agent";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Invalid prompt. Please provide a valid string." },
        { status: 400 }
      );
    }

    // Invoke the agent with the user's prompt
    const result = await agent.invoke({
      messages: [new HumanMessage(prompt)],
    });

    // Extract the message history and final result
    const messages = result.messages.map((msg: any) => ({
      role: msg._getType(),
      content: msg.content,
      name: msg.name || null,
    }));

    const finalResult = messages[messages.length - 1]?.content || "No result generated.";

    return NextResponse.json({
      success: true,
      finalResult,
      messageHistory: messages,
    });
  } catch (error: any) {
    console.error("Agent execution error:", error);
    return NextResponse.json(
      { 
        error: "Failed to execute agent", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
