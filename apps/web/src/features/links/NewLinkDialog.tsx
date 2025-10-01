"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Schema = z.object({
  targetUrl: z.string().trim().url("Enter a valid URL"),
});

const DEFAULTS = { targetUrl: "" };

export function NewLinkDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (shortCode: string) => void;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    defaultValues: DEFAULTS,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Reset EVERYTHING whenever the dialog closes
  React.useEffect(() => {
    if (!open) {
      form.reset(DEFAULTS, { keepErrors: false, keepDirty: false, keepTouched: false });
      setErr(null);
      setSuccess(null);
      setSubmitting(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(values: z.infer<typeof Schema>) {
    setSubmitting(true);
    setErr(null);
    setSuccess(null);
    try {
      // Call the generator endpoint (proxy to shortener-api)
      const r = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: values.targetUrl }),
      });

      const j = await r.json().catch(() => ({} as any));
      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || "Failed to create link");
      }

      // shortener-api returns { ok, shortCode, targetUrl, createdAt }
      setSuccess(`Created /${j.shortCode}`);
      onCreated?.(j.shortCode);

      // Reset immediately so the next open is fresh, then close
      form.reset(DEFAULTS);
      setTimeout(() => onClose(), 450);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // Ensure closing via the "X", outside click, or ESC also resets
  function handleRequestClose() {
    form.reset(DEFAULTS);
    setErr(null);
    setSuccess(null);
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal open={open} onOpenChange={(o) => (!o ? handleRequestClose() : undefined)}>
      <ModalContent>
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <ModalTitle className="text-lg font-semibold">Create new link</ModalTitle>
            <ModalDescription className="text-sm text-muted-foreground">
              Paste a destination URL. We’ll generate the short code.
            </ModalDescription>
          </div>
          <button
            onClick={handleRequestClose}
            className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!!err && (
          <Alert variant="destructive" className="mb-3">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}

        {!!success && (
          <Alert className="mb-3">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            <FormField
              control={form.control}
              name="targetUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/page" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" type="button" onClick={handleRequestClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  );
}