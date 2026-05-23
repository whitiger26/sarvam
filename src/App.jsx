import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  FileText,
  Settings,
  Upload,
  Loader2,
  AlertTriangle,
  Wrench,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Languages,
  BookOpen,
  Plus,
  MessageSquare,
  MessageSquarePlus,
  Square,
  Check,
  Pencil,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowRight,
} from "lucide-react";

/* ============================================================
   FONTS — Inter + JetBrains Mono. No Roboto, no Google Sans.
   ============================================================ */
const FONT_LINK_ID = "bta-fonts";
function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_LINK_ID)) return;
  const pc1 = document.createElement("link");
  pc1.rel = "preconnect";
  pc1.href = "https://fonts.googleapis.com";
  document.head.appendChild(pc1);
  const pc2 = document.createElement("link");
  pc2.rel = "preconnect";
  pc2.href = "https://fonts.gstatic.com";
  pc2.crossOrigin = "anonymous";
  document.head.appendChild(pc2);
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

/* ============================================================
   SEED MANUAL CONTENT
   Paraphrased universal motorcycle troubleshooting content.
   Replace/extend by uploading real manual PDFs.
   ============================================================ */
const SEED_MANUAL_CHUNKS = [
  {
    id: "re350-001",
    brand: "Royal Enfield Classic 350",
    source: "Owner's Manual",
    section: "Section 4.1 — Engine Will Not Start",
    page: "42",
    text:
      "If the engine fails to start, first verify that the ignition switch is ON and the engine kill switch is in the RUN position. Confirm the side stand is fully retracted; the side-stand cut-off sensor will prevent ignition with the stand down and a gear engaged. Check fuel level in the tank. If the fuel level is adequate and the battery is charged (instrument panel illuminated), the next step is to inspect the spark plug. A wet, sooty, or oil-fouled plug indicates an over-rich mixture or oil entering the combustion chamber. Replace the plug with the recommended NGK CPR8EA-9 and attempt restart.",
  },
  {
    id: "re350-002",
    brand: "Royal Enfield Classic 350",
    source: "Service Manual",
    section: "Section 7.3 — Exhaust Smoke Diagnosis",
    page: "118",
    text:
      "WHITE SMOKE from the exhaust typically indicates coolant or water entering the combustion chamber, or condensation during cold start. Persistent thick white smoke after warm-up suggests a failed head gasket or cracked cylinder head. Verify by checking the coolant reservoir level for unexplained drops and inspect engine oil for a milky appearance, which confirms coolant-oil mixing. BLUE SMOKE indicates engine oil burning, commonly caused by worn piston rings, worn valve stem seals, or excessive oil level. BLACK SMOKE indicates an over-rich fuel mixture. For EFI models, this points to a faulty O2 sensor, leaking injector, or clogged air filter. Carbureted variants require main jet and float level inspection.",
  },
  {
    id: "re350-003",
    brand: "Royal Enfield Classic 350",
    source: "Service Manual",
    section: "Section 7.4 — Engine Overheating",
    page: "124",
    text:
      "If the engine temperature warning illuminates or the engine feels excessively hot, immediately stop the motorcycle in a safe location and switch off the engine. Allow the engine to cool for at least 20 minutes before inspection. Do NOT remove the radiator cap or oil filler cap while hot — risk of severe burns from pressurised hot fluid. Common causes: low engine oil, clogged cooling fins (air-cooled J-series engines), prolonged idling in hot weather, riding in low gear at high RPM. Resume riding only after the cause is identified and addressed. Continued operation while overheated will cause permanent engine damage.",
  },
  {
    id: "re350-004",
    brand: "Royal Enfield Classic 350",
    source: "Owner's Manual",
    section: "Section 5.2 — Battery & Electrical",
    page: "61",
    text:
      "The Classic 350 is fitted with a 12V 9Ah maintenance-free (MF) battery. If the starter motor cranks slowly, headlamp dims at idle, or the instrument cluster flickers, the battery may be discharged or the charging system may be faulty. Measure battery voltage with the engine off: a healthy battery shows 12.4V to 12.8V. With the engine running at 3000 RPM, regulated charging voltage should be 13.8V to 14.5V. Voltage below 13.0V at this RPM indicates a faulty regulator-rectifier or stator winding. Voltage above 15.0V indicates regulator failure and risks battery damage.",
  },
  {
    id: "re350-005",
    brand: "Royal Enfield Classic 350",
    source: "Owner's Manual",
    section: "Section 6.1 — Chain Maintenance",
    page: "78",
    text:
      "Inspect the drive chain every 500 km. Correct chain slack is 25–35 mm of vertical movement measured at the midpoint between the front and rear sprockets, with the motorcycle on its centre stand and in neutral. Insufficient slack causes accelerated wear of the gearbox output shaft bearings; excessive slack causes the chain to slap against the swingarm and may derail. Clean the chain with kerosene and a soft brush, then lubricate with a quality chain lube designed for O-ring chains. Avoid engine oil and grease — these attract dust and accelerate wear.",
  },
  {
    id: "re350-006",
    brand: "Royal Enfield Classic 350",
    source: "Service Manual",
    section: "Section 9.1 — Hydraulic Brake Issues",
    page: "152",
    text:
      "A spongy or soft brake lever feel indicates air in the hydraulic line and requires bleeding of the brake system. A hard but ineffective brake lever indicates worn brake pads, glazed pad surfaces, or contaminated discs (oil/grease on the disc rotor). Brake fluid (DOT 4) should be changed every 2 years regardless of condition; absorbed moisture lowers the boiling point and causes brake fade. If the front brake lever travels all the way to the grip, stop riding immediately and have the system inspected. Riding with compromised brakes is extremely dangerous.",
  },
  {
    id: "tvs160-001",
    brand: "TVS Apache RTR 160 4V",
    source: "Owner's Manual",
    section: "Section 3 — Starting Procedure & Issues",
    page: "28",
    text:
      "For EFI variants, turn the ignition key to ON and wait for the fuel pump priming sound (approximately 2 seconds) before pressing the starter. If the engine cranks but does not fire, do not crank continuously for more than 5 seconds at a stretch — this drains the battery and floods the cylinder. Wait 15 seconds between cranking attempts. If the bike has not been started for more than 2 weeks, the fuel in the tank may have lost volatility; drain and refill with fresh petrol.",
  },
  {
    id: "tvs160-002",
    brand: "TVS Apache RTR 160 4V",
    source: "Service Manual",
    section: "Section 8.2 — EFI Diagnostic Trouble Codes",
    page: "201",
    text:
      "The MIL (Malfunction Indicator Lamp, yellow engine icon) will illuminate when the ECU detects an EFI fault. Common DTCs: P0107 (MAP sensor low), P0112 (intake air temp sensor low), P0117 (engine coolant temp sensor low), P0201–P0204 (injector circuit), P0335 (crank position sensor). The ECU stores codes in non-volatile memory. Use the TVS dealer diagnostic tool to retrieve and clear codes. If the MIL is lit but the bike runs normally, you may continue to ride to the nearest service centre, but performance and fuel economy may be reduced.",
  },
  {
    id: "tvs160-003",
    brand: "TVS Apache RTR 160 4V",
    source: "Owner's Manual",
    section: "Section 4.5 — Clutch Operation",
    page: "44",
    text:
      "If the clutch lever feels hard or the bike creeps forward in gear with the clutch fully pulled in, clutch cable adjustment is required. Free play at the clutch lever should be 10–20 mm measured at the lever tip. Adjust using the cable adjuster at the lever end for fine adjustment, or the adjuster at the engine end for coarse adjustment. If proper free play cannot be achieved, the clutch plates are likely worn and must be replaced. Riding with a slipping clutch (engine RPM rises but acceleration is poor) accelerates plate damage.",
  },
  {
    id: "tvs160-004",
    brand: "TVS Apache RTR 160 4V",
    source: "Service Manual",
    section: "Section 6.7 — Fuel Economy Drop",
    page: "175",
    text:
      "A sudden drop in fuel economy with no other symptoms may be caused by: (1) clogged air filter — clean or replace; (2) tyre pressure below specification — check and inflate to 25 PSI front, 32 PSI rear (single rider); (3) chain too tight or under-lubricated causing parasitic drag; (4) brake calliper drag from a seized piston; (5) faulty O2 sensor causing the ECU to enrich the mixture. Gradual fuel economy decline over months is usually deposit build-up — use a fuel system cleaner additive at 5000 km intervals.",
  },
  {
    id: "pulsar-001",
    brand: "Bajaj Pulsar 150",
    source: "Owner's Manual",
    section: "Section 2.4 — Cold-Start Behaviour",
    page: "22",
    text:
      "At ambient temperatures below 15°C, the engine may require longer warm-up before smooth running is achieved. Use the choke (carbureted variants) by pulling the choke knob fully out before cranking. Once the engine starts, push the choke in gradually over 30–60 seconds as the engine warms. Leaving the choke ON after warm-up causes a rich mixture, fouled spark plug, and excessive fuel consumption. EFI variants have automatic cold-start enrichment and do not require manual choke.",
  },
  {
    id: "pulsar-002",
    brand: "Bajaj Pulsar 150",
    source: "Service Manual",
    section: "Section 5.3 — DTS-i Spark Plug Service",
    page: "98",
    text:
      "The Pulsar DTS-i (Digital Twin Spark ignition) uses two spark plugs per cylinder. Both plugs must be serviced together. Recommended plug: Bosch UR4KE or NGK CR8EH-9. Gap: 0.7–0.8 mm. Tightening torque: 12 N·m. A single fouled plug will cause rough idle, misfire under load, and reduced power, even though the second plug continues to fire. When inspecting, look for: tan/light brown insulator (normal), black sooty deposit (rich mixture or oil burning), white/blistered insulator (lean mixture or overheating), wet plug (flooded — let dry before refitting).",
  },
  {
    id: "pulsar-003",
    brand: "Bajaj Pulsar 150",
    source: "Owner's Manual",
    section: "Section 7.1 — Tyre Pressure & Wear",
    page: "84",
    text:
      "Check tyre pressure when tyres are cold (before riding or at least 3 hours after riding). Specified pressure: front 25 PSI, rear 28 PSI (single rider); rear 32 PSI (with pillion). Inspect tyres for tread depth — minimum legal depth is 1.6 mm. Look for sidewall cracks, embedded objects, and uneven wear patterns. Cupping or scalloping of the front tyre indicates worn fork oil or steering head bearings. Centre-strip wear with good shoulder tread indicates over-inflation; shoulder wear with good centre indicates under-inflation.",
  },
  {
    id: "pulsar-004",
    brand: "Bajaj Pulsar 150",
    source: "Service Manual",
    section: "Section 4.2 — Engine Oil Service",
    page: "76",
    text:
      "Change engine oil every 5000 km or 6 months, whichever is first. Recommended oil: 20W-40 JASO MA2 specification, 1.0 litre capacity (with filter change). To check oil level: place motorcycle upright on level ground, run engine for 2 minutes, switch off, wait 3 minutes, then read the dipstick. Level must be between MIN and MAX marks. Low oil causes premature bearing wear and may lead to engine seizure. Overfilling causes oil to enter the airbox via the breather, contaminate the air filter, and may cause smoking.",
  },
  {
    id: "pulsar-005",
    brand: "Bajaj Pulsar 150",
    source: "Service Manual",
    section: "Section 8.5 — Self-Start Malfunction",
    page: "188",
    text:
      "If pressing the starter button produces no response: check that the side stand is up, clutch lever is pulled in, kill switch is in RUN. Listen for the starter relay click. No click and no crank: faulty starter relay, blown main fuse (15A under the seat), discharged battery, or broken kill-switch wiring. Click but no crank: battery too weak to turn the starter motor, corroded battery terminals, or seized starter motor. A faint click with dim lights confirms battery discharge — jump-start from another vehicle (12V system) following correct polarity, or use a battery charger.",
  },
  {
    id: "gen-001",
    brand: "General Motorcycle Care",
    source: "Universal Service Guide",
    section: "Safety — Fuel System Leaks",
    page: "N/A",
    text:
      "If you smell petrol while riding or notice a fuel leak from the carburetor, fuel tap, fuel lines, or fuel injection system, stop the motorcycle immediately in a safe area away from traffic and ignition sources. Switch off the engine. Do not attempt to restart. Fuel vapour is extremely flammable. Have the motorcycle transported to an authorized service centre on a recovery vehicle. Do not attempt to ride a leaking motorcycle — risk of fire or explosion.",
  },
  {
    id: "gen-002",
    brand: "General Motorcycle Care",
    source: "Universal Service Guide",
    section: "Storage — Long-term Parking",
    page: "N/A",
    text:
      "If the motorcycle will be unused for more than 30 days: (1) fill the fuel tank to prevent internal rust and add a fuel stabilizer; (2) disconnect the negative battery terminal or remove the battery and store it indoors at room temperature; charge once every 4 weeks; (3) inflate tyres to 5 PSI above normal; (4) cover the motorcycle with a breathable cover, never a plastic sheet (traps moisture); (5) before resuming use, check all fluids, tyre pressure, brake function, and lights.",
  },
];

