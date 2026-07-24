import { NextRequest } from "next/server";
import { z } from "zod";
import { Applications } from "@/lib/store";
import { ok, fail } from "@/lib/utils/api";

const createSchema = z.object({
  applicantName: z.string().min(1),
  productType: z.enum(["TERM_LOAN", "WORKING_CAPITAL"]),
  extractedData: z.record(z.any()).optional(),
});

export async function GET() {
  const apps = Applications.list().map((a) => ({
    ...a,
    _count: { deviations: Applications.countDeviations(a.id) },
  }));
  return ok(apps);
}

export async function POST(req: NextRequest) {
  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.message);
    const app = Applications.create({
      applicantName: parsed.data.applicantName,
      productType: parsed.data.productType,
      extractedData: parsed.data.extractedData ?? {},
    });
    return ok(app);
  } catch (e: any) {
    return fail("ERROR", e.message ?? "Failed", 500);
  }
}
