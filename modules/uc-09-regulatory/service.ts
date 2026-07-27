import { prisma } from "../../lib/db/prisma";
import { callClaude } from "../../lib/ai/claude";
import { buildUC09Prompt, UC09_SYSTEM, UC09_ANALYZE_PROMPT_ID } from "./prompts";

export interface AnalysisResult {
  summary: string;
  obligations: Array<{ id: string; text: string; effectiveDate: string; priority: "HIGH" | "MEDIUM" | "LOW" }>;
  impactMatrix: Array<{ area: string; impact: string; changesRequired: string[] }>;
  riskIfIgnored: string;
  keyStakeholders: string[];
}

export async function analyzeRegulation(id: string) {
  const reg = await prisma.regulation.findUnique({ where: { id } });
  if (!reg) throw new Error("Regulation not found");
  if (!reg.fullText) throw new Error("Regulation has no text to analyze");

  const prompt = buildUC09Prompt({ regulator: reg.regulator, title: reg.title, fullText: reg.fullText });

  const result = await callClaude<AnalysisResult>({
    useCase: "UC-09",
    promptId: UC09_ANALYZE_PROMPT_ID,
    prompt,
    system: UC09_SYSTEM,
    jsonMode: true,
    maxTokens: 3000,
  });

  const parsed = result.parsed;
  if (!parsed) throw new Error("Claude returned invalid JSON");

  await prisma.regulation.update({
    where: { id },
    data: {
      summary: parsed.summary,
      obligations: parsed.obligations as any,
      impactMatrix: { impactMatrix: parsed.impactMatrix, riskIfIgnored: parsed.riskIfIgnored, keyStakeholders: parsed.keyStakeholders } as any,
      status: "ANALYZED",
    },
  });

  return { latencyMs: result.latencyMs, inputTokens: result.inputTokens, outputTokens: result.outputTokens };
}
