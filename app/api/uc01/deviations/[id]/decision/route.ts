import { NextRequest } from "next/server";
import { z } from "zod";
import { Deviations } from "../../../../../../lib/store";
import { ok, fail } from "../../../../../../lib/utils/api";

const schema = z.object({
  status: z.enum(["APPROVED_OVERRIDE", "REJECTED"]),
  reviewerNote: z.string().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const updated = Deviations.update(params.id, {
      status: parsed.data.status,
      reviewerNote: parsed.data.reviewerNote ?? null,
    });
    if (!updated) return fail("NOT_FOUND", "Deviation not found", 404);
    return ok(updated);
  } catch (e: any) {
    return fail("ERROR", e.message ?? "Failed", 500);
  }
}
