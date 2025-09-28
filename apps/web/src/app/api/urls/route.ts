// apps/web/src/app/api/urls/route.ts
export const dynamic = "force-dynamic";
import { issueBearer } from "../_auth/issue";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4060";

  const sub = process.env.DEFAULT_USER_ID || "dev-user";
  const bearer = await issueBearer(sub);

  try {
    const r = await fetch(`${base}/urls`, {
      headers: { authorization: `Bearer ${bearer}` },
      cache: "no-store",
    });
    const data = await r.text();
    return new Response(data, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (e: unknown) {
    console.error("Proxy /api/urls failed:", e instanceof Error ? e.message : e);
    return new Response(JSON.stringify({ ok: false, error: "proxy_failed" }), { status: 502 });
  }
}