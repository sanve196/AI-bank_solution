import { NextRequest } from "next/server";
import { ok, fail } from "../../../../../../lib/utils/api";
import { generateReport } from "../../../../../../modules/uc-11-case-reporting/service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await generateReport(params.id);
    return ok(result);
  } catch (e: any) {
    return fail("GENERATE_ERROR", e.message ?? "Failed", 500);
  }
}
