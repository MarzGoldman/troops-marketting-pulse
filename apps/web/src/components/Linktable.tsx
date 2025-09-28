"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type LinkRow = { code: string; target: string; createdAt: string; clicks: number | null };

export function LinkTable() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/urls", { cache: "no-store" });
      const json = await res.json();
      if (!json?.ok) {
        setLinks([]);
        return;
      }

      const withStats = await Promise.all(
        json.urls.map(async (u: any) => {
          try {
            const s = await fetch(`/api/stats/${u.shortCode}`, { cache: "no-store" });
            const sj = await s.json().catch(() => ({}));
            return {
              code: u.shortCode,
              target: u.targetUrl,
              createdAt: u.createdAt,
              clicks: typeof sj?.clicks === "number" ? sj.clicks : 0,
            };
          } catch {
            return { code: u.shortCode, target: u.targetUrl, createdAt: u.createdAt, clicks: null };
          }
        })
      );

      setLinks(withStats);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("links:refresh", h);
    return () => window.removeEventListener("links:refresh", h);
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  // apps/web/src/components/LinkTable.tsx
if (loading) return <div className="text-sm text-foreground/70">Loading…</div>;

return (
  <table className="w-full border-collapse text-sm">
    <thead>
      <tr className="text-left border-b border-border">
        <th className="py-2 px-3 text-foreground/80">Code</th>
        <th className="py-2 px-3 text-foreground/80">Target</th>
        <th className="py-2 px-3 text-right text-foreground/80">Clicks</th>
      </tr>
    </thead>
    <tbody>
      {links.map((row) => (
        <tr
          key={row.code}
          className="border-b border-border hover:bg-[color-mix(in_oklab,var(--color-background),black_4%)]"
        >
          <td className="py-2 px-3 font-mono text-foreground">
            <Link href={`/links/${row.code}`} className="underline">
              {row.code}
            </Link>
          </td>
          <td className="py-2 px-3 text-blue-600 dark:text-blue-400 truncate max-w-[32rem]">
            <a href={row.target} target="_blank" rel="noreferrer">
              {row.target}
            </a>
          </td>
          <td className="py-2 px-3 text-right text-foreground">
            {row.clicks ?? "—"}
          </td>
        </tr>
      ))}
      {links.length === 0 && (
        <tr>
          <td colSpan={3} className="py-8 text-center text-foreground/70">
            No links yet. Click “+ New Link”.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);
}