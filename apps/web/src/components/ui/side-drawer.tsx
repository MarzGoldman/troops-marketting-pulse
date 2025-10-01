// apps/web/src/components/ui/side-drawer.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

/**
 * Notion-style right drawer:
 * - top gap only
 * - no shadow
 * - faint top/left border
 * - rounded top-left corner
 * - a11y: always includes a hidden Dialog.Title
 */
export function SideDrawer({
  open,
  onClose,
  title,
  widthClassName = "w-[1200px] max-w-[100vw]", // wider by default
  lockOutsideClose = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  widthClassName?: string;
  lockOutsideClose?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()} modal={false}>
      <Dialog.Portal>
        <Dialog.Content
          className={cn(
            "fixed right-0 bottom-0 top-20 z-[100] h-[calc(100vh-0.75rem)]",
            "bg-[var(--card)] text-[var(--foreground)] outline-none",
            "border-t border-l border-black/10 dark:border-white/10",
            "rounded-tl-xl",
            "p-8 pt-6",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
            widthClassName
          )}
          onInteractOutside={lockOutsideClose ? (e) => e.preventDefault() : undefined}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Always render a hidden Dialog.Title for a11y */}
          <Dialog.Title className="sr-only">
            {typeof title === "string" ? title : "Panel"}
          </Dialog.Title>

          {title ? (
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-medium truncate">{title}</span>
              <button
                onClick={onClose}
                className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          <div className="h-[calc(100%-2.75rem)] overflow-y-auto">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}