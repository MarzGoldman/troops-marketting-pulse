// apps/web/src/ui/Buttons/ButtonType1.tsx
"use client";

import * as React from "react";

type Props = {
  icon?: React.ReactNode;   // e.g. <Plus size={16}/> or any icon
  label: string;            // visible text
  onClick?: () => void;
  className?: string;
};

export function ButtonType1({ icon, label, onClick, className = "" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        // base sizing & layout
        "inline-flex items-center gap-2 px-2.5 py-1.5 select-none",
        "rounded-md",
        // muted by default
        "bg-transparent text-foreground/35",
        // hover: subtle background + stronger text
        "hover:bg-[rgb(0_0_0/0.06)] dark:hover:bg-[rgb(255_255_255/0.08)] hover:text-foreground/80",
        // focus ring for accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border/60 focus-visible:ring-offset-2",
        "transition-colors cursor-pointer",
        className,
      ].join(" ")}
    >
      {icon && (
        <span className="grid place-items-center text-[16px] font-bold leading-none">
          {icon}
        </span>
      )}
      <span className="text-sm leading-none">{label}</span>
    </button>
  );
}