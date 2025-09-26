// apps/web/src/components/Sidebar.tsx
"use client";

import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-56 border-r border-gray-200 bg-white flex flex-col">
      <div className="px-4 py-6 text-xl font-bold tracking-tight">Troops Pulse</div>
      <nav className="flex-1 px-2 space-y-1">
        <Link href="/" className="block px-3 py-2 rounded hover:bg-gray-100">
          Links
        </Link>
        <Link href="/settings" className="block px-3 py-2 rounded hover:bg-gray-100">
          Settings
        </Link>
      </nav>
    </aside>
  );
}