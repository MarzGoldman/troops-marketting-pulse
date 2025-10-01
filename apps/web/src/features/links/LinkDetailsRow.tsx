// apps/web/src/features/links/LinkDetailsRow.tsx
"use client";

import * as React from "react";
import { Icon } from "@/ui/Icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { CopyButton } from "@/components/ui/copy-button";

/** Section wrapper — title + vertical stack of rows */
export function LinkDetailsSection({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <section className={["mb-5", className].join(" ")}>
        {title && (
          <div className="mb-2 px-0.5 text-xs font-medium uppercase tracking-wide text-foreground/45">
            {title}
          </div>
        )}
        <div className="space-y-1.5">{children}</div>
      </section>
    </TooltipProvider>
  );
}

/** A single row inside the link details panel */
export function LinkDetailsRow({
  icon,
  name,
  description,
  value,
  copyValue,
  className = "",
}: {
  icon: string;
  name: string;
  description?: string;
  value?: React.ReactNode;
  copyValue?: string;
  className?: string;
}) {
  const [hovered, setHovered] = React.useState(false);

  const Label = (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md select-none",
        "bg-transparent text-foreground/45",
        "hover:bg-[rgb(0_0_0/0.06)] dark:hover:bg-[rgb(255_255_255/0.08)] hover:text-foreground/80",
        "transition-colors",
      ].join(" ")}
      aria-label={name}
    >
      <Icon name={hovered ? "info" : icon} className="text-[18px] leading-none" />
      <span className="text-[13px] leading-none">{name}</span>
    </button>
  );

  return (
    <div
      className={[
        "group grid grid-cols-[200px_1fr] items-center", // `group` is key
        "text-foreground/60",
        className,
      ].join(" ")}
    >
      {/* Label column */}
      <div className="min-w-0">
        {description ? (
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>{Label}</TooltipTrigger>
            <TooltipContent side="left" align="center">
              <div className="max-w-[260px] text-xs leading-snug">{description}</div>
            </TooltipContent>
          </Tooltip>
        ) : (
          Label
        )}
      </div>

      {/* Value column */}
      <div className="relative text-sm">
        <div
          className={[
            "rounded-md px-2 py-1 transition-colors",
            "hover:bg-[rgb(0_0_0/0.06)] dark:hover:bg-[rgb(255_255_255/0.08)]",
            copyValue ? "pr-10" : "", // space for copy btn
          ].join(" ")}
        >
          {value ?? <span className="text-foreground/40">—</span>}
        </div>

        {copyValue ? (
          <CopyButton
            value={copyValue}
            tooltip="Copy"
            className={[
              "absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md", // looks like a button
              "opacity-0 group-hover:opacity-100 focus:opacity-100 pointer-events-none group-hover:pointer-events-auto",
              "transition-opacity duration-150",
            ].join(" ")}
          />
        ) : null}
      </div>
    </div>
  );
}