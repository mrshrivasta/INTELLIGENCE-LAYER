import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json();

    const aiResponses: Record<string, string> = {
      roadmap: "Your personalized roadmap is designed based on your goals. You can view it in the Roadmap section. It includes foundational, intermediate, and advanced phases tailored to your field of interest.",
      assessment: "Assessments adapt to your skill level. You can choose difficulty levels (Easy, Medium, Hard) and each test generates unique questions to prevent repetition.",
      guidance: "Daily, weekly, and monthly guidance is available in the Guidance section. It provides specific learning objectives based on your current progress and goals.",
      analytics: "Your analytics show test scores, topic accuracy, and progress over time. Check the Analytics page for detailed insights.",
      help: "I can help you with questions about your learning path, assessments, analytics, or any feature of the platform. What would you like to know?",
    };

    const lowerMessage = message.toLowerCase();
    let response = aiResponses.help;

    if (lowerMessage.includes("roadmap") || lowerMessage.includes("learning path")) {
      response = aiResponses.roadmap;
    } else if (lowerMessage.includes("assessment") || lowerMessage.includes("test") || lowerMessage.includes("quiz")) {
      response = aiResponses.assessment;
    } else if (lowerMessage.includes("guidance") || lowerMessage.includes("what to learn") || lowerMessage.includes("study")) {
      response = aiResponses.guidance;
    } else if (lowerMessage.includes("analytics") || lowerMessage.includes("progress") || lowerMessage.includes("score")) {
      response = aiResponses.analytics;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
