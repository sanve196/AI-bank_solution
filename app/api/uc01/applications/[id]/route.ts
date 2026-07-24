import { NextRequest } from "next/server";
import { Applications, Deviations } from "../../../../../lib/store";
import { ok, fail } from "../../../../../lib/utils/api";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const app = Applications.get(params.id);
  if (!app) return fail("NOT_FOUND", "Application not found", 404);
  return ok({ ...app, deviations: Deviations.byApplication(app.id) });
}
