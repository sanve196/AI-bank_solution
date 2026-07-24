/**
 * In-memory data store — used in place of a database for the demo deployment.
 * Data resets on every server restart. Swap this out for Prisma when a real DB is added.
 */

export interface Application {
  id: string;
  applicantName: string;
  productType: string;
  status: "DRAFT" | "ANALYZING" | "REVIEW" | "APPROVED" | "REJECTED";
  extractedData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Deviation {
  id: string;
  applicationId: string;
  severity: "CRITICAL" | "MAJOR" | "MINOR";
  sopClauseId: string;
  expectedValue: string;
  actualValue: string;
  justification: string;
  status: "OPEN" | "APPROVED_OVERRIDE" | "REJECTED";
  reviewerNote?: string | null;
  createdAt: string;
}

export interface AICallRecord {
  id: string;
  useCase: string;
  promptId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  createdAt: string;
}

// Use globalThis so hot-reload in dev doesn't wipe the store on every request
type Store = {
  applications: Map<string, Application>;
  deviations: Map<string, Deviation>;
  aiCalls: AICallRecord[];
};

const g = globalThis as unknown as { __store?: Store };

export const store: Store =
  g.__store ??
  (g.__store = {
    applications: new Map(),
    deviations: new Map(),
    aiCalls: [],
  });

function id() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

// ---- Applications ----
export const Applications = {
  create(data: Omit<Application, "id" | "createdAt" | "updatedAt" | "status"> & { status?: Application["status"] }): Application {
    const now = new Date().toISOString();
    const app: Application = {
      id: id(),
      status: data.status ?? "DRAFT",
      applicantName: data.applicantName,
      productType: data.productType,
      extractedData: data.extractedData ?? {},
      createdAt: now,
      updatedAt: now,
    };
    store.applications.set(app.id, app);
    return app;
  },
  update(id: string, patch: Partial<Application>): Application | null {
    const existing = store.applications.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    store.applications.set(id, updated);
    return updated;
  },
  get(id: string): Application | null {
    return store.applications.get(id) ?? null;
  },
  list(): Application[] {
    return Array.from(store.applications.values()).sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt)
    );
  },
  countDeviations(appId: string): number {
    let n = 0;
    for (const d of store.deviations.values()) if (d.applicationId === appId) n++;
    return n;
  },
};

// ---- Deviations ----
export const Deviations = {
  create(data: Omit<Deviation, "id" | "createdAt" | "status"> & { status?: Deviation["status"] }): Deviation {
    const dev: Deviation = {
      id: id(),
      status: data.status ?? "OPEN",
      applicationId: data.applicationId,
      severity: data.severity,
      sopClauseId: data.sopClauseId,
      expectedValue: data.expectedValue,
      actualValue: data.actualValue,
      justification: data.justification,
      reviewerNote: data.reviewerNote ?? null,
      createdAt: new Date().toISOString(),
    };
    store.deviations.set(dev.id, dev);
    return dev;
  },
  update(id: string, patch: Partial<Deviation>): Deviation | null {
    const existing = store.deviations.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    store.deviations.set(id, updated);
    return updated;
  },
  byApplication(appId: string): Deviation[] {
    const severityRank = { CRITICAL: 0, MAJOR: 1, MINOR: 2 };
    return Array.from(store.deviations.values())
      .filter((d) => d.applicationId === appId)
      .sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  },
  deleteByApplication(appId: string) {
    for (const [k, v] of store.deviations.entries()) {
      if (v.applicationId === appId) store.deviations.delete(k);
    }
  },
};

// ---- AI Call log ----
export const AICallLog = {
  add(record: Omit<AICallRecord, "id" | "createdAt">) {
    store.aiCalls.push({
      id: id(),
      createdAt: new Date().toISOString(),
      ...record,
    });
    if (store.aiCalls.length > 500) store.aiCalls.shift();
  },
  recent(limit = 50): AICallRecord[] {
    return store.aiCalls.slice(-limit).reverse();
  },
};
