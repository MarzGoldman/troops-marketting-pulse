export const dynamic = "force-dynamic";

export default async function LinkStats({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const base = process.env.REDIRECT_API_BASE_URL || "http://localhost:4070";
  const r = await fetch(`${base}/stats/${code}`, { cache: "no-store" });

  if (!r.ok) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Not found
        </h2>
      </div>
    );
  }

  const stats = await r.json();

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        /{stats.code}
      </h2>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Target:{" "}
        <a
          className="text-blue-600 dark:text-blue-400"
          href={stats.target}
          target="_blank"
          rel="noreferrer"
        >
          {stats.target}
        </a>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Short URL:{" "}
        <a
          className="text-blue-600 dark:text-blue-400"
          href={`${base}/${stats.code}`}
          target="_blank"
          rel="noreferrer"
        >
          {`${base}/${stats.code}`}
        </a>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Clicks</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {stats.clicks}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Top Device</div>
          <div className="text-lg text-gray-900 dark:text-gray-100">—</div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">Top Browser</div>
          <div className="text-lg text-gray-900 dark:text-gray-100">—</div>
        </div>
      </div>
    </div>
  );
}