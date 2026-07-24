import { NextResponse } from "next/server";
import { aiDiagnostics } from "../../../../lib/ai/claude";

export async function GET() {
  return NextResponse.json({
    ai: aiDiagnostics(),
    env: {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl:   !!process.env.DIRECT_URL,
      nodeEnv:        process.env.NODE_ENV,
    },
    timestamp: new Date().toISOString(),
  });
}
