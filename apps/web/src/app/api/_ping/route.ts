// apps/web/src/app/api/_ping/route.ts
export const dynamic = "force-dynamic";

export async function GET() {
  const shortener = process.env.SHORTENER_API_BASE_URL || "";
  const redirect = process.env.REDIRECT_API_BASE_URL || "";

  async function probe(base: string) {
    if (!base) return { ok: false, error: "missing env", base };
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/health`, { cache: "no-store" });
      const text = await res.text();
      return { ok: res.ok, status: res.status, text, base };
    } catch (e: any) {
      return { ok: false, error: e?.message || String(e), base };
    }
  }

  const [s, r] = await Promise.all([probe(shortener), probe(redirect)]);
  return Response.json({ shortener: s, redirect: r });
}