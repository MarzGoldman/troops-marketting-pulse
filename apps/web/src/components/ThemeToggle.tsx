"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <button
        className="inline-flex items-center gap-2 px-2.5 py-1.5 text-sm border rounded-lg opacity-70"
        disabled
      >
        <Moon size={16} />
        <span className="hidden sm:inline">Theme</span>
      </button>
    );
  }

  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "inline-flex items-center gap-2 px-2.5 py-1.5 text-sm rounded-lg transition-colors",
        // bg + text switch *only on this button*:
        isDark
          ? "bg-gray-900 text-white border border-gray-700 hover:bg-gray-800"
          : "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200",
      ].join(" ")}
      aria-pressed={isDark}
      title={isDark ? "Switch to light" : "Switch to dark"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}