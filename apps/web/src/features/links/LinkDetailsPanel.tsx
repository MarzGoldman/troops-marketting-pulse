// apps/web/src/features/links/LinkDetailsPanel.tsx
"use client";

import * as React from "react";
import { LinkDetailsSection, LinkDetailsRow } from "./LinkDetailsRow";

type LinkStats = {
  code: string;
  target: string;
  createdAt?: string;
  clicks?: number;
};

export function LinkDetailsPanel({ code }: { code: string }) {
  const [data, setData] = React.useState<LinkStats | null>(null);

  // Base redirect URL (env first, then window.origin)
  const [base, setBase] = React.useState<string>(
    process.env.NEXT_PUBLIC_REDIRECT_BASE_URL || ""
  );
  React.useEffect(() => {
    if (!base && typeof window !== "undefined") {
      setBase(window.location.origin);
    }
  }, [base]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/stats/${code}`, { cache: "no-store" });
        const json = (await r.json()) as LinkStats;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code]);

  const shortUrl = React.useMemo(
    () => (base ? `${base}/${data?.code ?? code}` : `/${data?.code ?? code}`),
    [base, data?.code, code]
  );

  if (!data) return <div className="text-sm text-foreground/60">Loading…</div>;

  return (
    <div className="space-y-6">
      <LinkDetailsSection title="Link">
        <LinkDetailsRow
          icon="link"
          name="Target"
          description="The destination this short link redirects to."
          copyValue={data.target}
          value={
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              href={data.target}
              target="_blank"
              rel="noreferrer"
              aria-label="Open target URL"
            >
              {data.target}
            </a>
          }
        />

        <LinkDetailsRow
          icon="shortcut"
          name="Short URL"
          description="The public short link you can share."
          copyValue={shortUrl}
          value={
            <a
              className="text-blue-600 dark:text-blue-400 hover:underline"
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open short URL"
            >
              {shortUrl}
            </a>
          }
        />

        <LinkDetailsRow
          icon="calendar_month"
          name="Created"
          description="When this short link was created."
          value={new Date(data.createdAt ?? Date.now()).toLocaleString()}
        />

        <LinkDetailsRow
          icon="insights"
          name="Total Clicks"
          description="Total number of times this short link has been opened."
          value={<span className="tabular-nums">{data.clicks ?? 0}</span>}
        />
      </LinkDetailsSection>

      <LinkDetailsSection title="Enrichment">
        <LinkDetailsRow
          icon="devices"
          name="Top Device"
          description="Most frequent device type for visitors."
          value="—"
        />
        <LinkDetailsRow
          icon="language"
          name="Top Browser"
          description="Most frequent browser among visitors."
          value="—"
        />
      </LinkDetailsSection>
    </div>
  );
}