import { NextRequest } from "next/server";
import { prisma } from "../../../../lib/db/prisma";
import { ok, fail } from "../../../../lib/utils/api";

export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      where: { useCase: "UC-06" },
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: { _count: { select: { messages: true } } },
    });
    return ok(sessions);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}

export async function POST(_req: NextRequest) {
  try {
    const s = await prisma.chatSession.create({ data: { useCase: "UC-06" } });
    return ok(s);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
