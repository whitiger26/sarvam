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
  Volume2,
  VolumeX,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Sparkles,
  ChevronRight,
  Trash2,
  Languages,
  BookOpen,
  Plus,
} from "lucide-react";

/* ============================================================
   FONT LOADING
   ============================================================ */
const FONT_LINK_ID = "bta-fonts";
function ensureFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById(FONT_LINK_ID)) return;
  // Preconnect for performance
  const pc1 = document.createElement("link");
  pc1.rel = "preconnect";
  pc1.href = "https://fonts.googleapis.com";
  document.head.appendChild(pc1);
  const pc2 = document.createElement("link");
  pc2.rel = "preconnect";
  pc2.href = "https://fonts.gstatic.com";
  pc2.crossOrigin = "anonymous";
  document.head.appendChild(pc2);
  // Google Sans (display) + Google Sans Text (body) + Roboto Mono (mono)
  const link = document.createElement("link");
  link.id = FONT_LINK_ID;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css?family=Google+Sans:400,500,700|Google+Sans+Text:400,500,700|Roboto+Mono:400,500&display=swap";
  document.head.appendChild(link);
}

/* ============================================================
   PRE-LOADED MANUAL CONTENT
   These are paraphrased excerpts of the kind of troubleshooting
   content that appears in motorcycle owner's & service manuals.
   Users can upload their actual manual PDF to replace/extend this.
   ============================================================ */
const SEED_MANUAL_CHUNKS = [
  // ---------- ROYAL ENFIELD CLASSIC 350 ----------
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

  // ---------- TVS APACHE RTR 160 / 200 ----------
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

  // ---------- BAJAJ PULSAR ----------
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

  // ---------- GENERAL / UNIVERSAL ----------
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
    // doc frequency
    const df = {};
    this.docTermFreqs.forEach(tf => {
      for (const term in tf) df[term] = (df[term] || 0) + 1;
    });
    const N = chunks.length;
    this.idf = {};
    for (const term in df) this.idf[term] = Math.log((N + 1) / (df[term] + 1)) + 1;
    // pre-compute doc vectors norms
    this.docNorms = this.docTermFreqs.map(tf => {
      let s = 0;
      for (const t in tf) {
        const w = tf[t] * (this.idf[t] || 0);
        s += w * w;
      }
      return Math.sqrt(s) || 1;
    });
  }

  search(query, topK = 4) {
    const qTokens = tokenize(query);
    if (qTokens.length === 0) return [];
    const qtf = {};
    for (const t of qTokens) qtf[t] = (qtf[t] || 0) + 1;
    const qlen = qTokens.length;
    for (const t in qtf) qtf[t] = qtf[t] / qlen;
    // q vector norm
    let qNorm = 0;
    for (const t in qtf) {
      const w = qtf[t] * (this.idf[t] || 0);
      qNorm += w * w;
    }
    qNorm = Math.sqrt(qNorm) || 1;
    // score
    const scores = this.docTermFreqs.map((dtf, i) => {
      let dot = 0;
      for (const t in qtf) {
        if (dtf[t]) {
          const idf = this.idf[t] || 0;
          dot += qtf[t] * idf * dtf[t] * idf;
        }
      }
      const sim = dot / (this.docNorms[i] * qNorm);
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
    // try to detect section headers (heuristic: short ALL CAPS or "Section X.X" lines)
    const sectionMatch = pageText.match(/(Section\s+\d+(?:\.\d+)?[^.]*\.)/i);
    if (sectionMatch) currentSection = sectionMatch[1].slice(0, 80);
    buffer += " " + pageText;
    // flush every ~800 chars or at end
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
   SARVAM API CLIENT
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
    throw new Error(`Sarvam ASR failed: ${res.status} ${txt}`);
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
  if (!res.ok) throw new Error(`Sarvam translate failed: ${res.status}`);
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
  if (!res.ok) throw new Error(`Sarvam TTS failed: ${res.status}`);
  const data = await res.json();
  const audioB64 = data.audios?.[0];
  if (!audioB64) throw new Error("No audio returned");
  return `data:audio/wav;base64,${audioB64}`;
}

/* ============================================================
   ANTHROPIC LLM CLIENT
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

  // Calls our own serverless function at /api/claude — which adds the
  // ANTHROPIC_API_KEY server-side. The key never reaches the browser.
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userContent }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude API failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data.content.map(c => (c.type === "text" ? c.text : "")).join("").trim();
}

/* ============================================================
   PROMPT CONSTRUCTION
   ============================================================ */
const REFUSAL_PHRASE =
  "I couldn't find this in the loaded manual sections. Please consult your authorized service center or upload additional manual pages covering this topic.";

function buildSystemPrompt() {
  return `You are a precise motorcycle troubleshooting assistant. You must follow these rules WITHOUT EXCEPTION:

1. Answer ONLY using information from the MANUAL EXCERPTS provided in the user message. Do not use prior knowledge of motorcycles. Even if you are certain of an answer, refuse unless it is explicitly supported by an excerpt.

2. If the excerpts do not contain enough information to answer, reply with EXACTLY this sentence and nothing else:
"${REFUSAL_PHRASE}"

3. Cite every factual claim by appending [N] where N is the excerpt number. Multiple citations like [1][3] are fine.

4. Be concise. Use short paragraphs or bullet points. Lead with the most likely cause.

5. For any safety-critical issue (brakes, fuel leaks, electrical fires, hot engine), include a brief safety note recommending professional service.

6. If an image is provided, briefly describe what you observe (1 line) before answering, then connect the observation to relevant excerpts.

7. Never invent part numbers, torque values, or specifications. Use only values present in the excerpts.

Format your reply as plain text with [N] citation markers inline. Do not add a "Sources:" section — the UI renders citations separately.`;
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

/* ============================================================
   AUDIO RECORDING HOOK
   ============================================================ */
function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
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
      if (!mr) return resolve(null);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType });
        streamRef.current?.getTracks().forEach(t => t.stop());
        setIsRecording(false);
        resolve(blob);
      };
      mr.stop();
    });

  return { isRecording, start, stop };
}

