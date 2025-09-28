// apps/web/src/app/api/shorten/route.ts
export const dynamic = "force-dynamic";
import type { NextRequest } from "next/server";
import { issueBearer } from "../_auth/issue";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();     // ← await it
  if (!userId) {
    return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401 });
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4060";
  const body = await req.text();
  const bearer = await issueBearer(userId);

  const r = await fetch(`${base}/shorten`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${bearer}`,
    },
    body,
  });

  const data = await r.text();
  return new Response(data, {
    status: r.status,
    headers: { "content-type": r.headers.get("content-type") ?? "application/json" },
  });
}