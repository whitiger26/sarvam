# garageOS — Bike Troubleshooting Assistant

A manual-grounded RAG assistant for motorcycle troubleshooting. Answers strictly from indexed owner & service manuals, with citations rendered beside every answer. Voice in/out in 11 Indian languages via Sarvam APIs.

## Stack

- **Frontend:** React + Vite + Tailwind
- **LLM:** Anthropic Claude (Sonnet 4) — via a Vercel serverless proxy at `/api/claude`
- **Retrieval:** In-browser TF-IDF + cosine similarity over chunked manual text
- **PDF ingestion:** PDF.js (loaded from CDN at runtime)
- **Voice:** Sarvam Saarika (ASR) + Bulbul (TTS) + Mayura (translate). The user supplies their own Sarvam key in the in-app Settings panel — no server config needed.
- **Vision:** Claude vision API for image-based symptom diagnosis

## Local dev

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

Open http://localhost:5173. Note: `/api/claude` only works when deployed to Vercel or running `vercel dev`. For pure local dev without Vercel CLI, you can temporarily point `callClaude` in `src/App.jsx` back at `https://api.anthropic.com/v1/messages` with your key — but never commit that.

## Deploy to Vercel (recommended — ~3 minutes)

1. **Push to GitHub.** Create a new repo, then:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<you>/garageOS.git
   git push -u origin main
   ```

2. **Import to Vercel.** Go to https://vercel.com/new, pick the repo. Vercel auto-detects Vite.

3. **Add the env var.** In the import screen (or later under Project Settings → Environment Variables), add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your Anthropic key from https://console.anthropic.com

4. **Deploy.** Vercel gives you a `your-project.vercel.app` URL. Done.

5. **Sarvam key.** The deployed app asks each user to paste their own Sarvam key in the Settings modal (top-right). This is a deliberate design choice — it lets you ship without per-user billing logic. If you want to centralize the Sarvam key on the server, add a `/api/sarvam-asr.js` proxy (mirror the pattern in `/api/claude.js`) and update the Sarvam calls in `src/App.jsx`.

## Deploy alternatives

- **Netlify:** rename `api/claude.js` to `netlify/functions/claude.js`, change the fetch path in `src/App.jsx` to `/.netlify/functions/claude`.
- **Cloudflare Pages:** use Pages Functions; the proxy pattern is similar.
- **GitHub Pages:** won't work alone — no serverless. You'd need a separate hosted proxy (Cloudflare Workers, Railway, Render, etc.).

## Architecture notes

### Hallucination guardrails (layered)
1. **Pre-LLM threshold gate** — if TF-IDF top score < 0.08, the model is never called. The refusal phrase is returned directly.
2. **Strict system prompt** — Claude is instructed to answer only from provided excerpts and to use an exact refusal phrase otherwise.
3. **Citation requirement** — `[N]` markers in the answer map 1:1 to source chunks rendered as cards beside the response, so users can verify every claim.
4. **Retrieved chunks visible in UI** — no black-box trust; users see the source text.

### Why Sarvam
- **Saarika ASR**: Indic languages — Hindi, Tamil, Marathi, Bengali, Telugu, Kannada, Malayalam, Gujarati, Punjabi. The actual user is a rider or mechanic in India, not a Bay Area dev.
- **Mayura translate**: bridges Indic questions to English-only manuals — translate query → retrieve → answer → translate back.
- **Bulbul TTS**: spoken answers in the user's language.

### Retrieval tradeoff
TF-IDF, not neural embeddings. Manuals are vocab-dense (symptom terms map cleanly to manual terms), runs in ~50ms in-browser, no embedding API cost, no model bundle. Weaker on heavy paraphrase. For production with thousands of pages, add a sparse → cross-encoder rerank pipeline server-side.

## File map

```
.
├── api/claude.js          # Vercel serverless proxy to Anthropic
├── src/
│   ├── App.jsx            # All app logic (RAG, UI, Sarvam, vision, PDF parsing)
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example
└── README.md
```

## License

MIT — sample manual content in `SEED_MANUAL_CHUNKS` is paraphrased universal troubleshooting knowledge. Upload your own manual PDFs to extend the index.
