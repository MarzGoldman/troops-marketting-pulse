// apps/web/src/components/ui/drawer-header.tsx
"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { value: string; label: string };

export function DrawerHeader({
  icon,
  title,
  tabs = [],
  value,
  onValueChange,
  onClose,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  tabs?: Tab[];
  value?: string;
  onValueChange?: (v: string) => void;
  onClose: () => void;
  className?: string;
}) {
  const navRef = React.useRef<HTMLDivElement | null>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const [underline, setUnderline] = React.useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  React.useLayoutEffect(() => {
    if (!value || !navRef.current) return;
    const btn = tabRefs.current[value];
    const nav = navRef.current;
    if (!btn) return;

    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setUnderline({ left: btnRect.left - navRect.left, width: btnRect.width });
  }, [value, tabs]);

  React.useEffect(() => {
    function handle() {
      if (!value || !navRef.current) return;
      const btn = tabRefs.current[value];
      if (!btn) return;
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setUnderline({ left: btnRect.left - navRect.left, width: btnRect.width });
    }
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, [value]);

  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-[var(--card)]",
        "border-b border-black/10 dark:border-white/10",
        "px-6 pt-3 pb-0",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          {icon ? <div className="shrink-0">{icon}</div> : null}
          <div className="text-[26px] font-semibold leading-none">{title}</div>
        </div>

        <button
          onClick={onClose}
          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {tabs.length > 0 ? (
        <div ref={navRef} className="relative flex items-center gap-5 pb-2">
          {tabs.map((t) => {
            const active = value === t.value;
            return (
              <button
                key={t.value}
                ref={(el) => { tabRefs.current[t.value] = el; }} // <-- no return (void)
                onClick={() => onValueChange?.(t.value)}
                className={cn(
                  "relative h-8 px-0 text-[13px] transition-colors",
                  active
                    ? "text-foreground font-medium"
                    : "text-muted-foreground/60 hover:text-muted-foreground/80"
                )}
                aria-current={active ? "page" : undefined}
              >
                {t.label}
              </button>
            );
          })}

          {/* active underline matches active tab */}
          {value ? (
            <span
              className="pointer-events-none absolute bottom-0 h-[2px] bg-foreground transition-all duration-200"
              style={{ left: underline.left, width: underline.width }}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}