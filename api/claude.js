// Vercel serverless function — proxies requests to the Anthropic Messages API
// so the ANTHROPIC_API_KEY stays on the server. The browser never sees it.
//
// Configure ANTHROPIC_API_KEY in Vercel Project Settings → Environment Variables.

// ---- Per-IP rate limit (in-memory, per serverless instance) ----
// Note: each Vercel instance keeps its own bucket map. This stops casual
// abuse but a determined attacker spread across many instances could still
// get through. For production-grade limits use Upstash Redis / Vercel KV.
const buckets = new Map();
const MAX_PER_WINDOW = 25;       // requests
const WINDOW_MS = 60_000;        // per minute

function rateLimit(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    // Opportunistic cleanup so the map doesn't grow forever
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    }
    return { allowed: true, retryAfter: 0 };
  }
  if (bucket.count >= MAX_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count++;
  return { allowed: true, retryAfter: 0 };
}

function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return xff.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const limit = rateLimit(clientIp(req));
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfter));
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
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
    console.error("Claude proxy error:", err);
    res.status(500).json({ error: err.message || "Upstream failed" });
  }
}
