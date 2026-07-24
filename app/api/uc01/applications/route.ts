import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { ok, fail } from "@/lib/utils/api";

const createSchema = z.object({
  applicantName: z.string().min(1),
  productType: z.enum(["TERM_LOAN", "WORKING_CAPITAL"]),
  extractedData: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    const apps = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { deviations: true } } },
      take: 100,
    });
    return ok(apps);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);

    const app = await prisma.application.create({
      data: {
        applicantName: parsed.data.applicantName,
        productType: parsed.data.productType,
        extractedData: parsed.data.extractedData ?? {},
        status: "DRAFT",
      },
    });
    return ok(app);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