/* ============================================================
   TEXT NORMALISATION & TF-IDF RETRIEVAL
   ============================================================ */
const STOPWORDS = new Set([
  "a","an","and","or","but","is","are","was","were","be","been","being","have","has","had","do","does","did",
  "the","of","in","on","at","to","for","with","by","from","up","about","into","over","after","before","this",
  "that","these","those","i","you","he","she","it","we","they","my","your","his","her","its","our","their",
  "what","which","who","whom","when","where","why","how","not","no","so","if","then","than","as","also",
  "can","will","would","should","could","may","might","must","shall","ought","need","please","help","tell","me"
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s°·\-]/g, " ")
    .split(/\s+/)
    .filter(t => t && t.length > 1 && !STOPWORDS.has(t));
}

class TfIdfIndex {
  constructor(chunks) {
    this.chunks = chunks;
    this.docTermFreqs = chunks.map(c => {
      const tokens = tokenize(c.text + " " + c.section + " " + c.brand);
      const tf = {};
      for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
      const len = tokens.length || 1;
      for (const k in tf) tf[k] = tf[k] / len;
      return tf;
    });
    const df = {};
    this.docTermFreqs.forEach(tf => {
      for (const term in tf) df[term] = (df[term] || 0) + 1;
    });
    const N = chunks.length;
    this.idf = {};
    for (const term in df) this.idf[term] = Math.log((N + 1) / (df[term] + 1)) + 1;
    this.docNorms = this.docTermFreqs.map(tf => {
      let s = 0;
      for (const t in tf) {
        const w = tf[t] * (this.idf[t] || 0);
        s += w * w;
      }
      return Math.sqrt(s) || 1;
    });

    // Brand vocabulary: token -> set of chunk indices that belong to that brand.
    // Used at query time to detect "the user mentioned bike X" and boost those
    // chunks while de-prioritising chunks from other bikes.
    this.brandVocab = new Map();
    chunks.forEach((c, i) => {
      const brandTokens = tokenize(c.brand);
      brandTokens.forEach(t => {
        if (t.length < 3) return; // skip short/generic tokens
        // skip generic words that wouldn't disambiguate a bike
        if (["the", "and", "manual", "owner", "service", "guide", "motorcycle", "bike", "general", "care", "universal", "classic"].includes(t)) return;
        if (!this.brandVocab.has(t)) this.brandVocab.set(t, new Set());
        this.brandVocab.get(t).add(i);
      });
    });
  }

