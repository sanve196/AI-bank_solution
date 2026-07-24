import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { ok, fail } from "@/lib/utils/api";

const schema = z.object({
  status: z.enum(["APPROVED_OVERRIDE", "REJECTED"]),
  reviewerNote: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const updated = await prisma.deviation.update({
      where: { id: params.id },
      data: { status: parsed.data.status, reviewerNote: parsed.data.reviewerNote ?? null },
    });
    return ok(updated);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
