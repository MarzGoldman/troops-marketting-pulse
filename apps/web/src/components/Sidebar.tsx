// apps/web/src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// apps/web/src/components/Sidebar.tsx
export function Sidebar() {
  return (
    <aside className="w-56 border-r border-border bg-background text-foreground flex flex-col">
      <div className="px-4 py-6 text-xl font-bold tracking-tight">Troops Pulse</div>
      <nav className="flex-1 px-2 space-y-1">
        <NavItem href="/">Links</NavItem>
        <NavItem href="/settings">Settings</NavItem>
      </nav>
    </aside>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={[
        "block px-3 py-2 rounded transition-colors",
        active
          ? "bg-[color-mix(in_oklab,var(--color-background),black_8%)] text-foreground"
          : "hover:bg-[color-mix(in_oklab,var(--color-background),black_6%)] text-foreground/70",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}