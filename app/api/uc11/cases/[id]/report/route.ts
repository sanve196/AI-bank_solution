import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db/prisma";

/** Export the narrative as plain text (regulator-friendly). */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const c = await prisma.investigationCase.findUnique({ where: { id: params.id } });
  if (!c) return new NextResponse("Not found", { status: 404 });
  const rf: any = c.redFlags ?? {};
  const body = [
    `SUSPICIOUS TRANSACTION REPORT`,
    `Case Number: ${c.caseNumber}`,
    `Customer: ${c.customerName}${c.customerId ? " (" + c.customerId + ")" : ""}`,
    `Report Type: ${c.reportType}`,
    `Recommendation: ${c.recommendation ?? "PENDING"}`,
    `Confidence: ${rf.confidence ?? "N/A"} | Urgency: ${rf.urgency ?? "N/A"}`,
    `Generated: ${new Date().toISOString()}`,
    ``,
    `=========================================`,
    ``,
    c.narrative ?? "(No narrative generated yet)",
    ``,
    `=========================================`,
    ``,
    `RED FLAGS`,
    ...((rf.flags ?? []) as any[]).map((f: any, i: number) => `${i + 1}. [${f.code}] ${f.description}\n   Evidence: ${f.evidence}`),
  ].join("\n");
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${c.caseNumber}-report.txt"`,
    },
  });
}
