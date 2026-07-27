import { prisma } from "../../lib/db/prisma";
import { callClaude } from "../../lib/ai/claude";
import { buildUC11Prompt, UC11_SYSTEM, UC11_REPORT_PROMPT_ID } from "./prompts";

export interface ReportResult {
  narrative: {
    customerBackground: string;
    suspiciousActivity: string;
    redFlagsAnalysis: string;
    recommendedAction: string;
  };
  redFlags: Array<{ code: string; description: string; evidence: string }>;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  recommendation: "FILE_STR" | "FILE_SAR" | "MONITOR" | "ENHANCED_DUE_DILIGENCE" | "CLOSE_NO_ACTION";
  urgency: "HIGH" | "MEDIUM" | "LOW";
}

export async function generateReport(id: string) {
  const c = await prisma.investigationCase.findUnique({ where: { id } });
  if (!c) throw new Error("Case not found");

  const result = await callClaude<ReportResult>({
    useCase: "UC-11",
    promptId: UC11_REPORT_PROMPT_ID,
    prompt: buildUC11Prompt({
      customerName: c.customerName,
      customerId: c.customerId ?? undefined,
      alertSources: c.alertSources as any[],
      transactions: (c.transactions ?? []) as any[],
      reportType: c.reportType,
    }),
    system: UC11_SYSTEM,
    jsonMode: true,
    maxTokens: 3000,
  });

  const parsed = result.parsed;
  if (!parsed) throw new Error("Claude returned invalid JSON");

  const fullNarrative = [
    `--- CUSTOMER BACKGROUND ---`,
    parsed.narrative.customerBackground,
    ``,
    `--- SUSPICIOUS ACTIVITY OBSERVED ---`,
    parsed.narrative.suspiciousActivity,
    ``,
    `--- ANALYSIS OF RED FLAGS ---`,
    parsed.narrative.redFlagsAnalysis,
    ``,
    `--- RECOMMENDED ACTION ---`,
    parsed.narrative.recommendedAction,
  ].join("\n");

  await prisma.investigationCase.update({
    where: { id },
    data: {
      narrative: fullNarrative,
      redFlags: { flags: parsed.redFlags, confidence: parsed.confidence, urgency: parsed.urgency } as any,
      recommendation: parsed.recommendation,
      status: "IN_REVIEW",
    },
  });

  return { latencyMs: result.latencyMs };
}
