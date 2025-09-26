// apps/web/src/app/api/urls/route.ts
export const dynamic = "force-dynamic";

export async function GET() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4060";
    try {
        const r = await fetch(`${base}/urls`, { cache: "no-store" });
        const data = await r.json();
        return new Response(JSON.stringify(data), {
            headers: { "content-type": "application/json" },
            status: r.status,
        });
    } catch (e: unknown) {
        console.error("Proxy /api/urls failed:", e instanceof Error ? e.message : e);
        return new Response(JSON.stringify({ ok: false, error: "proxy_failed" }), { status: 502 });
    }
}