  search(query, topK = 4) {
    const qTokens = tokenize(query);
    if (qTokens.length === 0) return [];

    // Detect brand mentions in the query. If the user names a specific bike,
    // we'll boost matching chunks. If they don't name one (or every chunk in
    // the corpus matches, meaning the "brand" word isn't selective), skip the boost.
    const brandMatchedChunks = new Set();
    for (const t of qTokens) {
      if (this.brandVocab.has(t)) {
        this.brandVocab.get(t).forEach(i => brandMatchedChunks.add(i));
      }
    }
    const hasBrandFilter =
      brandMatchedChunks.size > 0 && brandMatchedChunks.size < this.chunks.length;

    const qtf = {};
    for (const t of qTokens) qtf[t] = (qtf[t] || 0) + 1;
    const qlen = qTokens.length;
    for (const t in qtf) qtf[t] = qtf[t] / qlen;
    let qNorm = 0;
    for (const t in qtf) {
      const w = qtf[t] * (this.idf[t] || 0);
      qNorm += w * w;
    }
    qNorm = Math.sqrt(qNorm) || 1;

    const scores = this.docTermFreqs.map((dtf, i) => {
      let dot = 0;
      for (const t in qtf) {
        if (dtf[t]) {
          const idf = this.idf[t] || 0;
          dot += qtf[t] * idf * dtf[t] * idf;
        }
      }
      let sim = dot / (this.docNorms[i] * qNorm);

      // Brand-aware boost: 2.5x for chunks from the bike the user mentioned,
      // 0.35x for chunks from other bikes. This makes brand-specific answers
      // surface above general matches with stronger keyword overlap.
      if (hasBrandFilter) {
        sim *= brandMatchedChunks.has(i) ? 2.5 : 0.35;
      }

      return { idx: i, score: sim, chunk: this.chunks[i] };
    });
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK).filter(s => s.score > 0);
  }
}

/* ============================================================
   PDF.JS DYNAMIC LOADER
   ============================================================ */
function loadPdfJs() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(s);
  });
}

async function parsePdfToChunks(file, brand = "Uploaded Manual") {
  const pdfjsLib = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const chunks = [];
  let buffer = "";
  let bufferStartPage = 1;
  let currentSection = "Page";
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const pageText = content.items.map(it => it.str).join(" ").replace(/\s+/g, " ").trim();
    if (!pageText) continue;
    const sectionMatch = pageText.match(/(Section\s+\d+(?:\.\d+)?[^.]*\.)/i);
    if (sectionMatch) currentSection = sectionMatch[1].slice(0, 80);
    buffer += " " + pageText;
    while (buffer.length > 900) {
      const cut = buffer.lastIndexOf(". ", 900);
      const splitAt = cut > 400 ? cut + 1 : 900;
      const chunkText = buffer.slice(0, splitAt).trim();
      buffer = buffer.slice(splitAt).trim();
      if (chunkText.length > 50) {
        chunks.push({
          id: `upl-${file.name}-${chunks.length}`,
          brand,
          source: file.name.replace(/\.pdf$/i, ""),
          section: currentSection,
          page: String(bufferStartPage),
          text: chunkText,
        });
      }
      bufferStartPage = p;
    }
  }
  if (buffer.trim().length > 50) {
    chunks.push({
      id: `upl-${file.name}-${chunks.length}`,
      brand,
      source: file.name.replace(/\.pdf$/i, ""),
      section: currentSection,
      page: String(bufferStartPage),
      text: buffer.trim(),
    });
  }
  return chunks;
}

/* ============================================================
   SARVAM API
   ============================================================ */
const SARVAM_BASE = "https://api.sarvam.ai";

