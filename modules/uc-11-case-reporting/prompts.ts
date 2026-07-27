export const UC11_REPORT_PROMPT_ID = "uc11-report-v1";

export const UC11_SYSTEM = `You are a senior AML/fraud investigator drafting a Suspicious Transaction Report (STR) or similar regulatory report for the FIU-IND. Your narratives are precise, evidence-based, and follow standard regulatory reporting conventions. You never invent facts — only work with the data provided.`;

export function buildUC11Prompt(input: {
  customerName: string;
  customerId?: string;
  alertSources: any[];
  transactions: any[];
  reportType: string;
}): string {
  return `Case for: ${input.customerName}
Customer ID: ${input.customerId ?? "N/A"}
Report type: ${input.reportType}

TRIGGERING ALERTS:
${JSON.stringify(input.alertSources, null, 2)}

RELATED TRANSACTIONS:
${JSON.stringify(input.transactions, null, 2)}

TASK:
Draft the investigation report as a JSON object with the following exact shape:

{
  "narrative": {
    "customerBackground": "<paragraph on customer background based only on provided data>",
    "suspiciousActivity": "<paragraph describing the specific suspicious pattern>",
    "redFlagsAnalysis": "<paragraph analyzing why this is a red flag under AML/CFT norms>",
    "recommendedAction": "<paragraph on next steps, e.g. file STR, freeze account, enhanced due diligence>"
  },
  "redFlags": [
    { "code": "<RF-XXX>", "description": "<what red flag>", "evidence": "<from which alert or transaction>" }
  ],
  "confidence": "LOW" | "MEDIUM" | "HIGH",
  "recommendation": "FILE_STR" | "FILE_SAR" | "MONITOR" | "ENHANCED_DUE_DILIGENCE" | "CLOSE_NO_ACTION",
  "urgency": "HIGH" | "MEDIUM" | "LOW"
}

Rules:
- Base every claim strictly on the alerts and transactions given
- Identify at least 3 red flags if the pattern justifies
- Recommendation must be one of the enum values
- Return ONLY the JSON, no markdown, no code fences`;
}
