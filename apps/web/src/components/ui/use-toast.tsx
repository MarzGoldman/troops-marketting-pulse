"use client";
import { toast as sonnerToast } from "sonner";

export function useToast() {
  // keeps the same API shape you used before
  return { toast: sonnerToast };
}