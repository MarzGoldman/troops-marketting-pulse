// apps/web/src/app/page.tsx (call /shorten from UI if you want a quick test)
'use client';
import { useState } from 'react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [resp, setResp] = useState<any>(null);

  async function shorten() {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const r = await fetch(`${base}/shorten`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ url: longUrl }),
    });
    setResp(await r.json());
  }

  return (
    <main style={{ padding: 24, display: 'grid', gap: 12 }}>
      <h1>Troops-Marketting-Pulse</h1>
      <p>API: <code>{process.env.NEXT_PUBLIC_API_BASE_URL}</code></p>
      <div>
        <input value={longUrl} onChange={e => setLongUrl(e.target.value)} placeholder="https://example.com" style={{ padding: 8, width: 420 }} />
        <button onClick={shorten} style={{ padding: 8, marginLeft: 8 }}>Shorten</button>
      </div>
      <pre>{resp ? JSON.stringify(resp, null, 2) : null}</pre>
    </main>
  );
}