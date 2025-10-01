// app-sidebar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Settings, HelpCircle, Search } from "lucide-react";

export function AppSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 w-[260px] border-r",
        "bg-[var(--sidebar)] text-[var(--sidebar-foreground)]",
        "border-[var(--sidebar-border)]",
        className
      )}
    >
      {/* Top brand/space */}
      <div className="h-14 flex items-center px-4 text-sm font-medium">
        <span className="opacity-80">Workspace</span>
      </div>

      {/* Nav */}
      <nav className="px-3 py-2 space-y-1 text-sm">
        <SidebarItem href="/links">Links</SidebarItem>
        <SidebarItem href="/analytics">Analytics</SidebarItem>
      </nav>

      {/* Utilities (like your screenshot) */}
      <div className="mt-2 px-3 space-y-1 text-sm">
        <SidebarButton icon={<Settings className="h-4 w-4" />}>Settings</SidebarButton>
        <SidebarButton icon={<HelpCircle className="h-4 w-4" />}>Get Help</SidebarButton>
        <SidebarButton icon={<Search className="h-4 w-4" />}>Search</SidebarButton>
      </div>

      {/* Footer user card */}
      <div className="absolute left-0 right-0 bottom-0 px-3 pb-3">
        <SignedIn>
          <UserFooterCard />
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal">
            <button
              className={[
                "w-full rounded-xl px-3 py-2 text-sm transition",
                "bg-[color-mix(in_oklab,var(--sidebar),black_6%)] hover:bg-[color-mix(in_oklab,var(--sidebar),black_10%)]",
                "border border-[var(--sidebar-border)] text-[var(--sidebar-foreground)]/90",
              ].join(" ")}
            >
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </aside>
  );
}

function SidebarItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block rounded-lg px-3 py-2",
        "text-[var(--sidebar-foreground)]/85 hover:text-[var(--sidebar-foreground)]",
        "hover:bg-[color-mix(in_oklab,var(--sidebar),black_7%)]"
      )}
    >
      {children}
    </Link>
  );
}

function SidebarButton({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
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

function UserFooterCard() {
  const { user } = useUser();
  const fullName = user?.fullName || user?.username || "Account";
  const email = user?.primaryEmailAddress?.emailAddress || "—";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3 py-2",
        // subtle “card” like the screenshot
        "bg-[color-mix(in_oklab,var(--sidebar),black_6%)] hover:bg-[color-mix(in_oklab,var(--sidebar),black_10%)]",
        "border border-[var(--sidebar-border)]"
      )}
    >
      {/* Avatar + menu trigger */}
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonBox: "h-8 w-8 shrink-0", // size of the avatar button
            avatarBox: "h-8 w-8",
          },
        }}
      />

      {/* Name + email */}
      <div className="min-w-0">
        <div className="text-sm font-medium leading-tight truncate">{fullName}</div>
        <div className="text-xs opacity-70 truncate">{email}</div>
      </div>

      {/* Keep space for the menu trigger (the avatar already opens it) */}
      <div className="ml-auto h-5 w-5" />
    </div>
  );
}