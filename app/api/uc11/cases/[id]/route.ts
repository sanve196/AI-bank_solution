import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../../lib/db/prisma";
import { ok, fail } from "../../../../../lib/utils/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const c = await prisma.investigationCase.findUnique({ where: { id: params.id } });
    if (!c) return fail("NOT_FOUND", "Case not found", 404);
    return ok(c);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}

const patchSchema = z.object({
  narrative: z.string().optional(),
  status: z.enum(["OPEN", "IN_REVIEW", "FILED", "CLOSED"]).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const c = await prisma.investigationCase.update({ where: { id: params.id }, data: parsed.data });
    return ok(c);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
