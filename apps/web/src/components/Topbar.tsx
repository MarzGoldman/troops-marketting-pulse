// apps/web/src/components/Topbar.tsx
"use client";
import { useState } from "react";
import { NewLinkModal } from "./NewLinkModal";

export function Topbar() {
  const [open, setOpen] = useState(false);
  // let the table tell us when to refresh after create
  function notifyCreated() {
    // dispatch a custom event the table listens for
    window.dispatchEvent(new CustomEvent("links:refresh"));
  }
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">Dashboard</h1>
      <button onClick={() => setOpen(true)} className="px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
        + New Link
      </button>
      <NewLinkModal open={open} onClose={() => setOpen(false)} onCreated={notifyCreated} />
    </header>
  );
}