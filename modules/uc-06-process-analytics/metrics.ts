import { prisma } from "../../lib/db/prisma";

/**
 * Build a compact metrics context string from real DB state + simulated
 * branch/team data. In production this would query real process events;
 * here we compute what we can from existing tables and augment with
 * realistic simulated data so the analytics chat has substance.
 */
export async function buildMetricsContext(): Promise<string> {
  const [
    appTotal, appByStatus, deviationTotal, deviationBySeverity,
    onboardingTotal, onboardingByStatus,
    regTotal, regByStatus,
    aiCallStats,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.application.groupBy({ by: ["status"], _count: true }),
    prisma.deviation.count(),
    prisma.deviation.groupBy({ by: ["severity"], _count: true }),
    prisma.onboarding.count(),
    prisma.onboarding.groupBy({ by: ["status"], _count: true }),
    prisma.regulation.count(),
    prisma.regulation.groupBy({ by: ["status"], _count: true }),
    prisma.aICall.aggregate({
      _count: true,
      _sum: { inputTokens: true, outputTokens: true, latencyMs: true },
      _avg: { latencyMs: true },
    }),
  ]);

  // Simulated branch KPIs (in real production, from ProcessEvent aggregations)
  const branchSim = [
    { branch: "Mumbai-Fort",       onboardingsThisMonth: 42, avgTatHours: 18, errorRate: 0.02, csat: 4.4 },
    { branch: "Delhi-CP",          onboardingsThisMonth: 51, avgTatHours: 22, errorRate: 0.03, csat: 4.2 },
    { branch: "Bengaluru-Koramangala", onboardingsThisMonth: 38, avgTatHours: 14, errorRate: 0.01, csat: 4.6 },
    { branch: "Pune-Kothrud",      onboardingsThisMonth: 29, avgTatHours: 26, errorRate: 0.05, csat: 3.9 },
    { branch: "Chennai-T.Nagar",   onboardingsThisMonth: 33, avgTatHours: 20, errorRate: 0.02, csat: 4.3 },
    { branch: "Hyderabad-Banjara",  onboardingsThisMonth: 47, avgTatHours: 16, errorRate: 0.02, csat: 4.5 },
  ];
  const bestBranch = [...branchSim].sort((a, b) => a.avgTatHours - b.avgTatHours)[0];
  const worstBranch = [...branchSim].sort((a, b) => b.avgTatHours - a.avgTatHours)[0];

  return `
UC-01 (SOP DEVIATION IDENTIFICATION):
- Total applications: ${appTotal}
- By status: ${appByStatus.map((s: any) => `${s.status}=${s._count}`).join(", ") || "none"}
- Deviations found: ${deviationTotal}
- By severity: ${deviationBySeverity.map((d: any) => `${d.severity}=${d._count}`).join(", ") || "none"}

UC-04 (CUSTOMER ONBOARDING):
- Total cases: ${onboardingTotal}
- By status: ${onboardingByStatus.map((s: any) => `${s.status}=${s._count}`).join(", ") || "none"}

UC-09 (REGULATORY COMPANION):
- Total regulations ingested: ${regTotal}
- By status: ${regByStatus.map((s: any) => `${s.status}=${s._count}`).join(", ") || "none"}

AI USAGE (across all modules):
- Total Claude calls: ${aiCallStats._count}
- Total input tokens: ${aiCallStats._sum.inputTokens ?? 0}
- Total output tokens: ${aiCallStats._sum.outputTokens ?? 0}
- Average latency: ${Math.round(aiCallStats._avg.latencyMs ?? 0)} ms

BRANCH-LEVEL METRICS (this month, simulated):
${branchSim.map((b) => `- ${b.branch}: ${b.onboardingsThisMonth} onboardings, avg TAT ${b.avgTatHours}h, error rate ${(b.errorRate * 100).toFixed(1)}%, CSAT ${b.csat}/5`).join("\n")}
- Best-performing branch by TAT: ${bestBranch.branch} (${bestBranch.avgTatHours}h)
- Worst-performing branch by TAT: ${worstBranch.branch} (${worstBranch.avgTatHours}h)

PROCESS TAT (simulated stage-level averages):
- KYC extraction stage: 2.1h
- Deviation review stage: 8.4h
- Approval routing stage: 4.3h
- Account setup stage: 3.6h
`;
}
