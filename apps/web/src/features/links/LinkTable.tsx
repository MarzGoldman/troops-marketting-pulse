// apps/web/src/features/links/LinkTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { ExternalLink, Plus } from "lucide-react";

import {
  Table, TableBody, TableCaption, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NewLinkDialog } from "@/features/links/NewLinkDialog";

type LinkRow = {
  code: string;
  target: string;
  createdAt: string;
  clicks: number | null;
};

export function LinkTable({ onSelect }: { onSelect?: (code: string) => void }) {
  const [links, setLinks] = React.useState<LinkRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/urls", { cache: "no-store" });
      const json = await res.json();
      if (!json?.ok) { setLinks([]); return; }

      const withStats: LinkRow[] = await Promise.all(
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

  React.useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("links:refresh", h);
    return () => window.removeEventListener("links:refresh", h);
  }, []);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  }

  return (
    <>
      <Table className="table-fixed">
        <TableCaption className="sr-only">Short links</TableCaption>

        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[220px]">Code</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="w-24 text-right">Clicks</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {links.map((row) => {
            const isActive = hovered === row.code;
            return (
              <TableRow
                key={row.code}
                className="relative"
                onMouseEnter={() => setHovered(row.code)}
                onMouseLeave={() => setHovered(null)}
                onFocusCapture={() => setHovered(row.code)}
                onBlurCapture={() => setHovered(null)}
              >
                {/* Code */}
                <TableCell className="font-mono relative pr-24">
                  <Link
                    href={`/links/${row.code}`}
                    className="underline decoration-muted-foreground/40 hover:decoration-foreground"
                  >
                    {row.code}
                  </Link>

                  {/* Hover action */}
                  <div
                    className={[
                      "absolute right-2 top-1/2 -translate-y-1/2",
                      isActive ? "opacity-100" : "opacity-0 pointer-events-none",
                      "transition-opacity",
                    ].join(" ")}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelect?.(row.code)}
                      className="gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Button>
                  </div>
                </TableCell>

                {/* Target (truncate) */}
                <TableCell className="truncate">
                  <a
                    href={row.target}
                    target="_blank"
                    rel="noreferrer"
                    title={row.target}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {row.target}
                  </a>
                </TableCell>

                {/* Clicks (tabular) */}
                <TableCell className="text-right">
                  <span className="tabular-nums">{row.clicks ?? "—"}</span>
                </TableCell>
              </TableRow>
            );
          })}

          {links.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                No links yet.
              </TableCell>
            </TableRow>
          )}

          {/* Footer row with New Link button */}
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={3} className="py-3">
              <SignedIn>
                <Button onClick={() => setOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Link
                </Button>
              </SignedIn>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <NewLinkDialog
        open={open}
        onClose={() => setOpen(false)}
        onCreated={() => window.dispatchEvent(new CustomEvent("links:refresh"))}
      />
    </>
  );
}