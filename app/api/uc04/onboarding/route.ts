import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/db/prisma";
import { ok, fail } from "../../../../lib/utils/api";

const createSchema = z.object({
  applicantName: z.string().min(1),
  applicantType: z.enum(["INDIVIDUAL", "SME", "CORPORATE"]),
  productType: z.enum(["SAVINGS", "CURRENT", "TERM_LOAN", "WORKING_CAPITAL"]),
  kycData: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    const rows = await prisma.onboarding.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return ok(rows);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const row = await prisma.onboarding.create({
      data: {
        applicantName: parsed.data.applicantName,
        applicantType: parsed.data.applicantType,
        productType: parsed.data.productType,
        kycData: (parsed.data.kycData ?? {}) as any,
        status: "DRAFT",
      },
    });
    return ok(row);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
