import { prisma } from "../../lib/db/prisma";
import { callClaude } from "../../lib/ai/claude";
import { buildUC04Prompt, UC04_SYSTEM, UC04_VERIFY_PROMPT_ID } from "./prompts";

export interface VerificationResult {
  riskRating: "LOW" | "MEDIUM" | "HIGH";
  verificationChecks: Array<{ check: string; status: "PASS" | "FAIL" | "WARN"; note: string }>;
  documentFlags: Array<{ field: string; issue: string; severity: "MINOR" | "MAJOR" }>;
  recommendedCovenants: Array<{ code: string; description: string; reason: string }>;
  summary: string;
  recommendation: "APPROVE" | "APPROVE_WITH_CONDITIONS" | "REVIEW" | "REJECT";
}

export async function verifyOnboarding(id: string) {
  const onboarding = await prisma.onboarding.findUnique({ where: { id } });
  if (!onboarding) throw new Error("Onboarding case not found");
  if (!onboarding.kycData) throw new Error("No KYC data to verify");

  await prisma.onboarding.update({ where: { id }, data: { status: "VERIFYING" } });

  try {
    const prompt = buildUC04Prompt({
      applicantName: onboarding.applicantName,
      applicantType: onboarding.applicantType,
      productType: onboarding.productType,
      kycData: onboarding.kycData as Record<string, unknown>,
    });

    const result = await callClaude<VerificationResult>({
      useCase: "UC-04",
      promptId: UC04_VERIFY_PROMPT_ID,
      prompt,
      system: UC04_SYSTEM,
      jsonMode: true,
      maxTokens: 2048,
    });

    const parsed = result.parsed;
    if (!parsed) throw new Error("Claude returned invalid JSON");

    await prisma.onboarding.update({
      where: { id },
      data: {
        status: "REVIEW",
        verificationResults: parsed as any,
        covenants: (parsed.recommendedCovenants ?? []) as any,
        aiSummary: parsed.summary,
      },
    });

    return { latencyMs: result.latencyMs, inputTokens: result.inputTokens, outputTokens: result.outputTokens };
  } catch (err) {
    await prisma.onboarding.update({ where: { id }, data: { status: "DRAFT" } }).catch(() => {});
    throw err;
  }
}

export async function finalizeOnboarding(id: string, decision: "APPROVED" | "REJECTED") {
  const onboarding = await prisma.onboarding.findUnique({ where: { id } });
  if (!onboarding) throw new Error("Not found");

  const updated = await prisma.onboarding.update({
    where: { id },
    data: {
      status: decision,
      accountNumber: decision === "APPROVED" ? generateAccountNumber(onboarding.productType) : null,
    },
  });
  return updated;
}

function generateAccountNumber(productType: string): string {
  const prefix = productType === "SAVINGS" ? "SB" :
                 productType === "CURRENT" ? "CA" :
                 productType === "TERM_LOAN" ? "TL" : "WC";
  const num = Math.floor(Math.random() * 900000000 + 100000000);
  return `${prefix}${num}`;
}
