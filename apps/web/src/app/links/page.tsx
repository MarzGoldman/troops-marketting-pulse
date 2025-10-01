"use client";

import * as React from "react";
import { LinkTable } from "@/features/links/LinkTable";
import { SideDrawer } from "@/components/ui/side-drawer";
import { DrawerHeader } from "@/components/ui/drawer-header";
import { Link as LinkIcon } from "lucide-react";
import { LinkDetailsPanel } from "@/features/links/LinkDetailsPanel";

export default function LinksPage() {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState("link");

  // Reset tab when switching rows
  React.useEffect(() => {
    if (selected) setTab("link");
  }, [selected]);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Your Links</h2>

      <div className="rounded-xl bg-background p-4">
        <LinkTable onSelect={setSelected} />
      </div>

      <SideDrawer
        open={!!selected}
        onClose={() => setSelected(null)}
        widthClassName="w-[50vw]" // half-screen; adjust if desired
      >
        <DrawerHeader
          icon={<LinkIcon className="h-5 w-5 text-muted-foreground" />}
          title={selected ? `/${selected}` : "Link"}
          tabs={[
            { value: "link", label: "Link" },
            { value: "enrichment", label: "Enrichment" },
          ]}
          value={tab}
          onValueChange={setTab}
          onClose={() => setSelected(null)}
        />

        <div className="px-6 py-4">
          {selected && (
            <>
              {tab === "link" && <LinkDetailsPanel code={selected} />}
              {tab === "enrichment" && (
                <div className="text-sm text-muted-foreground">
                  Coming soon: device, browser, and geo breakdowns.
                </div>
              )}
            </>
          )}
        </div>
      </SideDrawer>
    </div>
  );
}