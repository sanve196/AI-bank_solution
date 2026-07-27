import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/db/prisma";
import { ok, fail } from "../../../../../lib/utils/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const s = await prisma.chatSession.findUnique({
      where: { id: params.id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
    if (!s) return fail("NOT_FOUND", "Session not found", 404);
    return ok(s);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.chatSession.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
