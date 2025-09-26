export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Troops-Marketting-Pulse</h1>
      <p>API: <code>{process.env.NEXT_PUBLIC_API_BASE_URL}</code></p>
    </main>
  );
}
