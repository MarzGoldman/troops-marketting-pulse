// apps/web/src/app/api/shorten/route.ts
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4060";
  const body = await req.text(); // pass-through
  const r = await fetch(`${base}/shorten`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  const data = await r.text(); // preserve error bodies
  return new Response(data, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}