import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ok, fail } from "@/lib/utils/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const app = await prisma.application.findUnique({
      where: { id: params.id },
      include: { deviations: { orderBy: { severity: "asc" } } },
    });
    if (!app) return fail("NOT_FOUND", "Application not found", 404);
    return ok(app);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
