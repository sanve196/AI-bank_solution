import { NextRequest } from "next/server";
import { ok, fail } from "../../../../../../lib/utils/api";
import { analyzeRegulation } from "../../../../../../modules/uc-09-regulatory/service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await analyzeRegulation(params.id);
    return ok(result);
  } catch (e: any) {
    return fail("ANALYZE_ERROR", e.message ?? "Analyze failed", 500);
  }
}
