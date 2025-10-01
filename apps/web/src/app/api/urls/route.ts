// apps/web/src/app/api/urls/route.ts
export const dynamic = "force-dynamic";
import { issueBearer } from "../_auth/issue";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401 });
  }

  const base = process.env.SHORTENER_API_BASE_URL || "http://localhost:4060";
  const bearer = await issueBearer(userId);

  try {
    const r = await fetch(`${base}/urls`, {
      headers: { authorization: `Bearer ${bearer}` },
      cache: "no-store",
    });

    const data = await r.text(); // pass through as text
    return new Response(data, {
      status: r.status,
      headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (e: any) {
    // Upstream is down / refused
    return new Response(
      JSON.stringify({
        ok: false,
        error: "shortener_api_unreachable",
        detail: e?.message ?? String(e),
        base,
      }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }
}