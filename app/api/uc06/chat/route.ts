import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail } from "../../../../lib/utils/api";
import { askQuestion } from "../../../../modules/uc-06-process-analytics/service";

const schema = z.object({
  sessionId: z.string().min(1),
  question: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const result = await askQuestion(parsed.data.sessionId, parsed.data.question);
    return ok(result);
  } catch (e: any) {
    return fail("CHAT_ERROR", e.message ?? "Chat failed", 500);
  }
}
