export const dynamic = "force-dynamic";

export default async function LinkStats({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const base = process.env.NEXT_PUBLIC_REDIRECT_BASE_URL || "http://localhost:4070";
  const r = await fetch(`${base}/stats/${code}`, { cache: "no-store" });

  if (!r.ok) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Not found</h2>
      </div>
    );
  }

  const stats = await r.json();

  return (
  <div className="max-w-4xl mx-auto space-y-4">
    <h2 className="text-xl font-semibold text-foreground">/{stats.code}</h2>

    <div className="text-sm text-foreground/70">
      Target:{" "}
      <a className="text-blue-600 dark:text-blue-400" href={stats.target} target="_blank" rel="noreferrer">
        {stats.target}
      </a>
    </div>

    <div className="text-sm text-foreground/70">
      Short URL:{" "}
      <a className="text-blue-600 dark:text-blue-400" href={`${base}/${stats.code}`} target="_blank" rel="noreferrer">
        {`${base}/${stats.code}`}
      </a>
    </div>

    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="bg-background border border-border rounded-xl p-4">
        <div className="text-xs text-foreground/60">Total Clicks</div>
        <div className="text-2xl font-semibold text-foreground">{stats.clicks}</div>
      </div>
      <div className="bg-background border border-border rounded-xl p-4">
        <div className="text-xs text-foreground/60">Top Device</div>
        <div className="text-lg text-foreground">—</div>
      </div>
      <div className="bg-background border border-border rounded-xl p-4">
        <div className="text-xs text-foreground/60">Top Browser</div>
        <div className="text-lg text-foreground">—</div>
      </div>
    </div>
  </div>
);
}