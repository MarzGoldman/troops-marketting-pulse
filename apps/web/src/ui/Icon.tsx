// apps/web/src/ui/Icon.tsx
"use client";

import React from "react";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`}>
      {name}
    </span>
  );
}