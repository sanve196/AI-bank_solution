import { NextResponse } from "next/server";

export function ok<T>(data: T) {
  return NextResponse.json({
    success: true,
    data,
    error: null,
    meta: { timestamp: new Date().toISOString() },
  });
}

export function fail(code: string, message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      data: null,
      error: { code, message },
      meta: { timestamp: new Date().toISOString() },
    },
    { status }
  );
}
