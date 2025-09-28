// apps/web/src/app/api/stats/[code]/route.ts
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params; // ✅ await Promise<{ code }>
  const base = process.env.REDIRECT_API_BASE_URL || "http://localhost:4070";

  const r = await fetch(`${base}/stats/${code}`, { cache: "no-store" });
  const data = await r.json();

  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    status: r.status,
  });
}