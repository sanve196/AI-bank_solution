import { NextRequest } from "next/server";
import { Applications, Deviations } from "../../../../../lib/store";
import { ok, fail } from "../../../../../lib/utils/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const app = await Applications.get(params.id);
    if (!app) return fail("NOT_FOUND", "Application not found", 404);
    const deviations = await Deviations.byApplication(app.id);
    return ok({ ...app, deviations });
  } catch (e: any) {
    return fail("DB_ERROR", e.message ?? "Database error", 500);
  }
}
