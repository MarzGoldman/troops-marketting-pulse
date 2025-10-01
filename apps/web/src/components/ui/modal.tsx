"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;

export function ModalContent({
  className,
  lockOutsideClose = true,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  lockOutsideClose?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      {/* Subtle dimmed overlay */}
      <DialogPrimitive.Overlay
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out
                   data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
      />

      <DialogPrimitive.Content
        {...props}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2",
          "rounded-xl border bg-card text-card-foreground shadow-2xl outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "p-6",
          className
        )}
        onInteractOutside={lockOutsideClose ? (e) => e.preventDefault() : undefined}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const ModalTitle = DialogPrimitive.Title;
export const ModalDescription = DialogPrimitive.Description;
export const ModalClose = DialogPrimitive.Close;