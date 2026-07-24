import { Applications, Deviations } from "../../lib/store";
import { callClaude } from "../../lib/ai/claude";
import { buildUC01Prompt, UC01_SYSTEM, UC01_DEVIATION_PROMPT_ID } from "./prompts";

export const SAMPLE_SOP_RULES = {
  TERM_LOAN: [
    { id: "TL-001", description: "Applicant must have positive net profit in last 4 trailing quarters", expected: "profit_last_4q >= 0" },
    { id: "TL-002", description: "Auditor's report should not contain adverse remarks", expected: "auditor_remarks == 'clean'" },
    { id: "TL-003", description: "Industry outlook should not be negative", expected: "industry_outlook in ['stable','positive']" },
    { id: "TL-004", description: "Debt-to-equity ratio should be <= 3.0", expected: "debt_to_equity <= 3.0" },
    { id: "TL-005", description: "Minimum 3 years of business vintage", expected: "years_in_business >= 3" },
  ],
  WORKING_CAPITAL: [
    { id: "WC-001", description: "Current ratio must be at least 1.2", expected: "current_ratio >= 1.2" },
    { id: "WC-002", description: "Auditor's report should not contain adverse remarks", expected: "auditor_remarks == 'clean'" },
    { id: "WC-003", description: "Applicant must have positive net profit in last 2 trailing quarters", expected: "profit_last_2q >= 0" },
  ],
};

export interface DeviationDraft {
  severity: "CRITICAL" | "MAJOR" | "MINOR";
  sopClauseId: string;
  expectedValue: string;
  actualValue: string;
  justification: string;
}

export async function analyzeApplication(applicationId: string) {
  const app = await Applications.get(applicationId);
  if (!app) throw new Error("Application not found");
  if (!app.extractedData) throw new Error("Application has no extracted data to analyze");

  const rules = SAMPLE_SOP_RULES[app.productType as keyof typeof SAMPLE_SOP_RULES]
    ?? SAMPLE_SOP_RULES.TERM_LOAN;

  await Applications.update(applicationId, { status: "ANALYZING" });

  const prompt = buildUC01Prompt({
    productType: app.productType,
    applicantName: app.applicantName,
    applicantData: app.extractedData as Record<string, unknown>,
    sopRules: rules,
  });

  const result = await callClaude<DeviationDraft[]>({
    useCase: "UC-01",
    promptId: UC01_DEVIATION_PROMPT_ID,
    prompt,
    system: UC01_SYSTEM,
    jsonMode: true,
    maxTokens: 2048,
  });

  const deviations = Array.isArray(result.parsed) ? result.parsed : [];

  await Deviations.deleteByApplication(applicationId);
  for (const d of deviations) {
    await Deviations.create({
      applicationId,
      severity: d.severity,
      sopClauseId: d.sopClauseId,
      expectedValue: d.expectedValue,
      actualValue: d.actualValue,
      justification: d.justification,
    });
  }

  await Applications.update(applicationId, { status: "REVIEW" });

  return {
    deviationCount: deviations.length,
    latencyMs: result.latencyMs,
    inputTokens: result.inputTokens,
    outputTokens: result.outputTokens,
  };
}
