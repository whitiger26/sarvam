// Vercel serverless proxy for Sarvam Saarika speech-to-text.
// Forwards the multipart audio body untouched. Server adds the API key.
//
// Configure SARVAM_API_KEY in Vercel → Project Settings → Environment Variables.

// Multipart body: disable Vercel's auto JSON body parser
export const config = {
  api: { bodyParser: false },
};

const buckets = new Map();
const MAX_PER_WINDOW = 30;
const WINDOW_MS = 60_000;
function rateLimit(ip) {
  const now = Date.now();
  const b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
    return { allowed: true, retryAfter: 0 };
  }
  if (b.count >= MAX_PER_WINDOW) return { allowed: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  b.count++;
  return { allowed: true, retryAfter: 0 };
}
function clientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return xff.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const limit = rateLimit(clientIp(req));
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfter));
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "SARVAM_API_KEY not configured on the server" });

  try {
    // Read raw body (multipart audio). Vercel caps body at ~4.5MB by default.
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const upstream = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
        "content-type": req.headers["content-type"],
      },
      body,
    });

    const text = await upstream.text();
    res
      .status(upstream.status)
      .setHeader("content-type", upstream.headers.get("content-type") || "application/json")
      .send(text);
  } catch (err) {
    console.error("Sarvam STT proxy error:", err);
    res.status(500).json({ error: err.message || "Upstream failed" });
  }
}
