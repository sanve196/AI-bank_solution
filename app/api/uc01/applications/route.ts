import { NextRequest } from "next/server";
import { z } from "zod";
import { Applications } from "../../../../lib/store";
import { ok, fail } from "../../../../lib/utils/api";

const createSchema = z.object({
  applicantName: z.string().min(1),
  productType: z.enum(["TERM_LOAN", "WORKING_CAPITAL"]),
  extractedData: z.record(z.any()).optional(),
});

export async function GET() {
  try {
    const apps = await Applications.list();
    return ok(apps);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const app = await Applications.create({
      applicantName: parsed.data.applicantName,
      productType: parsed.data.productType,
      extractedData: parsed.data.extractedData ?? {},
    });
    return ok(app);
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
