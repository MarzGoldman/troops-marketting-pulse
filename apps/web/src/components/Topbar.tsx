"use client";

import { useState } from "react";
import { NewLinkModal } from "./NewLinkModal";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const [open, setOpen] = useState(false);

  function notifyCreated() {
    window.dispatchEvent(new CustomEvent("links:refresh"));
  }

  return (
    <header
      className={[
        "sticky top-0 z-20 h-14",
        "flex items-center justify-between px-6",
        "text-foreground border-b border-border",
        "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]",
      ].join(" ")}
    >
      <h1 className="text-lg font-medium">Dashboard</h1>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>

      <NewLinkModal open={open} onClose={() => setOpen(false)} onCreated={notifyCreated} />
    </header>
  );
}