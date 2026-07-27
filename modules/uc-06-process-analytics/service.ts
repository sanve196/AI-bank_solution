import { prisma } from "../../lib/db/prisma";
import { callClaude } from "../../lib/ai/claude";
import { buildUC06Prompt, UC06_SYSTEM, UC06_CHAT_PROMPT_ID } from "./prompts";
import { buildMetricsContext } from "./metrics";

export interface ChatAnswer {
  answer: string;
  keyPoints: string[];
  chartHint: "bar" | "line" | "compare" | null;
  chartData: Array<{ label: string; value: number }> | null;
  suggestedFollowUps: string[];
}

export async function askQuestion(sessionId: string, question: string) {
  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!session) throw new Error("Session not found");

  // Persist user message immediately
  await prisma.chatMessage.create({
    data: { sessionId, role: "user", content: question },
  });

  const metricsContext = await buildMetricsContext();

  const result = await callClaude<ChatAnswer>({
    useCase: "UC-06",
    promptId: UC06_CHAT_PROMPT_ID,
    prompt: buildUC06Prompt({
      question,
      metricsContext,
      history: session.messages.map((m: any) => ({ role: m.role, content: m.content })),
    }),
    system: UC06_SYSTEM,
    jsonMode: true,
    maxTokens: 1500,
  });

  const parsed = result.parsed;
  if (!parsed) throw new Error("Claude returned invalid JSON");

  // Persist assistant message
  const assistantMsg = await prisma.chatMessage.create({
    data: {
      sessionId,
      role: "assistant",
      content: parsed.answer,
      data: parsed as any,
    },
  });

  // Auto-generate a title from the first user question
  if (session.title === "New chat" && session.messages.length === 0) {
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: question.slice(0, 60) },
    });
  } else {
    await prisma.chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
  }

  return { message: assistantMsg, parsed };
}
