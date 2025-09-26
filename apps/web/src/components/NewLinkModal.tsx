// apps/web/src/components/NewLinkModal.tsx
"use client";
import { useState } from "react";

export function NewLinkModal({ open, onClose, onCreated }: {
  open: boolean; onClose: () => void; onCreated: () => void;
}) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/shorten", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!r.ok) throw new Error(await r.text());
      await r.json(); // ignore body, we’ll refetch list
      onCreated();
      setUrl("");
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[520px] p-5">
        <h3 className="text-lg font-semibold mb-3">Create new link</h3>
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border">Cancel</button>
          <button disabled={busy} onClick={submit}
            className="px-3 py-1.5 rounded-lg bg-black text-white disabled:opacity-60">
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}