import { prisma } from "../../../../lib/db/prisma";
import { ok, fail } from "../../../../lib/utils/api";
import { SAMPLE_CASES } from "../../../../modules/uc-11-case-reporting/seed-data";

export async function GET() {
  try {
    const count = await prisma.investigationCase.count();
    if (count === 0) {
      for (const c of SAMPLE_CASES) {
        await prisma.investigationCase.create({
          data: {
            caseNumber: c.caseNumber,
            customerName: c.customerName,
            customerId: c.customerId,
            alertSources: c.alertSources as any,
            transactions: c.transactions as any,
            reportType: c.reportType,
            status: c.status,
          },
        });
      }
    }
    const rows = await prisma.investigationCase.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return ok(rows);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
