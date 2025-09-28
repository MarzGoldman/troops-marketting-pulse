// apps/web/src/app/page.tsx
import { LinkTable } from "@/components/LinkTable";

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Your Links</h2>
      <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
        <LinkTable />
      </div>
    </div>
  );
}