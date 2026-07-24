import { NextRequest } from "next/server";
import { ok, fail } from "../../../../../../lib/utils/api";
import { analyzeApplication } from "../../../../../../modules/uc-01-sop-deviation/service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await analyzeApplication(params.id);
    return ok(result);
  } catch (e: any) {
    return fail("ANALYZE_ERROR", e.message ?? "Analyze failed", 500);
  }
}
