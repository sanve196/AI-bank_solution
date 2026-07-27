import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/db/prisma";
import { ok, fail } from "../../../../lib/utils/api";
import { SAMPLE_REGULATIONS } from "../../../../modules/uc-09-regulatory/seed-data";

const createSchema = z.object({
  regulator: z.enum(["RBI", "SEBI", "IRDAI", "MOF"]),
  title: z.string().min(1),
  circularNumber: z.string().optional(),
  publishedAt: z.string().optional(),
  fullText: z.string().min(20),
});

export async function GET() {
  try {
    // Seed on first access if empty
    const count = await prisma.regulation.count();
    if (count === 0) {
      await prisma.regulation.createMany({
        data: SAMPLE_REGULATIONS.map((r) => ({
          regulator: r.regulator,
          title: r.title,
          circularNumber: r.circularNumber,
          publishedAt: r.publishedAt,
          fullText: r.fullText,
          status: "NEW",
        })),
      });
    }
    const rows = await prisma.regulation.findMany({
      orderBy: { publishedAt: "desc" },
      take: 100,
      select: {
        id: true, regulator: true, title: true, circularNumber: true,
        publishedAt: true, status: true, summary: true,
      },
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
    const row = await prisma.regulation.create({
      data: {
        regulator: parsed.data.regulator,
        title: parsed.data.title,
        circularNumber: parsed.data.circularNumber,
        publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : new Date(),
        fullText: parsed.data.fullText,
        status: "NEW",
      },
    });
    return ok(row);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
