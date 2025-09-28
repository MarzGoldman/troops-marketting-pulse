// apps/web/src/components/Topbar.tsx
"use client";

import { useState } from "react";
import { NewLinkModal } from "./NewLinkModal";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const [open, setOpen] = useState(false);

  function notifyCreated() {
    window.dispatchEvent(new CustomEvent("links:refresh"));
  }

  return (
    // apps/web/src/components/Topbar.tsx
<header
  className={[
    "sticky top-0 z-20 h-14",
    "flex items-center justify-between px-6",
    // use tokens
    "text-foreground",
    "border-b border-border",
    // translucent surface that respects theme
    "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
    // subtle separator line; keep if you like
    "shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]",
  ].join(" ")}
>
  <h1 className="text-lg font-medium">Dashboard</h1>


  
  <div className="flex items-center gap-3">
    <ThemeToggle />

    <SignedIn>
      <button
        onClick={() => setOpen(true)}
        className={[
          "px-3 py-1.5 text-sm rounded-lg transition-colors",
          // primary button mapped to foreground/background so it inverts in dark
          "bg-foreground text-background hover:opacity-90",
          "border border-transparent",
        ].join(" ")}
      >
        + New Link
      </button>

      <UserButton afterSignOutUrl="/" />
    </SignedIn>

    <SignedOut>
      <SignInButton mode="modal">
        <button
          className={[
            "px-3 py-1.5 text-sm rounded-lg transition-colors",
            "border border-border text-foreground",
            "hover:bg-background/70",
          ].join(" ")}
        >
          Sign In
        </button>
      </SignInButton>
    </SignedOut>
  </div>

  <NewLinkModal open={open} onClose={() => setOpen(false)} onCreated={notifyCreated} />
</header>
  );
}