async function sarvamSpeechToText({ audioBlob, apiKey, languageCode = "unknown" }) {
  const form = new FormData();
  form.append("file", audioBlob, "audio.webm");
  form.append("model", "saarika:v2.5");
  form.append("language_code", languageCode);
  const res = await fetch(`${SARVAM_BASE}/speech-to-text`, {
    method: "POST",
    headers: { "api-subscription-key": apiKey },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`ASR ${res.status}: ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return {
    transcript: data.transcript || "",
    languageCode: data.language_code || languageCode,
  };
}

async function sarvamTranslate({ text, apiKey, sourceLang, targetLang }) {
  const res = await fetch(`${SARVAM_BASE}/translate`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
      speaker_gender: "Male",
      mode: "formal",
      model: "mayura:v1",
      enable_preprocessing: true,
    }),
  });
  if (!res.ok) throw new Error(`Translate ${res.status}`);
  const data = await res.json();
  return data.translated_text || text;
}

async function sarvamTextToSpeech({ text, apiKey, targetLang = "en-IN", speaker = "anushka" }) {
  const res = await fetch(`${SARVAM_BASE}/text-to-speech`, {
    method: "POST",
    headers: {
      "api-subscription-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_language_code: targetLang,
      speaker,
      model: "bulbul:v2",
      pitch: 0,
      pace: 1.0,
      loudness: 1.0,
    }),
  });
  if (!res.ok) throw new Error(`TTS ${res.status}`);
  const data = await res.json();
  const audioB64 = data.audios?.[0];
  if (!audioB64) throw new Error("No audio returned");
  return `data:audio/wav;base64,${audioB64}`;
}

/* ============================================================
   CLAUDE
   ============================================================ */
async function callClaude({ system, userText, imageBase64, imageMime }) {
  const userContent = [];
  if (imageBase64) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMime || "image/jpeg",
        data: imageBase64,
      },
    });
  }
  userContent.push({ type: "text", text: userText });

  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content.map(c => (c.type === "text" ? c.text : "")).join("").trim();
}

/* ============================================================
   PROMPTS
   ============================================================ */
const REFUSAL_PHRASE =
  "I couldn't find this in the loaded manual sections. Please consult your authorized service center or upload additional manual pages covering this topic.";

function buildSystemPrompt() {
  return `You are a motorcycle troubleshooting assistant. Follow these rules:

1. Answer using the MANUAL EXCERPTS provided in the user message. The excerpts may come from a DIFFERENT motorcycle model than the user's bike. That is okay — general motorcycle troubleshooting principles (engine diagnosis, electrical, brakes, exhaust smoke colors, cold-start behaviour, charging system voltages, etc.) typically apply across brands and models. When you apply principles from a different model's manual, briefly say so, e.g., "Based on general principles from the [Brand] service manual..." or "The same diagnosis applies broadly to most motorcycles..."

2. Only refuse if the excerpts do not cover the topic AT ALL — not even broadly. In that case, reply with EXACTLY this sentence and nothing else:
"${REFUSAL_PHRASE}"

3. Cite every factual claim with [N] markers matching excerpt numbers. Multiple citations like [1][3] are fine. Cite generously.

4. WRITE CONVERSATIONALLY. Use flowing prose, not a hierarchical document. Avoid headings (## or ###) unless the response genuinely covers multiple distinct topics; usually you do NOT need any headings. Use **bold** sparingly for the single most important phrase. Use - bullets only when listing 3+ short parallel items. Default to plain paragraphs.

5. Be concise. Lead with the most likely cause. Aim for 4–8 sentences for typical questions; only go longer when the user explicitly needs a multi-step procedure.

6. For safety-critical issues (brakes, fuel leaks, electrical fires, hot engine, fuel system), include a brief safety note recommending professional service.

7. If an image is provided, briefly describe what you observe (one line) before answering.

8. Never invent specific part numbers, torque values, jet sizes, or model-specific specs. Use only values present in the excerpts. If a spec isn't in the excerpts for the user's bike, say "consult your model's specifications" rather than guessing.

9. AFTER your answer, on a new line, write exactly: ===FOLLOWUPS===
Then output 3 short follow-up questions THE USER might naturally ask you next (one per line, no bullets/numbering, max 10 words each). Write them in FIRST PERSON from the user's perspective — as if the user is typing them to you. They should be the user's *next questions*, NOT questions you are asking the user.
  GOOD examples (user-voiced, user wants you to answer):
    "How do I check for worn piston rings?"
    "Can I ride safely with this issue?"
    "What does a head gasket replacement cost?"
    "How often should I service my chain?"
  BAD examples (these are YOU asking the user — do NOT output these):
    "Is the smoke white, blue, or black?"
    "Does the warning light stay on?"
    "What color is the smoke?"
If you used the refusal phrase, do NOT output the FOLLOWUPS section.

Format the answer as plain text with [N] citation markers inline. Do not add a "Sources:" section — the UI renders citations separately.`;
}

function buildUserMessage({ question, retrieved }) {
  const excerpts = retrieved
    .map(
      (r, i) =>
        `[${i + 1}] Brand: ${r.chunk.brand}\nSource: ${r.chunk.source} — ${r.chunk.section} (p.${r.chunk.page})\nText: ${r.chunk.text}`
    )
    .join("\n\n");
  return `MANUAL EXCERPTS:\n\n${excerpts}\n\n---\n\nUSER QUESTION: ${question}`;
}

function parseAnswerAndFollowups(raw) {
  const idx = raw.indexOf("===FOLLOWUPS===");
  if (idx === -1) return { answer: raw.trim(), followups: [] };
  const answer = raw.slice(0, idx).trim();
  const tail = raw.slice(idx + "===FOLLOWUPS===".length);
  const followups = tail
    .split("\n")
    .map(l => l.replace(/^[\s•\-\*\d.\)]+/, "").trim())
    .filter(l => l.length > 0 && l.length < 120)
    .slice(0, 3);
  return { answer, followups };
}

/* ============================================================
   AUDIO RECORDER HOOK (with live level meter)
   ============================================================ */
function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setAudioLevel(0);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    audioContextRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((s, v) => s + v, 0) / data.length;
      setAudioLevel(Math.min(1, (avg / 255) * 1.6));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const mr = new MediaRecorder(stream, { mimeType: mime });
    chunksRef.current = [];
    mr.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setIsRecording(true);
  };

  const stop = () =>
    new Promise(resolve => {
      const mr = mediaRecorderRef.current;
      if (!mr) {
        cleanup();
        setIsRecording(false);
        return resolve(null);
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType });
        cleanup();
        setIsRecording(false);
        resolve(blob);
      };
      mr.stop();
    });

  const cancel = () => {
    const mr = mediaRecorderRef.current;
    if (mr) {
      mr.onstop = null;
      try { mr.stop(); } catch {}
    }
    chunksRef.current = [];
    cleanup();
    setIsRecording(false);
  };

  return { isRecording, audioLevel, start, stop, cancel };
}

/* ============================================================
   UTILITY: CONVERSATION HELPERS
   ============================================================ */
const newConversation = () => ({
  id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: "New conversation",
  messages: [],
  createdAt: Date.now(),
});

const groupChunksByDocument = (chunks) => {
  const map = new Map();
  for (const c of chunks) {
    const key = `${c.brand}__${c.source}`;
    if (!map.has(key)) {
      map.set(key, { brand: c.brand, source: c.source, chunks: [] });
    }
    map.get(key).chunks.push(c);
  }
  return Array.from(map.values());
};

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function Logo({ collapsed }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center shadow-md shadow-blue-500/25">
        <Wrench className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
      </div>
      {!collapsed && (
        <div className="flex flex-col leading-tight">
          <div className="font-display text-[16px] font-bold text-[#0A1628] tracking-tight">
            garageOS
          </div>
          <div className="text-[11px] text-[#64748B] mt-0.5">
            Manual-grounded answers
          </div>
        </div>
      )}
    </div>
  );
}

function Sidebar({
  collapsed,
  onToggleCollapse,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  documents,
  onSelectDocument,
  onUploadManual,
  isUploading,
  uploadError,
  onOpenSettings,
}) {
  const fileInputRef = useRef(null);

  return (
    <aside
      className={`bg-[#FAFBFD] border-r border-[#E2E8F0] flex flex-col transition-all duration-200 ease-out ${
        collapsed ? "w-[56px]" : "w-[280px]"
      }`}
    >
      {/* Logo & collapse toggle */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2 pt-3 pb-2">
          <Logo collapsed={true} />
          <button
            onClick={onToggleCollapse}
            className="text-[#64748B] hover:text-[#0A1628] hover:bg-[#EFF6FF] p-1.5 rounded-md transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Logo collapsed={false} />
          <button
            onClick={onToggleCollapse}
            className="text-[#64748B] hover:text-[#0A1628] hover:bg-[#EFF6FF] p-1.5 rounded-md transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* New chat */}
      <div className={`${collapsed ? "px-2" : "px-3"} pt-2 pb-3`}>
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center ${collapsed ? "justify-center h-10 w-10 mx-auto" : "justify-start gap-2 px-3 py-2.5"} bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E40AF] text-white rounded-lg text-[13px] font-medium transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30`}
          title={collapsed ? "New chat" : undefined}
        >
          <MessageSquarePlus className="w-4 h-4 flex-shrink-0" strokeWidth={2.25} />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Conversations */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="text-[10.5px] font-semibold text-[#94A3B8] px-1.5 mb-1.5 uppercase tracking-wide" style={{ letterSpacing: "0.04em" }}>
            Chats
          </div>
          <div className="space-y-0.5 max-h-[30vh] overflow-y-auto scrollbar-thin">
            {conversations.length === 0 ? (
              <div className="text-[11.5px] text-[#94A3B8] px-1.5 py-1">No chats yet</div>
            ) : (
              conversations.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelectConversation(c.id)}
                  className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[12.5px] ${
                    c.id === activeConversationId
                      ? "bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] text-[#1D4ED8] font-medium"
                      : "text-[#0A1628]/80 hover:bg-[#EFF6FF]/60"
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
                  <span className="truncate flex-1">{c.title}</span>
                  {c.id === activeConversationId && conversations.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteConversation(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-[#DC2626] transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className={`${collapsed ? "px-2" : "px-3"} mt-2 border-t border-[#E2E8F0] pt-3`}>
        {!collapsed && (
          <div className="flex items-center justify-between px-1.5 mb-2">
            <div className="text-[10.5px] font-semibold text-[#94A3B8] uppercase tracking-wide" style={{ letterSpacing: "0.04em" }}>
              Manuals
            </div>
            <span className="text-[10.5px] text-[#94A3B8]">{documents.length}</span>
          </div>
        )}

        {/* Upload — prominent dashed gradient */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-full ${collapsed ? "h-10 w-10 mx-auto justify-center" : "px-3 py-2.5 justify-center"} flex items-center gap-2 border-2 border-dashed border-[#93C5FD] hover:border-[#2563EB] bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]/60 hover:from-[#DBEAFE] hover:to-[#BFDBFE]/80 text-[#1D4ED8] hover:text-[#1E3A8A] rounded-lg text-[12.5px] font-medium transition-all disabled:opacity-50`}
          title="Upload manual PDF"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          ) : (
            <Upload className="w-4 h-4 flex-shrink-0" strokeWidth={2.25} />
          )}
          {!collapsed && <span>{isUploading ? "Indexing..." : "Upload manual"}</span>}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onUploadManual(f);
            e.target.value = "";
          }}
        />
        {uploadError && !collapsed && (
          <div className="text-[10.5px] text-[#DC2626] mt-2 font-mono leading-tight">
            {uploadError}
          </div>
        )}
      </div>

      {/* Documents list */}
      {!collapsed && (
        <div className="px-3 mt-2 flex-1 overflow-y-auto scrollbar-thin pb-3">
          <div className="space-y-0.5">
            {documents.map((doc, i) => (
              <button
                key={i}
                onClick={() => onSelectDocument(doc)}
                className="w-full text-left group flex items-start gap-2 px-2 py-1.5 rounded-md hover:bg-[#EFF6FF] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 mt-0.5 text-[#5B6B85] group-hover:text-[#2563EB] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[#0A1628] truncate leading-tight">
                    {doc.brand}
                  </div>
                  <div className="text-[10.5px] text-[#5B6B85] mt-0.5 flex items-center gap-1.5">
                    <span className="truncate">{doc.source}</span>
                    <span className="font-mono text-[#94A3B8]">·</span>
                    <span className="font-mono text-[10px] text-[#94A3B8] flex-shrink-0">
                      {doc.chunks.length}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`mt-auto ${collapsed ? "px-2" : "px-3"} py-3 border-t border-[#E2E8F0]`}>
        <button
          onClick={onOpenSettings}
          className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-2 px-2"} py-1.5 text-[12.5px] text-[#5B6B85] hover:text-[#0A1628] hover:bg-[#EFF6FF] rounded-md transition-colors`}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}

function CitationPill({ n, chunk, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all text-[10.5px] font-mono text-[#1D4ED8] mx-0.5 align-baseline"
      title={`${chunk.source} — ${chunk.section}`}
    >
      <span className="font-semibold">[{n}]</span>
      <span className="opacity-80 max-w-[140px] truncate">{chunk.section}</span>
    </button>
  );
}

function CitationCard({ n, chunk, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left border border-[#E2E8F0] hover:border-[#2563EB] rounded-lg p-3.5 bg-white hover:shadow-md hover:shadow-blue-500/5 transition-all w-full"
    >
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <div className="font-mono text-[10.5px] text-[#2563EB] font-semibold">[{n}]</div>
        <div className="font-mono text-[9.5px] text-[#94A3B8] uppercase tracking-wider">
          p.{chunk.page}
        </div>
      </div>
      <div className="text-[12.5px] font-semibold text-[#0A1628] mb-0.5 leading-snug">
        {chunk.brand}
      </div>
      <div className="text-[11px] text-[#5B6B85] mb-2 font-mono">
        {chunk.source} · {chunk.section}
      </div>
      <div className="text-[12px] text-[#334155] leading-relaxed line-clamp-4">
        {chunk.text}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------
   Lightweight markdown renderer for assistant messages.
   Handles: ## h2, ### h3, **bold**, - bullets, [N] citation pills.
   Citation pills must work inside any block (paragraph / heading / list item).
   ------------------------------------------------------------ */
function renderInlineMd(text, retrieved, onCitationClick) {
  if (!text) return null;
  // Strip stray heading hashes that escape into prose (e.g. when a line begins with #)
  // and tokenize on **bold** and [N] markers.
  const re = /(\*\*[^*\n]+\*\*|\[\d+\])/g;
  const out = [];
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ kind: "t", v: text.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push({ kind: "b", v: tok.slice(2, -2) });
    } else {
      const n = parseInt(tok.slice(1, -1), 10);
      out.push({ kind: "c", n });
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push({ kind: "t", v: text.slice(last) });

  return out.map((p, i) => {
    if (p.kind === "t") return <span key={i}>{p.v}</span>;
    if (p.kind === "b") return <strong key={i} className="font-semibold text-[#0A1628]">{p.v}</strong>;
    const chunk = retrieved?.[p.n - 1]?.chunk;
    if (chunk) return <CitationPill key={i} n={p.n} chunk={chunk} onClick={() => onCitationClick(chunk)} />;
    return <span key={i}>[{p.n}]</span>;
  });
}

function renderMarkdown(text, retrieved, onCitationClick) {
  if (!text) return null;
  const lines = text.split("\n");
  const blocks = [];
  let list = null;
  const flushList = () => {
    if (list) {
      blocks.push({ kind: "ul", items: list });
      list = null;
    }
  };
  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+$/, "");
    if (line.trim() === "") {
      flushList();
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flushList();
      blocks.push({ kind: "h3", text: h3[1] });
      continue;
    }
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flushList();
      blocks.push({ kind: "h2", text: h2[1] });
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    if (bullet) {
      if (!list) list = [];
      list.push(bullet[1]);
      continue;
    }
    flushList();
    blocks.push({ kind: "p", text: line });
  }
  flushList();

  return blocks.map((b, i) => {
    if (b.kind === "h2") {
      return (
        <h3 key={i} className="text-[16.5px] font-semibold text-[#0A1628] mt-5 mb-2 first:mt-0">
          {renderInlineMd(b.text, retrieved, onCitationClick)}
        </h3>
      );
    }
    if (b.kind === "h3") {
      return (
        <h4 key={i} className="text-[14.5px] font-semibold text-[#0A1628] mt-4 mb-1.5 first:mt-0">
          {renderInlineMd(b.text, retrieved, onCitationClick)}
        </h4>
      );
    }
    if (b.kind === "ul") {
      return (
        <ul key={i} className="space-y-1.5 my-2.5">
          {b.items.map((it, j) => (
            <li key={j} className="flex gap-2.5 leading-[1.65]">
              <span className="text-[#2563EB] flex-shrink-0 select-none mt-[1px]">•</span>
              <span className="flex-1">{renderInlineMd(it, retrieved, onCitationClick)}</span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-2 leading-[1.65] first:mt-0 last:mb-0">
        {renderInlineMd(b.text, retrieved, onCitationClick)}
      </p>
    );
  });
}


  if (msg.role === "user") {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[75%]">
          {msg.image && (
            <div className="mb-2 rounded-xl overflow-hidden border border-[#E2E8F0]">
              <img src={msg.image} alt="upload" className="max-h-56 object-cover" />
            </div>
          )}
          <div className="bg-[#0A1628] text-white rounded-2xl rounded-tr-md px-4 py-2.5 text-[14px] leading-relaxed">
            {msg.text}
          </div>
          {msg.detectedLang && msg.detectedLang !== "en-IN" && msg.detectedLang !== "unknown" && (
            <div className="text-[10px] font-mono text-[#94A3B8] mt-1 text-right flex items-center justify-end gap-1">
              <Languages className="w-2.5 h-2.5" />
              voice · {msg.detectedLang}
            </div>
          )}
        </div>
      </div>
    );
  }

  const body = renderMarkdown(msg.text, msg.retrieved, onCitationClick);

  return (
    <div className="flex justify-start mb-6">
      <div className="max-w-[90%] w-full">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-[12px] font-medium text-[#475569]">
            {msg.refused ? "Out of scope" : "Diagnosis"}
          </div>
          {msg.confidence != null && !msg.refused && (
            <div className="text-[11px] text-[#94A3B8]">
              · top match {(msg.confidence * 100).toFixed(0)}%
            </div>
          )}
        </div>

        {msg.refused ? (
          <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border border-[#FCD34D]/50 rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="w-4 h-4 text-[#B45309] mt-0.5 flex-shrink-0" />
            <div className="text-[13.5px] text-[#78350F] leading-relaxed">
              {msg.text}
            </div>
          </div>
        ) : (
          <div className="text-[14.5px] text-[#0A1628]">
            {body}
          </div>
        )}

        {msg.ttsUrl && (
          <audio controls className="mt-3 h-9 w-full max-w-sm" src={msg.ttsUrl} />
        )}

        {msg.retrieved && msg.retrieved.length > 0 && !msg.refused && (
          <div className="mt-5">
            <div className="text-[11.5px] font-medium text-[#475569] mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Sources
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {msg.retrieved.map((r, i) => (
                <CitationCard key={i} n={i + 1} chunk={r.chunk} onClick={() => onCitationClick(r.chunk)} />
              ))}
            </div>
          </div>
        )}

        {msg.followups && msg.followups.length > 0 && !msg.refused && (
          <div className="mt-5">
            <div className="text-[11.5px] font-medium text-[#475569] mb-2.5">
              Suggested next questions
            </div>
            <div className="flex flex-wrap gap-2">
              {msg.followups.map((f, i) => (
                <button
                  key={i}
                  onClick={() => onFollowupClick(f)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] text-[#1D4ED8] bg-white border border-[#BFDBFE] rounded-full hover:bg-gradient-to-br hover:from-[#2563EB] hover:to-[#1D4ED8] hover:text-white hover:border-[#2563EB] transition-all"
                >
                  <span>{f}</span>
                  <ArrowRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsModal({ open, onClose, sarvamKey, setSarvamKey, voiceLang, setVoiceLang, ttsEnabled, setTtsEnabled }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0A1628]/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-blue-500/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="font-display text-[20px] text-[#0A1628] font-bold tracking-tight leading-none">Settings</div>
            <div className="text-[12px] text-[#64748B] mt-1.5">Voice & language configuration</div>
          </div>
          <button onClick={onClose} className="text-[#5B6B85] hover:text-[#0A1628]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[12px] font-semibold text-[#0A1628] mb-1.5">
              Sarvam API Key
            </label>
            <input
              type="password"
              value={sarvamKey}
              onChange={e => setSarvamKey(e.target.value)}
              placeholder="Paste your key..."
              className="w-full px-3 py-2 text-[13px] font-mono bg-[#F4F7FC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white transition-colors"
            />
            <p className="text-[11px] text-[#5B6B85] mt-1.5 leading-relaxed">
              Used for Saarika ASR, Bulbul TTS, and Mayura translation. Required for voice input in Indian languages. Get one at <span className="font-mono text-[#1D4ED8]">sarvam.ai</span>.
            </p>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0A1628] mb-1.5">
              Voice Input Language
            </label>
            <select
              value={voiceLang}
              onChange={e => setVoiceLang(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#F4F7FC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#2563EB] focus:bg-white"
            >
              <option value="unknown">Auto-detect</option>
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">हिन्दी — Hindi</option>
              <option value="ta-IN">தமிழ் — Tamil</option>
              <option value="te-IN">తెలుగు — Telugu</option>
              <option value="kn-IN">ಕನ್ನಡ — Kannada</option>
              <option value="ml-IN">മലയാളം — Malayalam</option>
              <option value="mr-IN">मराठी — Marathi</option>
              <option value="bn-IN">বাংলা — Bengali</option>
              <option value="gu-IN">ગુજરાતી — Gujarati</option>
              <option value="pa-IN">ਪੰਜਾਬੀ — Punjabi</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[13px] text-[#0A1628] font-medium">Speak responses aloud</div>
              <div className="text-[11px] text-[#5B6B85]">Generates audio via Bulbul (requires key)</div>
            </div>
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative ${ttsEnabled ? "bg-[#2563EB]" : "bg-[#E2E8F0]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${ttsEnabled ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentPreviewModal({ doc, onClose, onSelectChunk }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0A1628]/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl shadow-blue-500/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-6 border-b border-[#E2E8F0]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="font-display text-[18px] text-[#0A1628] font-bold tracking-tight leading-tight">
                {doc.brand}
              </div>
              <div className="text-[12px] text-[#5B6B85] mt-0.5 font-mono">
                {doc.source} · {doc.chunks.length} section{doc.chunks.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#5B6B85] hover:text-[#0A1628] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-3">
          {doc.chunks.map((chunk, i) => (
            <button
              key={chunk.id}
              onClick={() => onSelectChunk(chunk)}
              className="w-full text-left p-4 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF]/30 rounded-lg transition-all"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <div className="text-[13px] font-semibold text-[#0A1628]">
                  {chunk.section}
                </div>
                <div className="font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider flex-shrink-0">
                  p.{chunk.page}
                </div>
              </div>
              <div className="text-[12.5px] text-[#475569] leading-relaxed line-clamp-3">
                {chunk.text}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChunkPreviewModal({ chunk, onClose }) {
  if (!chunk) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-[#0A1628]/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="font-display text-[18px] text-[#0A1628] font-bold tracking-tight leading-tight">
              {chunk.brand}
            </div>
            <div className="text-[11px] font-mono text-[#5B6B85] mt-1">
              {chunk.source} · {chunk.section} · p.{chunk.page}
            </div>
          </div>
          <button onClick={onClose} className="text-[#5B6B85] hover:text-[#0A1628]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-[13.5px] text-[#0A1628] leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto scrollbar-thin">
          {chunk.text}
        </div>
      </div>
    </div>
  );
}

function AudioLevelMeter({ level }) {
  const bars = 14;
  return (
    <div className="flex items-center gap-[3px] h-7">
      {Array.from({ length: bars }).map((_, i) => {
        // wave-like distribution centered around middle
        const center = bars / 2;
        const distance = Math.abs(i - center) / center;
        const falloff = 1 - distance * 0.5;
        const base = 0.2;
        const height = base + level * falloff * 0.8 + (Math.sin(Date.now() / 100 + i) + 1) * 0.05 * level;
        return (
          <div
            key={i}
            style={{
              height: `${Math.min(100, Math.max(15, height * 100))}%`,
              transition: "height 80ms ease-out",
            }}
            className="w-[3px] rounded-full bg-gradient-to-t from-[#2563EB] to-[#60A5FA]"
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  ensureFonts();

  // Chunks (manuals)
  const [chunks, setChunks] = useState(SEED_MANUAL_CHUNKS);
  const documents = useMemo(() => groupChunksByDocument(chunks), [chunks]);
  const index = useMemo(() => new TfIdfIndex(chunks), [chunks]);

  // Conversations
  const [conversations, setConversations] = useState(() => [newConversation()]);
  const [activeConversationId, setActiveConversationId] = useState(conversations[0].id);
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [];

  const setMessages = useCallback(
    updater => {
      setConversations(prev =>
        prev.map(c => {
          if (c.id !== activeConversationId) return c;
          const next = typeof updater === "function" ? updater(c.messages) : updater;
          // auto-title from first user message
          let title = c.title;
          if (c.title === "New conversation") {
            const firstUser = next.find(m => m.role === "user");
            if (firstUser?.text) title = firstUser.text.slice(0, 40) + (firstUser.text.length > 40 ? "…" : "");
          }
          return { ...c, messages: next, title };
        })
      );
    },
    [activeConversationId]
  );

  // UI state
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStage, setThinkingStage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sarvamKey, setSarvamKey] = useState("");
  const [voiceLang, setVoiceLang] = useState("unknown");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewChunk, setPreviewChunk] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Composer state machine: idle | recording | transcribing | transcript_ready
  const [composerState, setComposerState] = useState("idle");
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [pendingLang, setPendingLang] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recorder = useAudioRecorder();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isThinking, composerState]);

  /* ----- Manual upload ----- */
  const handleUploadManual = async file => {
    setIsUploading(true);
    setUploadError("");
    try {
      const lower = file.name.toLowerCase();
      let brand = file.name.replace(/\.pdf$/i, "");
      if (lower.includes("royal") || lower.includes("enfield")) brand = "Royal Enfield (uploaded)";
      else if (lower.includes("apache") || lower.includes("tvs")) brand = "TVS (uploaded)";
      else if (lower.includes("pulsar") || lower.includes("bajaj")) brand = "Bajaj (uploaded)";
      else if (lower.includes("yamaha")) brand = "Yamaha (uploaded)";
      else if (lower.includes("honda")) brand = "Honda (uploaded)";

      const newChunks = await parsePdfToChunks(file, brand);
      if (newChunks.length === 0) {
        setUploadError("No extractable text found in this PDF (scanned image PDFs need OCR).");
      } else {
        setChunks(prev => [...prev, ...newChunks]);
      }
    } catch (e) {
      console.error(e);
      setUploadError(e.message || "Failed to parse PDF");
    } finally {
      setIsUploading(false);
    }
  };

  /* ----- Image handling (click / paste / drop) ----- */
  const ingestImageFile = useCallback(file => {
    if (!file) return false;
    if (!file.type || !file.type.startsWith("image/")) return false;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      setPendingImage({ dataUrl, base64, mime: file.type });
    };
    reader.readAsDataURL(file);
    return true;
  }, []);

  const handleImagePick = e => {
    const f = e.target.files?.[0];
    if (f) ingestImageFile(f);
    e.target.value = "";
  };

  const handlePaste = e => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file && ingestImageFile(file)) {
          e.preventDefault();
          return;
        }
      }
    }
  };

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragDepthRef = useRef(0);

  const handleDragEnter = e => {
    if (!Array.from(e.dataTransfer?.types || []).includes("Files")) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDraggingOver(true);
  };
  const handleDragOver = e => {
    if (!Array.from(e.dataTransfer?.types || []).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDragLeave = e => {
    e.preventDefault();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDraggingOver(false);
  };
  const handleDrop = e => {
    e.preventDefault();
    dragDepthRef.current = 0;
    setIsDraggingOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) ingestImageFile(file);
  };

  /* ----- Voice flow ----- */
  const handleStartRecording = async () => {
    if (!sarvamKey) {
      setSettingsOpen(true);
      return;
    }
    try {
      await recorder.start();
      setComposerState("recording");
    } catch (e) {
      console.error(e);
      alert("Microphone access denied. Please allow microphone permission.");
    }
  };

  const handleStopRecording = async () => {
    setComposerState("transcribing");
    try {
      const blob = await recorder.stop();
      if (!blob) {
        setComposerState("idle");
        return;
      }
      const { transcript, languageCode } = await sarvamSpeechToText({
        audioBlob: blob,
        apiKey: sarvamKey,
        languageCode: voiceLang,
      });
      if (!transcript || transcript.trim().length === 0) {
        setComposerState("idle");
        return;
      }
      setPendingTranscript(transcript);
      setPendingLang(languageCode);
      setComposerState("transcript_ready");
    } catch (e) {
      console.error(e);
      alert(`Transcription failed: ${e.message}`);
      setComposerState("idle");
    }
  };

  const handleCancelRecording = () => {
    recorder.cancel();
    setComposerState("idle");
    setPendingTranscript("");
    setPendingLang("");
  };

  const handleSendTranscript = () => {
    const t = pendingTranscript.trim();
    const lang = pendingLang;
    setPendingTranscript("");
    setPendingLang("");
    setComposerState("idle");
    if (t) handleSend(t, { detectedLang: lang });
  };

  /* ----- Main send ----- */
  const handleSend = async (rawText, opts = {}) => {
    const text = (rawText ?? input).trim();
    if (!text && !pendingImage) return;
    const image = pendingImage;
    const detectedLang = opts.detectedLang;

    const userMsg = {
      role: "user",
      text: text || "(image attached)",
      image: image?.dataUrl,
      detectedLang,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setPendingImage(null);
    setIsThinking(true);

    try {
      let retrievalQuery = text;
      if (detectedLang && detectedLang !== "en-IN" && detectedLang !== "unknown" && sarvamKey) {
        setThinkingStage("Translating to English for retrieval...");
        try {
          retrievalQuery = await sarvamTranslate({
            text,
            apiKey: sarvamKey,
            sourceLang: detectedLang,
            targetLang: "en-IN",
          });
        } catch (e) {
          console.warn("Translation failed, using original:", e);
        }
      }

      let visionHint = "";
      if (image) {
        setThinkingStage("Analysing image...");
        try {
          visionHint = await callClaude({
            system:
              "You are a motorcycle expert looking at a single image. In ONE short sentence (max 20 words), describe what symptom or condition you observe. Output the sentence only, no preamble.",
            userText: "Describe the symptom or condition shown.",
            imageBase64: image.base64,
            imageMime: image.mime,
          });
          retrievalQuery = (retrievalQuery + " " + visionHint).trim();
        } catch (e) {
          console.warn("Vision failed:", e);
        }
      }

      setThinkingStage("Searching manual index...");
      const retrieved = index.search(retrievalQuery, 4);
      const topScore = retrieved[0]?.score || 0;

      const THRESHOLD = 0.04;
      if (retrieved.length === 0 || topScore < THRESHOLD) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            refused: true,
            text: REFUSAL_PHRASE,
            confidence: topScore,
          },
        ]);
        setIsThinking(false);
        setThinkingStage("");
        return;
      }

      setThinkingStage("Reasoning over retrieved context...");
      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserMessage({
        question: text + (visionHint ? `\n\n(Image analysis: ${visionHint})` : ""),
        retrieved,
      });
      const rawAnswer = await callClaude({
        system: systemPrompt,
        userText: userPrompt,
        imageBase64: image?.base64,
        imageMime: image?.mime,
      });

      const { answer, followups } = parseAnswerAndFollowups(rawAnswer);
      const refused = answer.trim() === REFUSAL_PHRASE || answer.includes(REFUSAL_PHRASE);

      const assistantMsg = {
        role: "assistant",
        text: answer,
        retrieved: refused ? [] : retrieved,
        confidence: topScore,
        refused,
        followups: refused ? [] : followups,
      };

      if (ttsEnabled && sarvamKey && !refused) {
        setThinkingStage("Generating voice response...");
        try {
          const plain = answer.replace(/\[\d+\]/g, "").trim();
          const ttsLang = detectedLang && detectedLang !== "unknown" ? detectedLang : "en-IN";
          let toSpeak = plain;
          if (ttsLang !== "en-IN") {
            toSpeak = await sarvamTranslate({
              text: plain,
              apiKey: sarvamKey,
              sourceLang: "en-IN",
              targetLang: ttsLang,
            });
          }
          const url = await sarvamTextToSpeech({
            text: toSpeak.slice(0, 500),
            apiKey: sarvamKey,
            targetLang: ttsLang,
          });
          assistantMsg.ttsUrl = url;
        } catch (e) {
          console.warn("TTS failed:", e);
        }
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          refused: true,
          text: `Something went wrong: ${e.message}`,
        },
      ]);
    } finally {
      setIsThinking(false);
      setThinkingStage("");
    }
  };

  /* ----- Conversation management ----- */
  const handleNewConversation = () => {
    const c = newConversation();
    setConversations(prev => [c, ...prev]);
    setActiveConversationId(c.id);
    setInput("");
    setPendingImage(null);
    setComposerState("idle");
  };

  const handleSelectConversation = id => {
    setActiveConversationId(id);
    setInput("");
    setPendingImage(null);
    setComposerState("idle");
  };

  const handleDeleteConversation = id => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 0) {
        const fresh = newConversation();
        setActiveConversationId(fresh.id);
        return [fresh];
      }
      if (id === activeConversationId) setActiveConversationId(filtered[0].id);
      return filtered;
    });
  };

  return (
    <div
      className="h-screen w-full flex overflow-hidden"
      style={{
        background: "#F4F7FC",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0A1628",
      }}
    >
      <style>{`
        .font-display { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-feature-settings: 'cv11', 'ss01', 'ss03'; }
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .pulse-dot { animation: pulse-dot 1.4s ease-in-out infinite; }
        @keyframes record-pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .record-pulse { animation: record-pulse 1.6s infinite; }
      `}</style>

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(s => !s)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        documents={documents}
        onSelectDocument={setPreviewDoc}
        onUploadManual={handleUploadManual}
        isUploading={isUploading}
        uploadError={uploadError}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F4F7FC]">
        {/* Header */}
        <header className="px-6 py-3.5 border-b border-[#E2E8F0]/70 bg-white/60 backdrop-blur-sm flex items-center justify-between">
          <div className="text-[13px] font-medium text-[#0A1628] truncate flex-1">
            {activeConversation.title === "New conversation" ? "New diagnosis" : activeConversation.title}
          </div>
          <div className="text-[11.5px] text-[#64748B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span>{chunks.length} sections indexed</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {messages.length === 0 ? (
              <EmptyState onPick={s => handleSend(s)} />
            ) : (
              <>
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    msg={m}
                    onCitationClick={chunk => setPreviewChunk(chunk)}
                    onFollowupClick={q => handleSend(q)}
                  />
                ))}
                {isThinking && (
                  <div className="flex items-center gap-2.5 mb-6 text-[#5B6B85]">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] pulse-dot" style={{ animationDelay: "0s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] pulse-dot" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] pulse-dot" style={{ animationDelay: "0.4s" }} />
                    </div>
                    <span className="text-[12.5px] text-[#475569]">{thinkingStage || "Thinking..."}</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Composer */}
        <div
          className="px-6 pb-5 pt-3 bg-gradient-to-t from-[#F4F7FC] via-[#F4F7FC] to-transparent"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="max-w-3xl mx-auto">
            {pendingImage && composerState === "idle" && (
              <div className="mb-2 inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg p-1.5 pr-3">
                <img src={pendingImage.dataUrl} className="w-10 h-10 object-cover rounded" />
                <span className="text-[12px] text-[#0A1628]">Image attached</span>
                <button onClick={() => setPendingImage(null)} className="text-[#5B6B85] hover:text-[#DC2626]">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {composerState === "recording" && (
              <div className="bg-white border-2 border-[#DC2626]/30 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3 px-2">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-2 h-2 rounded-full bg-[#DC2626] record-pulse"></div>
                    <span className="text-[12.5px] font-semibold text-[#DC2626]">Recording</span>
                    <div className="flex-1 ml-2">
                      <AudioLevelMeter level={recorder.audioLevel} />
                    </div>
                  </div>
                  <button
                    onClick={handleCancelRecording}
                    className="px-3 py-1.5 text-[12.5px] text-[#5B6B85] hover:text-[#0A1628] hover:bg-[#F1F5F9] rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[12.5px] font-medium transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current" strokeWidth={0} />
                    Stop & transcribe
                  </button>
                </div>
              </div>
            )}

            {composerState === "transcribing" && (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 text-[#5B6B85]">
                  <Loader2 className="w-4 h-4 animate-spin text-[#2563EB]" />
                  <span className="text-[13px] text-[#475569]">Transcribing with Sarvam Saarika...</span>
                </div>
              </div>
            )}

            {composerState === "transcript_ready" && (
              <div className="bg-white border border-[#BFDBFE] rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="text-[12px] font-semibold text-[#2563EB]">
                      Transcript ready
                    </div>
                    {pendingLang && pendingLang !== "unknown" && (
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#EFF6FF] rounded text-[10px] font-mono text-[#1D4ED8]">
                        <Languages className="w-2.5 h-2.5" />
                        {pendingLang}
                      </div>
                    )}
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">Edit if needed</div>
                </div>
                <textarea
                  value={pendingTranscript}
                  onChange={e => setPendingTranscript(e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1 text-[14px] bg-transparent focus:outline-none resize-none text-[#0A1628]"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 px-2 pt-2 border-t border-[#E2E8F0]">
                  <button
                    onClick={handleCancelRecording}
                    className="px-3 py-1.5 text-[12.5px] text-[#5B6B85] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg font-medium transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSendTranscript}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-[12.5px] font-medium transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Send
                  </button>
                </div>
              </div>
            )}

            {composerState === "idle" && (
              <div className={`bg-white border rounded-2xl shadow-sm transition-all ${
                isDraggingOver
                  ? "border-[#2563EB] border-2 border-dashed shadow-blue-500/10 bg-[#EFF6FF]/40"
                  : "border-[#E2E8F0] focus-within:border-[#2563EB] focus-within:shadow-blue-500/5"
              }`}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onPaste={handlePaste}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isDraggingOver ? "Drop image to attach" : "Describe the issue, paste or drop an image, speak, or attach a photo"}
                  disabled={isThinking}
                  rows={1}
                  className="w-full px-4 py-3 bg-transparent text-[14.5px] focus:outline-none resize-none placeholder:text-[#94A3B8] disabled:opacity-50"
                  style={{ maxHeight: 140 }}
                />
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isThinking}
                      className="p-2 text-[#5B6B85] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors disabled:opacity-50"
                      title="Attach image"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImagePick}
                    />
                    <button
                      onClick={handleStartRecording}
                      disabled={isThinking}
                      className="p-2 text-[#5B6B85] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors disabled:opacity-50"
                      title={sarvamKey ? "Voice input" : "Voice input (add Sarvam key in Settings)"}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    {sarvamKey && (
                      <div className="flex items-center gap-1 px-2 ml-1 text-[10px] font-mono text-[#94A3B8]">
                        <Languages className="w-3 h-3" />
                        <span>{voiceLang === "unknown" ? "auto" : voiceLang}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={isThinking || (!input.trim() && !pendingImage)}
                    className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded-lg text-[13px] font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Diagnose</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sarvamKey={sarvamKey}
        setSarvamKey={setSarvamKey}
        voiceLang={voiceLang}
        setVoiceLang={setVoiceLang}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
      />

      <DocumentPreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onSelectChunk={chunk => {
          setPreviewDoc(null);
          setPreviewChunk(chunk);
        }}
      />

      <ChunkPreviewModal chunk={previewChunk} onClose={() => setPreviewChunk(null)} />
    </div>
  );
}

function EmptyState({ onPick }) {
  const suggestions = [
    "White smoke from my Royal Enfield's exhaust",
    "Apache RTR engine light is on, what does it mean?",
    "Pulsar 150 won't start in the morning",
    "Chain slack — what's the correct adjustment?",
  ];
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center mb-5 shadow-lg shadow-blue-500/20">
        <Wrench className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      <div className="font-display text-[34px] leading-[1.1] text-[#0A1628] tracking-[-0.02em] font-bold mb-2">
        What's wrong with your bike?
      </div>
      <div className="text-[14px] text-[#5B6B85] mb-8 max-w-md">
        Ask a question, speak it, or attach a photo. Every answer is grounded in your manual sections with verifiable citations.
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="px-3.5 py-2 text-[12.5px] text-[#0A1628] bg-white border border-[#E2E8F0] rounded-full hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
