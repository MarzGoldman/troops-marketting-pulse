// apps/web/src/components/Sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Settings, HelpCircle, Search } from "lucide-react";
import { NavUserClerk } from "@/components/NavUserClerk";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 w-[260px] border-r",
        "bg-[var(--sidebar)] text-[var(--sidebar-foreground)]",
        "border-[var(--sidebar-border)]",
        "flex flex-col",
        className
      )}
      role="navigation"
      aria-label="Primary"
    >
      {/* Top brand/space */}
      <div className="h-14 flex items-center px-4 text-sm font-medium">
        <span className="opacity-80">Workspace</span>
      </div>

      {/* Nav */}
      <nav className="px-3 py-2 space-y-1 text-sm">
        <SidebarItem href="/links" active={pathname?.startsWith("/links")}>
          Links
        </SidebarItem>
        <SidebarItem href="/analytics" active={pathname?.startsWith("/analytics")}>
          Analytics
        </SidebarItem>
      </nav>

      {/* Utilities */}
      <div className="mt-2 px-3 space-y-1 text-sm">
        <SidebarButton icon={<Settings className="h-4 w-4" />}>Settings</SidebarButton>
        <SidebarButton icon={<HelpCircle className="h-4 w-4" />}>Get Help</SidebarButton>
        <SidebarButton icon={<Search className="h-4 w-4" />}>Search</SidebarButton>
      </div>

      {/* Footer user (shadcn dropdown + Clerk) */}
      <div className="mt-auto px-3 pb-3">
        <NavUserClerk />
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-lg px-3 py-2 transition-colors",
        // hover chip using your sidebar token
        "hover:bg-[color-mix(in_oklab,var(--sidebar),black_7%)]",
        active
          ? "text-[var(--sidebar-foreground)] bg-[color-mix(in_oklab,var(--sidebar),black_8%)]"
          : "text-[var(--sidebar-foreground)]/85 hover:text-[var(--sidebar-foreground)]"
      )}
    >
      {children}
    </Link>
  );
}

function SidebarButton({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2 rounded-lg px-3 py-2",
        "text-[var(--sidebar-foreground)]/75 hover:text-[var(--sidebar-foreground)]",
        "hover:bg-[color-mix(in_oklab,var(--sidebar),black_7%)]"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </button>
  );
}