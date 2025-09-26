// apps/web/src/app/links/[code]/page.tsx
export const dynamic = "force-dynamic";

import { headers } from "next/headers";

async function getBaseUrl() {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export default async function LinkStats({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;                 // ✅ await params
  const redirectApi =
  process.env.NEXT_PUBLIC_REDIRECT_API || "http://localhost:4070";

const r = await fetch(`${redirectApi}/stats/${code}`, { cache: "no-store" });

  if (!r.ok) return <div className="max-w-4xl mx-auto"><h2 className="text-xl font-semibold mb-4">Not found</h2></div>;

  const stats = await r.json();
  const redirectBase = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL || "http://localhost:4070";

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">/{stats.code}</h2>
      <div className="text-sm text-gray-600">
        Target: <a className="text-blue-600" href={stats.target} target="_blank" rel="noreferrer">{stats.target}</a>
      </div>
      <div className="text-sm text-gray-600">
        Short URL: <a className="text-blue-600" href={`${redirectBase}/${stats.code}`} target="_blank" rel="noreferrer">{`${redirectBase}/${stats.code}`}</a>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <div className="text-xs text-gray-500">Total Clicks</div>
          <div className="text-2xl font-semibold">{stats.clicks}</div>
        </div>
        <div className="bg-white border rounded-xl p-4"><div className="text-xs text-gray-500">Top Device</div><div className="text-lg">—</div></div>
        <div className="bg-white border rounded-xl p-4"><div className="text-xs text-gray-500">Top Browser</div><div className="text-lg">—</div></div>
      </div>
    </div>
  );
}