/* ============================================================
   UI: SUB-COMPONENTS
   ============================================================ */

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-8 h-8 rounded-md bg-[#1a1a1a] flex items-center justify-center">
        <Wrench className="w-4 h-4 text-[#FAFAF7]" strokeWidth={2.25} />
      </div>
      <div className="flex flex-col leading-none">
        <div className="font-display text-[19px] text-[#1a1a1a] tracking-tight font-medium">
          garageOS
        </div>
        <div className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-[#7a7a72] mt-1">
          Manual-grounded diagnosis
        </div>
      </div>
    </div>
  );
}

function CitationPill({ n, chunk, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-[#1a1a1a]/15 bg-[#FAFAF7] hover:bg-[#1a1a1a] hover:text-[#FAFAF7] hover:border-[#1a1a1a] transition-all text-[10.5px] font-mono"
      title={`${chunk.source} — ${chunk.section}`}
    >
      <span className="font-medium">[{n}]</span>
      <span className="opacity-70 max-w-[140px] truncate">{chunk.section}</span>
    </button>
  );
}

function CitationCard({ n, chunk }) {
  return (
    <div className="border border-[#1a1a1a]/10 rounded-lg p-3.5 bg-white/50 hover:bg-white transition-colors">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <div className="font-mono text-[10.5px] text-[#C8553D] font-medium">[{n}]</div>
        <div className="font-mono text-[9.5px] text-[#7a7a72] uppercase tracking-wider">
          p.{chunk.page}
        </div>
      </div>
      <div className="text-[12.5px] font-medium text-[#1a1a1a] mb-0.5 leading-snug">
        {chunk.brand}
      </div>
      <div className="text-[11px] text-[#7a7a72] mb-2 font-mono">
        {chunk.source} · {chunk.section}
      </div>
      <div className="text-[12px] text-[#3a3a35] leading-relaxed line-clamp-4">
        {chunk.text}
      </div>
    </div>
  );
}

function MessageBubble({ msg, onCitationClick }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end mb-7">
        <div className="max-w-[78%]">
          {msg.image && (
            <div className="mb-2 rounded-lg overflow-hidden border border-[#1a1a1a]/10">
              <img src={msg.image} alt="user upload" className="max-h-56 object-cover" />
            </div>
          )}
          <div className="bg-[#1a1a1a] text-[#FAFAF7] rounded-2xl rounded-tr-md px-4 py-2.5 text-[14px] leading-relaxed">
            {msg.text}
          </div>
          {msg.detectedLang && msg.detectedLang !== "en-IN" && (
            <div className="text-[10px] font-mono text-[#7a7a72] mt-1 text-right">
              voice · {msg.detectedLang}
            </div>
          )}
        </div>
      </div>
    );
  }

  // assistant
  const renderText = (text, retrieved) => {
    if (!text) return null;
    // split by [N] markers
    const parts = text.split(/(\[\d+\])/g);
    return parts.map((p, i) => {
      const m = p.match(/^\[(\d+)\]$/);
      if (m) {
        const n = parseInt(m[1], 10);
        const chunk = retrieved?.[n - 1]?.chunk;
        if (chunk) {
          return (
            <CitationPill
              key={i}
              n={n}
              chunk={chunk}
              onClick={() => onCitationClick(n - 1)}
            />
          );
        }
      }
      return <span key={i}>{p}</span>;
    });
  };

  return (
    <div className="flex justify-start mb-7">
      <div className="max-w-[88%] w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-[#1a1a1a] flex items-center justify-center">
            <Sparkles className="w-2.5 h-2.5 text-[#FAFAF7]" />
          </div>
          <div className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-[#7a7a72]">
            {msg.refused ? "Refused (out of scope)" : "Diagnosis"}
          </div>
          {msg.confidence != null && !msg.refused && (
            <div className="text-[10px] font-mono text-[#7a7a72]">
              · top match {(msg.confidence * 100).toFixed(0)}%
            </div>
          )}
        </div>

        {msg.refused ? (
          <div className="bg-[#FFF8E7] border border-[#E8B84A]/40 rounded-xl p-4 flex gap-3 items-start">
            <AlertTriangle className="w-4 h-4 text-[#B8881A] mt-0.5 flex-shrink-0" />
            <div className="text-[13.5px] text-[#5a4a1a] leading-relaxed">
              {msg.text}
            </div>
          </div>
        ) : (
          <div className="text-[14.5px] leading-[1.65] text-[#1a1a1a] whitespace-pre-wrap [&_button]:mx-0.5">
            {renderText(msg.text, msg.retrieved)}
          </div>
        )}

        {msg.ttsUrl && (
          <audio controls className="mt-3 h-8 w-full max-w-sm" src={msg.ttsUrl} />
        )}

        {msg.retrieved && msg.retrieved.length > 0 && !msg.refused && (
          <div className="mt-5">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#7a7a72] mb-2.5 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Retrieved manual sections
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {msg.retrieved.map((r, i) => (
                <CitationCard key={i} n={i + 1} chunk={r.chunk} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({ open, onClose, sarvamKey, setSarvamKey, voiceLang, setVoiceLang, ttsEnabled, setTtsEnabled }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a1a]/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#FAFAF7] border border-[#1a1a1a]/15 rounded-2xl max-w-md w-full p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="font-display text-[22px] text-[#1a1a1a] leading-none font-medium tracking-tight">Settings</div>
            <div className="text-[11px] font-mono text-[#7a7a72] mt-1.5">Voice & language configuration</div>
          </div>
          <button onClick={onClose} className="text-[#7a7a72] hover:text-[#1a1a1a]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3a3a35] mb-1.5">
              Sarvam API Key
            </label>
            <input
              type="password"
              value={sarvamKey}
              onChange={e => setSarvamKey(e.target.value)}
              placeholder="sk_..."
              className="w-full px-3 py-2 text-[13px] font-mono bg-white border border-[#1a1a1a]/15 rounded-lg focus:outline-none focus:border-[#C8553D]"
            />
            <p className="text-[11px] text-[#7a7a72] mt-1.5 leading-relaxed">
              Used for Indic ASR (Saarika), TTS (Bulbul), and translation. Without a key, voice input falls back to the browser's Web Speech API (English only). Get a key at sarvam.ai.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#3a3a35] mb-1.5">
              Voice Input Language
            </label>
            <select
              value={voiceLang}
              onChange={e => setVoiceLang(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-white border border-[#1a1a1a]/15 rounded-lg focus:outline-none focus:border-[#C8553D]"
            >
              <option value="unknown">Auto-detect (Sarvam)</option>
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">हिन्दी (Hindi)</option>
              <option value="ta-IN">தமிழ் (Tamil)</option>
              <option value="te-IN">తెలుగు (Telugu)</option>
              <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
              <option value="ml-IN">മലയാളം (Malayalam)</option>
              <option value="mr-IN">मराठी (Marathi)</option>
              <option value="bn-IN">বাংলা (Bengali)</option>
              <option value="gu-IN">ગુજરાતી (Gujarati)</option>
              <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-[13px] text-[#1a1a1a] font-medium">Speak responses aloud</div>
              <div className="text-[11px] text-[#7a7a72]">Generates audio via Bulbul (requires key)</div>
            </div>
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`w-10 h-5 rounded-full transition-colors relative ${ttsEnabled ? "bg-[#C8553D]" : "bg-[#1a1a1a]/15"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${ttsEnabled ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ManualLibrary({ chunks, uploadedChunks, onUpload, isUploading, uploadError }) {
  const fileInputRef = useRef(null);
  const allBrands = useMemo(() => {
    const map = new Map();
    chunks.forEach(c => {
      const k = c.brand;
      map.set(k, (map.get(k) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [chunks]);

  return (
    <div className="px-4 py-3 border-b border-[#1a1a1a]/8 bg-[#F5F4EE]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <BookOpen className="w-3.5 h-3.5 text-[#7a7a72] flex-shrink-0" />
          <span className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-[#7a7a72] flex-shrink-0">
            Indexed
          </span>
          <div className="flex gap-1.5 overflow-x-auto">
            {allBrands.map(([brand, count]) => (
              <div
                key={brand}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#1a1a1a]/12 bg-white text-[11px] whitespace-nowrap"
              >
                <span className="text-[#1a1a1a]">{brand}</span>
                <span className="font-mono text-[10px] text-[#7a7a72]">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#1a1a1a]/15 bg-white hover:bg-[#1a1a1a] hover:text-[#FAFAF7] text-[11px] transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          {isUploading ? "Indexing..." : "Add manual PDF"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
      </div>
      {uploadError && (
        <div className="text-[11px] text-[#C8553D] mt-2 font-mono">{uploadError}</div>
      )}
    </div>
  );
}

function SuggestionChips({ onPick }) {
  const suggestions = [
    "White smoke from my Royal Enfield's exhaust",
    "Apache RTR engine light is on, what does it mean?",
    "Pulsar 150 won't start in the morning",
    "Chain slack — what's the correct adjustment?",
  ];
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map(s => (
        <button
          key={s}
          onClick={() => onPick(s)}
          className="px-3 py-1.5 text-[12.5px] text-[#3a3a35] bg-white border border-[#1a1a1a]/12 rounded-full hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#FAFAF7] transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  ensureFonts();

  const [chunks, setChunks] = useState(SEED_MANUAL_CHUNKS);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null); // {dataUrl, base64, mime}
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStage, setThinkingStage] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sarvamKey, setSarvamKey] = useState("");
  const [voiceLang, setVoiceLang] = useState("unknown");
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [highlightChunk, setHighlightChunk] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { isRecording, start: startRec, stop: stopRec } = useAudioRecorder();

  // build index whenever chunks change
  const index = useMemo(() => new TfIdfIndex(chunks), [chunks]);

  // scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  const handleUpload = async file => {
    setIsUploading(true);
    setUploadError("");
    try {
      // Guess brand from filename if possible
      const lower = file.name.toLowerCase();
      let brand = file.name.replace(/\.pdf$/i, "");
      if (lower.includes("royal") || lower.includes("enfield")) brand = "Royal Enfield (uploaded)";
      else if (lower.includes("apache") || lower.includes("tvs")) brand = "TVS (uploaded)";
      else if (lower.includes("pulsar") || lower.includes("bajaj")) brand = "Bajaj (uploaded)";
      else if (lower.includes("yamaha")) brand = "Yamaha (uploaded)";
      else if (lower.includes("honda")) brand = "Honda (uploaded)";

      const newChunks = await parsePdfToChunks(file, brand);
      if (newChunks.length === 0) {
        setUploadError("No extractable text found in this PDF (may be scanned images — try a text-based PDF).");
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

  const handleImagePick = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(",")[1];
      setPendingImage({ dataUrl, base64, mime: f.type });
    };
    reader.readAsDataURL(f);
    e.target.value = "";
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      const blob = await stopRec();
      if (!blob) return;
      if (!sarvamKey) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            refused: true,
            text: "Voice input requires a Sarvam API key. Add one in Settings (top-right) — Sarvam's Saarika model handles Indian languages that browser ASR cannot. Or, just type your question.",
          },
        ]);
        return;
      }
      try {
        setIsThinking(true);
        setThinkingStage("Transcribing with Sarvam Saarika...");
        const { transcript, languageCode } = await sarvamSpeechToText({
          audioBlob: blob,
          apiKey: sarvamKey,
          languageCode: voiceLang,
        });
        setIsThinking(false);
        setThinkingStage("");
        if (transcript) {
          await handleSend(transcript, { detectedLang: languageCode });
        }
      } catch (e) {
        setIsThinking(false);
        setThinkingStage("");
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            refused: true,
            text: `Voice transcription failed: ${e.message}. Check your Sarvam API key in Settings.`,
          },
        ]);
      }
    } else {
      try {
        await startRec();
      } catch (e) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            refused: true,
            text: "Microphone access was denied. Allow microphone permission in your browser to use voice input.",
          },
        ]);
      }
    }
  };

  const handleSend = async (rawText, opts = {}) => {
    const text = (rawText ?? input).trim();
    if (!text && !pendingImage) return;
    const image = pendingImage;
    const detectedLang = opts.detectedLang;

    const userMsg = {
      role: "user",
      text: text || "(see image)",
      image: image?.dataUrl,
      detectedLang,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setPendingImage(null);
    setIsThinking(true);

    try {
      // Step 1: build retrieval query.
      // If non-English voice input, translate to English first for retrieval (manuals are EN).
      let retrievalQuery = text;
      if (detectedLang && detectedLang !== "en-IN" && detectedLang !== "unknown" && sarvamKey) {
        setThinkingStage("Translating for retrieval...");
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

      // Step 1b: if image, ask Claude to describe the symptom in 1 line, then add to retrieval query
      let visionHint = "";
      if (image) {
        setThinkingStage("Analysing image...");
        try {
          visionHint = await callClaude({
            system:
              "You are a motorcycle expert looking at a single image. In ONE short sentence (max 20 words), describe what symptom or condition you observe (e.g., 'white smoke from exhaust', 'broken chain link', 'corroded battery terminal'). Output the sentence only, no preamble.",
            userText: "Describe the symptom or condition shown.",
            imageBase64: image.base64,
            imageMime: image.mime,
          });
          retrievalQuery = (retrievalQuery + " " + visionHint).trim();
        } catch (e) {
          console.warn("Vision failed:", e);
        }
      }

      // Step 2: TF-IDF retrieval
      setThinkingStage("Searching manuals...");
      const retrieved = index.search(retrievalQuery, 4);
      const topScore = retrieved[0]?.score || 0;

      // Step 3: Guardrail — refuse before LLM if no decent match
      const THRESHOLD = 0.08;
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

      // Step 4: Call Claude with strict prompt
      setThinkingStage("Reasoning over retrieved context...");
      const systemPrompt = buildSystemPrompt();
      const userPrompt = buildUserMessage({
        question: text + (visionHint ? `\n\n(Image analysis: ${visionHint})` : ""),
        retrieved,
      });
      const answer = await callClaude({
        system: systemPrompt,
        userText: userPrompt,
        imageBase64: image?.base64,
        imageMime: image?.mime,
      });

      const refused = answer.trim() === REFUSAL_PHRASE || answer.includes(REFUSAL_PHRASE);

      const assistantMsg = {
        role: "assistant",
        text: answer,
        retrieved: refused ? [] : retrieved,
        confidence: topScore,
        refused,
      };

      // Step 5: optional TTS
      if (ttsEnabled && sarvamKey && !refused) {
        setThinkingStage("Generating voice...");
        try {
          // strip citation markers for TTS
          const plain = answer.replace(/\[\d+\]/g, "").trim();
          const ttsLang = detectedLang && detectedLang !== "unknown" ? detectedLang : "en-IN";
          let toSpeak = plain;
          if (ttsLang !== "en-IN") {
            // translate answer to user's language
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

  const clearChat = () => setMessages([]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(ellipse at top, #FAFAF7 0%, #F3F1EA 100%)",
        fontFamily: "'Google Sans Text', 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1a1a1a",
      }}
    >
      <style>{`
        .font-display { font-family: 'Google Sans', 'Google Sans Text', -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing: -0.01em; }
        .font-body { font-family: 'Google Sans Text', 'Google Sans', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'Roboto Mono', ui-monospace, 'SF Mono', Menlo, monospace; }
        /* subtle paper grain */
        .grain::before {
          content: "";
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
          pointer-events: none;
          z-index: 1;
          mix-blend-mode: multiply;
        }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(26,26,26,0.15); border-radius: 3px; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .pulse-dot { animation: pulse-dot 1.4s ease-in-out infinite; }
        @keyframes recording-pulse {
          0% { box-shadow: 0 0 0 0 rgba(200, 85, 61, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(200, 85, 61, 0); }
          100% { box-shadow: 0 0 0 0 rgba(200, 85, 61, 0); }
        }
        .recording-pulse { animation: recording-pulse 1.6s infinite; }
      `}</style>
      <div className="grain" />

      <div className="relative z-10 max-w-3xl mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-5 py-4 border-b border-[#1a1a1a]/8 flex items-center justify-between backdrop-blur-sm sticky top-0 bg-[#FAFAF7]/80 z-20">
          <Brand />
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-[#7a7a72] hover:text-[#1a1a1a] p-1.5 rounded transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-[#7a7a72] hover:text-[#1a1a1a] p-1.5 rounded transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Manual library strip */}
        <ManualLibrary
          chunks={chunks}
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadError={uploadError}
        />

        {/* Messages */}
        <main className="flex-1 overflow-y-auto scrollbar-thin px-5 py-7">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
              <div className="mb-8">
                <div className="font-display text-[42px] leading-[1.05] text-[#1a1a1a] tracking-[-0.02em] font-medium">
                  What's wrong with
                  <br />
                  your bike?
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7a7a72] mt-4">
                  Answers grounded only in your manual
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10 max-w-md w-full">
                <FeatureChip icon={<FileText className="w-3.5 h-3.5" />} label="Manual-grounded" />
                <FeatureChip icon={<Mic className="w-3.5 h-3.5" />} label="Voice in 11 languages" />
                <FeatureChip icon={<ImageIcon className="w-3.5 h-3.5" />} label="Image diagnosis" />
              </div>

              <SuggestionChips onPick={s => handleSend(s)} />

              <div className="mt-12 text-[11px] font-mono text-[#7a7a72] max-w-md leading-relaxed">
                Loaded with sample sections for Royal Enfield Classic 350, TVS Apache RTR 160, and Bajaj Pulsar 150. Add your own manual via the strip above.
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((m, i) => (
                <MessageBubble key={i} msg={m} onCitationClick={idx => setHighlightChunk(m.retrieved?.[idx]?.chunk)} />
              ))}
              {isThinking && (
                <div className="flex items-center gap-2.5 mb-7 text-[#7a7a72]">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] pulse-dot" style={{ animationDelay: "0s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] pulse-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a] pulse-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                  <span className="text-[11.5px] font-mono">{thinkingStage || "Thinking..."}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Composer */}
        <footer className="px-5 pb-5 pt-2 sticky bottom-0 bg-gradient-to-t from-[#FAFAF7] via-[#FAFAF7] to-transparent">
          {pendingImage && (
            <div className="mb-2 inline-flex items-center gap-2 bg-white border border-[#1a1a1a]/15 rounded-lg p-1.5 pr-3">
              <img src={pendingImage.dataUrl} className="w-10 h-10 object-cover rounded" />
              <span className="text-[12px] text-[#3a3a35]">Image attached</span>
              <button onClick={() => setPendingImage(null)} className="text-[#7a7a72] hover:text-[#C8553D]">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="bg-white border border-[#1a1a1a]/15 rounded-2xl shadow-sm focus-within:border-[#1a1a1a]/40 transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={isRecording ? "Listening..." : "Describe the issue, or speak / attach a photo"}
              disabled={isThinking || isRecording}
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-[14.5px] focus:outline-none resize-none placeholder:text-[#7a7a72]/70 disabled:opacity-50"
              style={{ maxHeight: 120 }}
            />
            <div className="flex items-center justify-between px-2 pb-2">
              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isThinking}
                  className="p-2 text-[#7a7a72] hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-lg transition-colors disabled:opacity-50"
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
                  onClick={handleVoiceToggle}
                  disabled={isThinking}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                    isRecording
                      ? "bg-[#C8553D] text-white recording-pulse"
                      : "text-[#7a7a72] hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5"
                  }`}
                  title={isRecording ? "Stop recording" : "Voice input"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                {sarvamKey && (
                  <div className="flex items-center gap-1 px-2 ml-1 text-[10px] font-mono text-[#7a7a72]">
                    <Languages className="w-3 h-3" />
                    <span>{voiceLang === "unknown" ? "auto" : voiceLang}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSend()}
                disabled={isThinking || (!input.trim() && !pendingImage)}
                className="px-3 py-1.5 bg-[#1a1a1a] text-[#FAFAF7] rounded-lg text-[13px] font-medium hover:bg-[#C8553D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Diagnose
              </button>
            </div>
          </div>
          <div className="text-center text-[10px] font-mono text-[#7a7a72] mt-2">
            Answers strictly grounded in indexed manual sections. For safety-critical issues, see your service center.
          </div>
        </footer>
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sarvamKey={sarvamKey}
        setSarvamKey={setSarvamKey}
        voiceLang={voiceLang}
        setVoiceLang={setVoiceLang}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
      />

      {/* Chunk preview modal */}
      {highlightChunk && (
        <div
          className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setHighlightChunk(null)}
        >
          <div
            className="bg-[#FAFAF7] border border-[#1a1a1a]/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-display text-[20px] text-[#1a1a1a] leading-tight font-medium tracking-tight">
                  {highlightChunk.brand}
                </div>
                <div className="text-[11px] font-mono text-[#7a7a72] mt-1">
                  {highlightChunk.source} · {highlightChunk.section} · p.{highlightChunk.page}
                </div>
              </div>
              <button onClick={() => setHighlightChunk(null)} className="text-[#7a7a72] hover:text-[#1a1a1a]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[13.5px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">
              {highlightChunk.text}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureChip({ icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-[#3a3a35]">
      <div className="w-8 h-8 rounded-md border border-[#1a1a1a]/15 flex items-center justify-center bg-white">
        {icon}
      </div>
      <div className="text-[10.5px] font-mono text-[#7a7a72] text-center leading-tight">{label}</div>
    </div>
  );
}
