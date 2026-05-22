// Vercel serverless function — proxies requests to the Anthropic Messages API
// so the ANTHROPIC_API_KEY stays on the server. The browser never sees it.
//
// Configure ANTHROPIC_API_KEY in Vercel Project Settings → Environment Variables.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const text = await upstream.text();
    res
      .status(upstream.status)
      .setHeader("Content-Type", "application/json")
      .send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message || "Upstream failed" });
  }
}
