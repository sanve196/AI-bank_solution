/**
 * Data access layer — Prisma-backed.
 * Same interface as before so existing UC-01 code keeps working.
 */
import { prisma } from "./db/prisma";

// ---- Applications (UC-01) ----
export const Applications = {
  async create(data: {
    applicantName: string;
    productType: string;
    extractedData?: Record<string, unknown>;
    status?: string;
  }) {
    return prisma.application.create({
      data: {
        applicantName: data.applicantName,
        productType: data.productType,
        status: data.status ?? "DRAFT",
        extractedData: data.extractedData ?? {},
      },
    });
  },
  async update(id: string, patch: any) {
    return prisma.application.update({ where: { id }, data: patch });
  },
  async get(id: string) {
    return prisma.application.findUnique({ where: { id } });
  },
  async list() {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { _count: { select: { deviations: true } } },
    });
    return apps;
  },
};

// ---- Deviations (UC-01) ----
export const Deviations = {
  async create(data: {
    applicationId: string;
    severity: string;
    sopClauseId: string;
    expectedValue: string;
    actualValue: string;
    justification: string;
  }) {
    return prisma.deviation.create({ data });
  },
  async update(id: string, patch: any) {
    return prisma.deviation.update({ where: { id }, data: patch });
  },
  async byApplication(applicationId: string) {
    const rank: Record<string, number> = { CRITICAL: 0, MAJOR: 1, MINOR: 2 };
    const rows = await prisma.deviation.findMany({ where: { applicationId } });
    return rows.sort((a: any, b: any) => (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9));
  },
  async deleteByApplication(applicationId: string) {
    await prisma.deviation.deleteMany({ where: { applicationId } });
  },
};

// ---- AI call log (used by lib/ai/claude.ts) ----
export const AICallLog = {
  async add(record: {
    useCase: string;
    promptId: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
    request?: any;
    response?: any;
  }) {
    // fire-and-forget from the caller; wrapped in try so DB blips don't break UX
    try {
      await prisma.aICall.create({
        data: {
          useCase: record.useCase,
          promptId: record.promptId,
          model: record.model,
          inputTokens: record.inputTokens,
          outputTokens: record.outputTokens,
          latencyMs: record.latencyMs,
          request: record.request ?? {},
          response: record.response ?? {},
        },
      });
    } catch (e) {
      console.error("[AICallLog] persist failed:", e);
    }
  },
};
