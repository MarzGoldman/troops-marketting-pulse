// apps/web/src/components/Topbar.tsx
"use client";

import { useState } from "react";
import { NewLinkModal } from "./NewLinkModal";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Topbar() {
  const [open, setOpen] = useState(false);

  // let the table know when to refresh after link create
  function notifyCreated() {
    window.dispatchEvent(new CustomEvent("links:refresh"));
  }

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <h1 className="text-lg font-medium">Dashboard</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
        >
          + New Link
        </button>

        {/* Clerk auth controls */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>

      <NewLinkModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={notifyCreated}
      />
    </header>
  );
}