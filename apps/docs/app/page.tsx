export default function Home() {
  const items = [
    { name: "button", type: "registry:ui" },
    { name: "input", type: "registry:ui" },
    { name: "sign-in-form", type: "registry:block" },
    { name: "theme-provider", type: "registry:lib" },
    { name: "variants", type: "registry:lib" },
  ];
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>rnative registry</h1>
      <p>Components are served from /r. Fetch with:</p>
      <pre style={{ background: "#f4f4f5", padding: 12, borderRadius: 8 }}>
        {`npx rnative add button`}
      </pre>
      <ul>
        {items.map((i) => (
          <li key={i.name}>
            <a href={`/r/${i.name}`}>{i.name}</a>{" "}
            <span style={{ color: "#71717a", fontSize: 12 }}>{i.type}</span>
          </li>
        ))}
      </ul>
      <p style={{ color: "#71717a", fontSize: 14 }}>
        <a href="/r/registry.json">Full registry manifest</a>
      </p>
    </main>
  );
}
