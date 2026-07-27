import { NextRequest } from "next/server";
import { ok, fail } from "../../../../../../lib/utils/api";
import { verifyOnboarding } from "../../../../../../modules/uc-04-onboarding/service";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await verifyOnboarding(params.id);
    return ok(result);
  } catch (e: any) {
    return fail("VERIFY_ERROR", e.message ?? "Verify failed", 500);
  }
}
