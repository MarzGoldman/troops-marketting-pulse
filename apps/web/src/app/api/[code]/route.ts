// apps/web/src/app/api/stats/[code]/route.ts
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL || "http://localhost:4070";
  try {
    const r = await fetch(`${base}/stats/${params.code}`, { cache: "no-store" });
    const data = await r.json();
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
      status: r.status,
    });
  } catch (e: any) {
    console.error("Proxy /api/stats failed:", e?.message || e);
    return new Response(JSON.stringify({ ok: false, error: "proxy_failed" }), { status: 502 });
  }
}