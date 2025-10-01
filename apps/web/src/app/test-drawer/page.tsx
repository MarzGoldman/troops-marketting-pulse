// apps/web/src/app/test-drawer/page.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { SideDrawer } from "@/components/ui/side-drawer";
import { DrawerHeader } from "@/components/ui/drawer-header";
import { Database } from "lucide-react";

export default function TestDrawerPage() {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState("deployments");

  return (
    <div className="p-6 space-y-6">
      <div className="text-right">
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      </div>

      <SideDrawer open={open} onClose={() => setOpen(false)} widthClassName="w-[720px] max-w-[95vw]">
        <DrawerHeader
          icon={<Database className="h-5 w-5 text-muted-foreground" />}
          title="Dummy Drawer"
          tabs={[
            { value: "deployments", label: "Deployments" },
            { value: "database", label: "Database" },
            { value: "backups", label: "Backups" },
          ]}
          value={tab}
          onValueChange={setTab}
          onClose={() => setOpen(false)}
        />

        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            This is some dummy content inside the drawer.
          </p>
          <ul className="list-disc pl-6 text-sm">
            <li>First dummy item</li>
            <li>Second dummy item</li>
            <li>Third dummy item</li>
          </ul>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close from inside
          </Button>
        </div>
      </SideDrawer>
    </div>
  );
}