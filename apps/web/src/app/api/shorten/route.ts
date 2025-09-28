// apps/web/src/app/api/shorten/route.ts
export const dynamic = "force-dynamic";
import type { NextRequest } from "next/server";
import { issueBearer } from "../_auth/issue"; // <- correct relative path

export async function POST(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4060";
  const body = await req.text();

  const sub = process.env.DEFAULT_USER_ID || "dev-user"; // TEMP until Clerk
  const bearer = await issueBearer(sub);

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