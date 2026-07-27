import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/db/prisma";
import { ok, fail } from "../../../../../lib/utils/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const row = await prisma.regulation.findUnique({ where: { id: params.id } });
    if (!row) return fail("NOT_FOUND", "Regulation not found", 404);
    return ok(row);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
