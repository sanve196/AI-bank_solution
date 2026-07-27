import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail } from "../../../../../../lib/utils/api";
import { finalizeOnboarding } from "../../../../../../modules/uc-04-onboarding/service";

const schema = z.object({ decision: z.enum(["APPROVED", "REJECTED"]) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const updated = await finalizeOnboarding(params.id, parsed.data.decision);
    return ok(updated);
  } catch (e: any) {
    return fail("FINALIZE_ERROR", e.message ?? "Failed", 500);
  }
}
