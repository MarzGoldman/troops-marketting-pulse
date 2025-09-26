// apps/web/src/app/page.tsx
import { LinkTable } from "@/components/Linktable";

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Your Links</h2>
      <LinkTable />
    </div>
  );
}