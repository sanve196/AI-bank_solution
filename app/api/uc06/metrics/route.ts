import { buildMetricsContext } from "../../../../modules/uc-06-process-analytics/metrics";
import { ok, fail } from "../../../../lib/utils/api";

export async function GET() {
  try {
    const ctx = await buildMetricsContext();
    return ok({ context: ctx });
  } catch (e: any) {
    return fail("METRICS_ERROR", e.message ?? "Failed", 500);
  }
}
