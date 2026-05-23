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
  AudioLines,
  PhoneOff,
  Menu,
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
   AUDIO FORMAT CONVERSION
   Sarvam's ASR rejects audio/webm. Browsers' MediaRecorder
   produces webm/opus by default. We decode it via Web Audio API
   and re-encode as 16-bit PCM WAV @ 16 kHz mono — the canonical
   ASR-friendly format.
   ============================================================ */
async function blobToWav16kMono(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const AC = window.AudioContext || window.webkitAudioContext;
  // Create context at 16k so decodeAudioData resamples for us
  const ctx = new AC({ sampleRate: 16000 });
  let audioBuffer;
  try {
    audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
  } catch (e) {
    await ctx.close().catch(() => {});
    throw new Error("Could not decode recorded audio");
  }
  const sampleRate = audioBuffer.sampleRate; // should be 16000 now
  const length = audioBuffer.length;
  const numChannels = audioBuffer.numberOfChannels;

  // Mix-down to mono
  const mono = new Float32Array(length);
  for (let ch = 0; ch < numChannels; ch++) {
    const data = audioBuffer.getChannelData(ch);
    for (let i = 0; i < length; i++) mono[i] += data[i] / numChannels;
  }

  await ctx.close().catch(() => {});
  return encodeWavPcm16(mono, sampleRate);
}

function encodeWavPcm16(samples, sampleRate) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  // RIFF header
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, "WAVE");
  // fmt chunk
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);            // PCM chunk size
  view.setUint16(20, 1, true);             // format = PCM
  view.setUint16(22, 1, true);             // channels = 1 (mono)
  view.setUint32(24, sampleRate, true);    // sample rate
  view.setUint32(28, sampleRate * 2, true);// byte rate
  view.setUint16(32, 2, true);             // block align
  view.setUint16(34, 16, true);            // bits per sample
  // data chunk
  writeStr(36, "data");
  view.setUint32(40, dataSize, true);

  // 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

/* ============================================================
   SARVAM API
   ============================================================ */
// When true, all Sarvam calls go through same-origin /api/sarvam-* proxies
// (deployed mode — server-side key, no browser exposure). When false, calls
// go direct to api.sarvam.ai with the user-supplied key from Settings.
// Build script flips this to true for the deployed bundle.
const SARVAM_USE_PROXY = true;
const SARVAM_BASE = "https://api.sarvam.ai";

async function sarvamSpeechToText({ audioBlob, apiKey, languageCode = "unknown" }) {
  // Sarvam accepts only PCM/WAV/MP3. Browsers record WebM/Opus by default,
  // so we transcode in the browser to 16 kHz mono 16-bit WAV first.
  const wavBlob = await blobToWav16kMono(audioBlob);
  const form = new FormData();
  form.append("file", wavBlob, "audio.wav");
  form.append("model", "saarika:v2.5");
  form.append("language_code", languageCode);
  const url = SARVAM_USE_PROXY ? "/api/sarvam-stt" : `${SARVAM_BASE}/speech-to-text`;
  const headers = SARVAM_USE_PROXY ? {} : { "api-subscription-key": apiKey };
  const res = await fetch(url, { method: "POST", headers, body: form });
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
  const url = SARVAM_USE_PROXY ? "/api/sarvam-translate" : `${SARVAM_BASE}/translate`;
  const headers = { "Content-Type": "application/json" };
  if (!SARVAM_USE_PROXY) headers["api-subscription-key"] = apiKey;
  const res = await fetch(url, {
    method: "POST",
    headers,
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
  const url = SARVAM_USE_PROXY ? "/api/sarvam-tts" : `${SARVAM_BASE}/text-to-speech`;
  const headers = { "Content-Type": "application/json" };
  if (!SARVAM_USE_PROXY) headers["api-subscription-key"] = apiKey;
  const res = await fetch(url, {
    method: "POST",
    headers,
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

/* TTS engines like Bulbul read "TVS" as one word ("tvs"). Spell out common
   motorcycle acronyms letter-by-letter so they sound natural. Whitelist
   approach — pattern-matching all-caps would wrongly split legitimate
   emphasis like "WHITE SMOKE". */
const TTS_ACRONYMS = [
  "TVS", "EFI", "ECU", "MIL", "DTS", "RTR", "ABS", "MAP", "NGK", "RPM",
  "PSI", "MF", "JASO", "DTC", "OEM", "BS6", "BS4", "BHP", "BTU", "DCT",
  "DOHC", "SOHC", "OHC", "OHV", "TPMS", "EBC", "DOT", "MPG", "KMPL",
  "MAF", "CDI", "AGM", "USB", "LED", "VIN",
];
function expandAcronymsForTts(text) {
  let out = text;
  for (const acr of TTS_ACRONYMS) {
    // Use word boundaries so we don't break larger words containing the letters
    out = out.replace(new RegExp(`\\b${acr}\\b`, "g"), acr.split("").join(" "));
  }
  return out;
}

/* Persistent storage helpers. Used for the Sarvam API key, voice language,
   and TTS toggle so users don't have to re-enter on every reload. Wrapped
   in try/catch — Claude.ai's artifact preview blocks localStorage, in which
   case these silently no-op (session-only state, as before). Works normally
   on any deployed site. */
function readStored(key, fallback = "") {
  try {
    if (typeof window === "undefined") return fallback;
    const v = window.localStorage?.getItem(key);
    return v === null || v === undefined ? fallback : v;
  } catch { return fallback; }
}
function writeStored(key, value) {
  try {
    if (typeof window === "undefined") return;
    if (value === "" || value == null) window.localStorage?.removeItem(key);
    else window.localStorage?.setItem(key, String(value));
  } catch {}
}

/* Compress / resize an uploaded image client-side before sending to Claude
   vision. Resizes to fit within MAX_DIM on the longest side (1568px is the
   Anthropic recommendation for fastest vision processing) and re-encodes as
   JPEG. Keeps base64 payload well under Vercel's 4.5MB body limit even when
   the user uploads a 5MB phone photo. */
function compressImageForVision(file, maxDim = 1568, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const scale = maxDim / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      // White background for transparent PNGs converted to JPEG
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          if (!blob) { reject(new Error("Image compression failed")); return; }
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result;
            const base64 = dataUrl.split(",")[1];
            resolve({ dataUrl, base64, mime: "image/jpeg" });
          };
          reader.onerror = () => reject(new Error("Read error after compression"));
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image — file may be corrupt or unsupported"));
    };
    img.src = url;
  });
}

/* ============================================================
   CLAUDE
   ============================================================ */
async function callClaude({ system, userText, imageBase64, imageMime, history = [], model }) {
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

  // history is already in Anthropic API format: [{role, content}, ...]
  const messages = [...history, { role: "user", content: userContent }];

  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-6",
      max_tokens: 1200,
      system,
      messages,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude ${res.status}: ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content.map(c => (c.type === "text" ? c.text : "")).join("").trim();
}

/* Fast/cheap model alias. In the artifact preview this stays the same as
   the main model (Haiku isn't available in the sandbox), but the deploy
   build sed-flips it to claude-haiku-4-5 for ~50% faster query rewriting
   and voice-mode responses. */
const CLAUDE_FAST_MODEL = "claude-haiku-4-5";

/* Heuristic: only rewrite the query when it actually looks like a context-
   dependent follow-up. For long standalone questions, skip the extra LLM
   call entirely — saves ~1-2 seconds of latency. */
function shouldRewriteQuery(question) {
  const lc = question.trim().toLowerCase();
  const words = lc.split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;
  if (words.length <= 4) return true; // very short queries are usually follow-ups
  // Pronouns / contextual references
  if (/\b(it|this|that|these|those|them|they|next|more|continue|also|then|same|like|too|further|previous|after that)\b/.test(lc)) return true;
  // Follow-up starters
  if (/^(what about|how about|and |but |so |okay|ok |tell me|can you|will it|is there|are there|do i|should i|why|how do i)\b/.test(lc)) return true;
  return false;
}

/* Build conversation history in Anthropic API format from the local messages
   array. We strip citation markers and FOLLOWUPS sections from assistant
   text so the model isn't confused by stale [N] references that pointed to
   a different set of excerpts in an earlier turn. Refused turns are dropped
   — they're not useful context, just dead ends. Cap to recent turns to keep
   the token budget bounded. */
function buildConversationHistory(messages, maxTurns = 3) {
  const useful = messages.filter(m => !m.refused);
  const recent = useful.slice(-(maxTurns * 2));
  return recent.map(m => {
    let content = m.text || "";
    if (m.role === "assistant") {
      content = content
        .replace(/===FOLLOWUPS===[\s\S]*$/, "")
        .replace(/\[\d+\]/g, "")
        .trim();
    }
    if (content.length > 1200) content = content.slice(0, 1200) + "...";
    return { role: m.role, content };
  });
}

/* Use Claude itself to rewrite a follow-up question as a standalone query
   suitable for keyword retrieval. Critical for follow-ups like "next steps"
   or "tell me more" — without this, retrieval would return weak/no matches
   and the pipeline would refuse. */
async function rewriteFollowUpQuery(question, history) {
  if (!history || history.length === 0) return question;
  const ctx = history
    .map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");
  const prompt = `Conversation so far:
${ctx}

User's new message: "${question}"

If the new message depends on the conversation context above (uses pronouns like "it", "this", "that", or refers to "next steps", "more details", "the same issue", etc.), rewrite it as a standalone, self-contained question that includes the necessary context from the prior turns. Keep it under 25 words. If the message is already standalone, return it unchanged.

Output ONLY the rewritten question. No preamble, no quotes, no explanation.`;
  try {
    const rewritten = await callClaude({
      system: "You rewrite follow-up motorcycle questions as standalone search queries. Output ONLY the rewritten question text.",
      userText: prompt,
      model: CLAUDE_FAST_MODEL,
    });
    const cleaned = (rewritten || question)
      .replace(/^["'`\s]+|["'`\s]+$/g, "")
      .trim();
    return cleaned.slice(0, 250) || question;
  } catch (e) {
    console.warn("Query rewrite failed, falling back to original:", e);
    return question;
  }
}

/* ============================================================
   PROMPTS
   ============================================================ */
const REFUSAL_PHRASE =
  "I couldn't find this in the loaded manual sections. Please consult your authorized service center or upload additional manual pages covering this topic.";

function buildSystemPrompt() {
  return `You are a motorcycle troubleshooting assistant in an ongoing conversation. The user message you see may be part of a multi-turn exchange — earlier turns appear above as conversation history. Use that context. Follow these rules:

1. Answer using the MANUAL EXCERPTS provided in the user message AND your earlier turns in this conversation. The excerpts may come from a DIFFERENT motorcycle model than the user's bike. That is okay — general motorcycle troubleshooting principles (engine diagnosis, electrical, brakes, exhaust smoke colors, cold-start behaviour, charging system voltages, etc.) typically apply across brands and models. When you apply principles from a different model's manual, briefly say so, e.g., "Based on general principles from the [Brand] service manual..." or "The same diagnosis applies broadly to most motorcycles..."

2. If the user is asking a follow-up like "next steps", "tell me more", "what should I check first", treat it as a continuation of the prior topic. Do NOT ask them to repeat themselves.

3. Only refuse if the excerpts AND prior conversation do not cover the topic at all. In that case, reply with EXACTLY this sentence and nothing else:
"${REFUSAL_PHRASE}"

4. Cite every factual claim with [N] markers matching excerpt numbers. Multiple citations like [1][3] are fine. Cite generously.

5. WRITE CONVERSATIONALLY. Use flowing prose, not a hierarchical document. Avoid headings (## or ###) unless the response genuinely covers multiple distinct topics; usually you do NOT need any headings. Use **bold** sparingly for the single most important phrase. Use - bullets only when listing 3+ short parallel items. Default to plain paragraphs.

6. Be concise. Lead with the most likely cause. Aim for 4–8 sentences for typical questions; only go longer when the user explicitly needs a multi-step procedure.

7. For safety-critical issues (brakes, fuel leaks, electrical fires, hot engine, fuel system), include a brief safety note recommending professional service.

8. If an image is provided, briefly describe what you observe (one line) before answering.

9. Never invent specific part numbers, torque values, jet sizes, or model-specific specs. Use only values present in the excerpts. If a spec isn't in the excerpts for the user's bike, say "consult your model's specifications" rather than guessing.

10. AFTER your answer, on a new line, write exactly: ===FOLLOWUPS===
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

/* Voice-mode prompt: response will be spoken via TTS, so it must be
   short, conversational, and free of markdown / citation markers. */
function buildVoiceModeSystemPrompt() {
  return `You are a friendly motorcycle assistant having a SPOKEN PHONE CONVERSATION. Your response will be read aloud to the user via text-to-speech. This is a multi-turn conversation — earlier turns may appear above as conversation history. Use that context naturally.

CRITICAL rules:
1. Keep responses VERY SHORT — 2 to 4 sentences total. Talk like a phone call, not a lecture.
2. NO markdown. NO bullets. NO headings (## or ###). NO citation markers like [1].
3. Speak in plain natural sentences. No lists.
4. Answer using ONLY the manual excerpts provided AND your prior turns in this conversation. If the user asks a follow-up like "what's next" or "and then?", continue the prior topic naturally — do NOT ask them to start over.
5. The excerpts may be from a different bike — general principles often apply across motorcycles, briefly say so when relevant.
6. If no excerpt covers the topic at all, say something like: "I don't have that in your manuals — best to check with a service center."
7. For safety-critical issues (brakes, fuel, fire, hot engine), include a one-sentence recommendation to see a mechanic.
8. NEVER invent specific part numbers, torques, or specs. If not in excerpts, say you don't have that detail.

Do NOT output a ===FOLLOWUPS=== section. This is voice mode.

Plain text only. Your output goes directly to a TTS engine.`;
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
  const audioLevelRef = useRef(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setAudioLevel(0);
    audioLevelRef.current = 0;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
  };

  // Pick a MIME type the browser actually supports. iOS Safari/Chrome (all
  // iOS browsers are WebKit) don't support audio/webm at all — they use
  // audio/mp4. Try a list in order; fall back to the browser default if
  // nothing matches (most browsers will then pick something sensible).
  const pickRecorderMime = () => {
    if (typeof MediaRecorder === "undefined") return "";
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
    ];
    for (const c of candidates) {
      try { if (MediaRecorder.isTypeSupported(c)) return c; } catch {}
    }
    return ""; // let the browser pick
  };

  const start = async () => {
    // Pre-flight: feature detect. Some old browsers / WebViews have no mediaDevices.
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("This browser doesn't support microphone access. Try Safari or Chrome over HTTPS.");
    }
    if (typeof MediaRecorder === "undefined") {
      throw new Error("This browser doesn't support audio recording.");
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      // Decode the error properly so users get an accurate message
      const name = e?.name || "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        throw new Error("Microphone permission denied. Allow microphone access in your browser settings, then reload the page.");
      }
      if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        throw new Error("No microphone found on this device.");
      }
      if (name === "NotReadableError" || name === "TrackStartError") {
        throw new Error("Microphone is in use by another app. Close other apps using the mic and try again.");
      }
      if (name === "SecurityError") {
        throw new Error("Microphone requires an HTTPS connection.");
      }
      throw new Error(e?.message || "Could not access the microphone.");
    }
    streamRef.current = stream;

    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) {
      cleanup();
      throw new Error("Your browser doesn't support audio analysis.");
    }
    const ctx = new AC();
    audioContextRef.current = ctx;
    // iOS often creates the AudioContext suspended — must be resumed
    // explicitly after a user gesture. This start() is itself called from
    // a tap, so resume should succeed.
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch {}
    }
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((s, v) => s + v, 0) / data.length;
      const lvl = Math.min(1, (avg / 255) * 1.6);
      audioLevelRef.current = lvl;
      setAudioLevel(lvl);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    // Create the recorder with whatever MIME type the browser supports.
    const mime = pickRecorderMime();
    let mr;
    try {
      mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    } catch (e) {
      // Last-ditch: try with no options
      try { mr = new MediaRecorder(stream); }
      catch (e2) {
        cleanup();
        throw new Error("This browser can't record audio in any supported format.");
      }
    }
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

  return { isRecording, audioLevel, audioLevelRef, start, stop, cancel };
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
        <div className="flex flex-col leading-tight justify-center">
          <div className="font-display text-[16px] font-bold text-[#0A1628] tracking-tight">
            garageOS
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
  mobileOpen,
  onMobileClose,
}) {
  const fileInputRef = useRef(null);

  return (
    <aside
      className={`
        bg-white/95 md:bg-white/50 backdrop-blur-sm border-r border-[#E5E4DF]/70 flex flex-col
        transition-transform duration-200 ease-out
        fixed md:relative inset-y-0 left-0 z-50
        w-[280px] ${collapsed ? "md:w-[56px]" : "md:w-[280px]"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      {/* Logo & collapse toggle */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2 pt-3 pb-2">
          <Logo collapsed={true} />
          <button
            onClick={onToggleCollapse}
            className="hidden md:block text-[#64748B] hover:text-[#0A1628] hover:bg-[#EFF6FF] p-1.5 rounded-md transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Logo collapsed={false} />
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:block text-[#64748B] hover:text-[#0A1628] hover:bg-[#EFF6FF] p-1.5 rounded-md transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
            <button
              onClick={onMobileClose}
              className="md:hidden text-[#64748B] hover:text-[#0A1628] hover:bg-[#EFF6FF] p-1.5 rounded-md transition-colors"
              title="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* New chat */}
      <div className={`${collapsed ? "px-2" : "px-3"} pt-2 pb-3`}>
        <button
          onClick={onNewConversation}
          className={`w-full flex items-center ${collapsed ? "justify-center h-10 w-10 mx-auto" : "justify-start gap-2 px-4 py-2.5"} bg-[#0A1628] hover:bg-[#1E293B] text-white rounded-full text-[13px] font-medium transition-all shadow-md shadow-black/10 hover:shadow-lg`}
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

      <div className={`${collapsed ? "px-2" : "px-3"} mt-2 border-t border-[#E5E4DF] pt-3`}>
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
      <div className={`mt-auto ${collapsed ? "px-2" : "px-3"} py-3 border-t border-[#E5E4DF]`}>
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
      className="text-left border border-[#E5E4DF] hover:border-[#2563EB] rounded-lg p-3.5 bg-white hover:shadow-md hover:shadow-blue-500/5 transition-all w-full"
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


function MessageBubble({ msg, onCitationClick, onFollowupClick }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[75%]">
          {msg.image && (
            <div className="mb-2 rounded-xl overflow-hidden border border-[#E5E4DF]">
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
  // Buffered draft — only commit to parent state when user clicks Save
  const [draftKey, setDraftKey] = useState(sarvamKey);
  const [draftLang, setDraftLang] = useState(voiceLang);
  const [draftTts, setDraftTts] = useState(ttsEnabled);

  // Re-sync draft when modal opens
  useEffect(() => {
    if (open) {
      setDraftKey(sarvamKey);
      setDraftLang(voiceLang);
      setDraftTts(ttsEnabled);
    }
  }, [open, sarvamKey, voiceLang, ttsEnabled]);

  if (!open) return null;

  const handleSave = () => {
    const trimmedKey = draftKey.trim();
    setSarvamKey(trimmedKey);
    setVoiceLang(draftLang);
    setTtsEnabled(draftTts);
    writeStored("garageos.sarvam_key", trimmedKey);
    writeStored("garageos.voice_lang", draftLang);
    writeStored("garageos.tts_enabled", draftTts ? "true" : "false");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1628]/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white border border-[#E5E4DF] rounded-2xl max-w-md w-full p-6 shadow-2xl shadow-black/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <div className="font-display text-[20px] text-[#0A1628] font-bold tracking-tight">
            Settings
          </div>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#0A1628]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {!SARVAM_USE_PROXY && (
            <div>
              <label className="block text-[12.5px] font-medium text-[#0A1628] mb-1.5">
                Sarvam API key
              </label>
              <input
                type="password"
                value={draftKey}
                onChange={e => setDraftKey(e.target.value)}
                placeholder="Paste your key"
                className="w-full px-3 py-2 text-[13px] font-mono bg-[#FBFAF7] border border-[#E5E4DF] rounded-lg focus:outline-none focus:border-[#0A1628] focus:bg-white transition-colors"
              />
              <p className="text-[11.5px] text-[#64748B] mt-1.5">
                Enables voice input and translation. Get a key at <span className="font-mono">sarvam.ai</span>.
              </p>
            </div>
          )}

          <div>
            <label className="block text-[12.5px] font-medium text-[#0A1628] mb-1.5">
              Voice language
            </label>
            <select
              value={draftLang}
              onChange={e => setDraftLang(e.target.value)}
              className="w-full px-3 py-2 text-[13px] bg-[#FBFAF7] border border-[#E5E4DF] rounded-lg focus:outline-none focus:border-[#0A1628] focus:bg-white"
            >
              <option value="unknown">Auto-detect</option>
              <option value="en-IN">English</option>
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

          <div className="flex items-center justify-between py-1">
            <div className="text-[13px] text-[#0A1628]">Speak responses aloud</div>
            <button
              onClick={() => setDraftTts(!draftTts)}
              className={`w-10 h-5 rounded-full transition-colors relative ${draftTts ? "bg-[#0A1628]" : "bg-[#E5E4DF]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${draftTts ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[#E5E4DF]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] text-[#475569] hover:text-[#0A1628] hover:bg-[#F5F4F1] rounded-full font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#0A1628] hover:bg-[#1E293B] text-white rounded-full text-[13px] font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentPreviewModal({ doc, onClose, onSelectChunk }) {
  if (!doc) return null;
  return (
    <div className="fixed inset-0 z-50 bg-[#0A1628]/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-4" onClick={onClose}>
      <div
        className="bg-white border border-[#E5E4DF] rounded-2xl max-w-2xl w-full max-h-[88vh] md:max-h-[80vh] flex flex-col shadow-2xl shadow-blue-500/10"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 md:p-6 border-b border-[#E5E4DF]">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div className="min-w-0">
              <div className="font-display text-[16px] md:text-[18px] text-[#0A1628] font-bold tracking-tight leading-tight truncate">
                {doc.brand}
              </div>
              <div className="text-[12px] text-[#5B6B85] mt-0.5 font-mono truncate">
                {doc.source} · {doc.chunks.length} section{doc.chunks.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-[#5B6B85] hover:text-[#0A1628] p-1 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-5 space-y-3">
          {doc.chunks.map((chunk, i) => (
            <button
              key={chunk.id}
              onClick={() => onSelectChunk(chunk)}
              className="w-full text-left p-4 border border-[#E5E4DF] hover:border-[#2563EB] hover:bg-[#EFF6FF]/30 rounded-lg transition-all"
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
    <div className="fixed inset-0 z-[60] bg-[#0A1628]/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-4" onClick={onClose}>
      <div
        className="bg-white border border-[#E5E4DF] rounded-2xl max-w-lg w-full max-h-[88vh] flex flex-col p-5 md:p-6 shadow-2xl"
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
   VOICE MODE — hands-free continuous conversation
   ============================================================ */
function VoiceMode({ onClose, index, sarvamKey, voiceLang, addExchange, messages, onCitationClick }) {
  // state: connecting | listening | thinking | speaking | error
  const [state, setState] = useState("connecting");
  const [userTranscript, setUserTranscript] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const recorder = useAudioRecorder();
  const audioElRef = useRef(null);
  const exitingRef = useRef(false);
  const stateRef = useRef(state);
  const panelScrollRef = useRef(null);
  const imageInputRef = useRef(null);
  const [voiceImage, setVoiceImage] = useState(null); // {dataUrl, base64, mime}
  useEffect(() => { stateRef.current = state; }, [state]);

  // iOS audio unlock: iOS Safari and iOS Chrome (both WebKit) require
  // HTMLAudioElement.play() to be initiated inside a user-gesture context.
  // The user's tap on "Voice mode" IS such a gesture, and this effect runs
  // synchronously from that tap. We prime the audio element here with a
  // 44-byte silent WAV (data URL below) so subsequent .play() calls — which
  // happen many seconds later after STT/LLM/TTS round-trips, far outside
  // the original gesture window — are allowed by iOS.
  useEffect(() => {
    const audio = audioElRef.current;
    if (!audio) return;
    audio.setAttribute("playsinline", "");
    audio.setAttribute("webkit-playsinline", "");
    try {
      // Silent zero-length PCM WAV
      audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
      audio.muted = true;
      const p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(() => { audio.muted = false; }).catch(() => { audio.muted = false; });
      } else {
        audio.muted = false;
      }
    } catch {}
  }, []);

  const handleImagePick = async e => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !f.type?.startsWith("image/")) return;
    if (f.size > 5 * 1024 * 1024) {
      setErrorMsg(`Image too large (${(f.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`);
      setState("error");
      return;
    }
    try {
      const compressed = await compressImageForVision(f);
      setVoiceImage(compressed);
    } catch (err) {
      setErrorMsg(`Couldn't process image: ${err.message}`);
      setState("error");
    }
  };

  // Auto-scroll the live session panel as new messages arrive
  useEffect(() => {
    const el = panelScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, state]);

  // Auto-loop trigger: this ref counts loop iterations; bumping it
  // re-runs the listen → process effect chain.
  const [turn, setTurn] = useState(0);

  // Begin listening when component mounts or a new turn starts
  useEffect(() => {
    if (exitingRef.current) return;
    let cancelled = false;

    (async () => {
      if (!SARVAM_USE_PROXY && !sarvamKey) {
        setErrorMsg("Sarvam API key required. Add one in Settings.");
        setState("error");
        return;
      }
      try {
        setUserTranscript("");
        setAssistantText("");
        await recorder.start();
        if (cancelled || exitingRef.current) {
          recorder.cancel();
          return;
        }
        setState("listening");
      } catch (e) {
        console.error(e);
        setErrorMsg("Microphone permission denied. Allow access and try again.");
        setState("error");
      }
    })();

    return () => { cancelled = true; };
  }, [turn, sarvamKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Voice Activity Detection while listening.
  // Strategy: track a decaying peak of recent audio levels. "Speaking" means
  // current level is at least 45% of that recent peak AND we've sustained
  // it for at least MIN_SPEECH_DURATION_MS. Brief noise spikes (clicks,
  // chair shifts, distant traffic) don't reach the sustained threshold and
  // get silently discarded instead of triggering a false STT round-trip.
  useEffect(() => {
    if (state !== "listening") return;
    const SILENCE_DURATION_MS = 900;
    const MAX_LISTEN_MS = 60000; // generous — only used to refresh the audio stream periodically
    const MIN_PEAK_FOR_SPEECH = 0.05; // absolute floor — must be louder than ambient
    const MIN_SPEECH_DURATION_MS = 500; // sustained speech, not a single spike
    const RELATIVE_RATIO = 0.45;
    const PEAK_DECAY = 0.985;
    let recentPeak = 0;
    let hasSpoken = false;
    let firstLoudTime = null;
    let lastLoudTime = null;
    const startTime = Date.now();

    const id = setInterval(() => {
      if (exitingRef.current || stateRef.current !== "listening") {
        clearInterval(id);
        return;
      }
      const lvl = recorder.audioLevelRef.current;
      const now = Date.now();
      // Update decaying peak
      recentPeak = Math.max(recentPeak * PEAK_DECAY, lvl);
      // Speech detection: peak must be meaningful AND current level near peak
      const speechFloor = Math.max(MIN_PEAK_FOR_SPEECH * RELATIVE_RATIO, recentPeak * RELATIVE_RATIO);
      if (recentPeak > MIN_PEAK_FOR_SPEECH && lvl >= speechFloor) {
        if (!hasSpoken) firstLoudTime = now;
        hasSpoken = true;
        lastLoudTime = now;
      }
      // True end-of-speech: had sustained speech AND now silent long enough
      if (hasSpoken && firstLoudTime && lastLoudTime
          && (lastLoudTime - firstLoudTime) >= MIN_SPEECH_DURATION_MS
          && now - lastLoudTime > SILENCE_DURATION_MS) {
        clearInterval(id);
        processSpeech();
        return;
      }
      // False trigger: heard something briefly but it never sustained long
      // enough to be real speech. Silently reset and keep listening — do NOT
      // transition state, do NOT call STT.
      if (hasSpoken && firstLoudTime && lastLoudTime
          && (lastLoudTime - firstLoudTime) < MIN_SPEECH_DURATION_MS
          && now - lastLoudTime > SILENCE_DURATION_MS) {
        hasSpoken = false;
        firstLoudTime = null;
        lastLoudTime = null;
        recentPeak *= 0.5; // shed memory of the spike so future ambient doesn't keep retriggering
      }
      // Long-running stream refresh — only used as a safety valve so the mic
      // stream doesn't go stale during very long silent periods.
      if (now - startTime > MAX_LISTEN_MS) {
        clearInterval(id);
        recorder.cancel();
        if (!exitingRef.current) setTurn(t => t + 1);
        return;
      }
    }, 80);

    return () => clearInterval(id);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualDone = () => {
    if (stateRef.current === "listening") {
      processSpeech();
    }
  };

  const processSpeech = async () => {
    // Don't flip state to "thinking" yet — wait until we've confirmed the
    // recording actually contains audio. This avoids a visible flash if the
    // VAD fires on a brief noise spike that slipped past the duration check.
    try {
      const blob = await recorder.stop();
      if (!blob || exitingRef.current) return;

      // Very short audio = noise spike that got past VAD. Skip STT entirely
      // and quietly go back to listening — no state change visible to user.
      // 6KB ≈ 0.2s of 16kHz mono 16-bit WAV; anything below that can't be speech.
      if (blob.size < 6000) {
        if (!exitingRef.current) setTurn(t => t + 1);
        return;
      }

      setState("thinking");

      // STT
      const { transcript, languageCode } = await sarvamSpeechToText({
        audioBlob: blob,
        apiKey: sarvamKey,
        languageCode: voiceLang,
      });
      if (!transcript || !transcript.trim()) {
        // STT confirmed there's no speech — silently restart listening
        if (!exitingRef.current) setTurn(t => t + 1);
        return;
      }
      setUserTranscript(transcript);

      // Build conversation history from messages prop (active conversation,
      // including any prior voice or text turns). Capture BEFORE adding
      // this turn's exchange so it represents only "what came before".
      const history = buildConversationHistory(messages, 3);

      // Snapshot the image (if any) for this turn — capture & clear so the
      // next turn doesn't accidentally reuse it.
      const turnImage = voiceImage;

      // Translate to English for retrieval if needed
      let retrievalQuery = transcript;
      if (languageCode && languageCode !== "en-IN" && languageCode !== "unknown") {
        try {
          retrievalQuery = await sarvamTranslate({
            text: transcript,
            apiKey: sarvamKey,
            sourceLang: languageCode,
            targetLang: "en-IN",
          });
        } catch (e) {
          console.warn("Query translation failed, using original:", e);
        }
      }

      // If there's an attached image, get a one-line visual cue and append
      // to retrieval query — same trick as text mode. Uses fast model.
      let visionHint = "";
      if (turnImage) {
        try {
          visionHint = await callClaude({
            system: "You are looking at one motorcycle image. In ONE short sentence (max 20 words), describe the symptom or condition visible. Output the sentence only.",
            userText: "Describe what you see.",
            imageBase64: turnImage.base64,
            imageMime: turnImage.mime,
            model: CLAUDE_FAST_MODEL,
          });
          retrievalQuery = (retrievalQuery + " " + visionHint).trim();
        } catch (e) { console.warn("Voice mode vision hint failed:", e); }
      }

      // Rewrite query only when it actually looks contextual — saves latency
      if (history.length > 0 && shouldRewriteQuery(retrievalQuery)) {
        retrievalQuery = await rewriteFollowUpQuery(retrievalQuery, history);
      }

      // Retrieve
      const retrieved = index.search(retrievalQuery, 4);
      const topScore = retrieved[0]?.score || 0;

      let answer;
      let refused = false;
      if (retrieved.length === 0 || topScore < 0.04) {
        answer = "I don't have that in your manuals. Best to check with a service center.";
        refused = true;
      } else {
        const raw = await callClaude({
          system: buildVoiceModeSystemPrompt(),
          userText: buildUserMessage({
            question: transcript + (visionHint ? `\n(Image: ${visionHint})` : ""),
            retrieved,
          }),
          imageBase64: turnImage?.base64,
          imageMime: turnImage?.mime,
          history,
          model: CLAUDE_FAST_MODEL,
        });
        // Strip any stray markdown / citation markers / followups section
        answer = raw
          .replace(/===FOLLOWUPS===[\s\S]*$/, "")
          .replace(/\[\d+\]/g, "")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/^[-*]\s+/gm, "")
          .replace(/\s+/g, " ")
          .trim();
      }
      if (exitingRef.current) return;
      setAssistantText(answer);

      // Clear the attached image now that this turn is done.
      setVoiceImage(null);

      // Log to chat history
      addExchange(
        { role: "user", text: transcript, detectedLang: languageCode, voiceMode: true, image: turnImage?.dataUrl },
        { role: "assistant", text: answer, retrieved: refused ? [] : retrieved, confidence: topScore, refused, voiceMode: true }
      );

      // Speak
      await speak(answer, languageCode);
    } catch (e) {
      console.error(e);
      const msg = String(e.message || e);
      let friendly = "Something went wrong. Try again.";
      if (/401|403/.test(msg)) friendly = "Sarvam key invalid or out of credits.";
      else if (/network|fetch/i.test(msg)) friendly = "Network error. Check your connection.";
      setErrorMsg(friendly);
      setState("error");
    }
  };

  const speak = async (text, langCode) => {
    setState("speaking");
    try {
      const ttsLang = langCode && langCode !== "unknown" ? langCode : "en-IN";
      let toSpeak = text;
      if (ttsLang !== "en-IN") {
        try {
          toSpeak = await sarvamTranslate({
            text,
            apiKey: sarvamKey,
            sourceLang: "en-IN",
            targetLang: ttsLang,
          });
        } catch (e) { console.warn("Reply translation failed:", e); }
      }
      // Spell out motorcycle acronyms (TVS, EFI, ECU, …) for natural speech
      toSpeak = expandAcronymsForTts(toSpeak);
      const url = await sarvamTextToSpeech({
        text: toSpeak.slice(0, 500),
        apiKey: sarvamKey,
        targetLang: ttsLang,
      });
      if (exitingRef.current) return;

      // Reuse the persistent audio element — was already "unlocked" on mount
      // from the user gesture that opened voice mode. iOS will allow this
      // play() even outside a fresh gesture context.
      const audio = audioElRef.current;
      const onDone = () => {
        if (!exitingRef.current) setTurn(t => t + 1);
      };
      if (!audio) {
        // Defensive fallback — shouldn't happen, but keep the loop alive.
        setTimeout(onDone, 1800);
        return;
      }
      audio.onended = onDone;
      audio.onerror = onDone;
      audio.src = url;
      try {
        await audio.play();
      } catch (e) {
        // iOS rejects silently when audio is locked — keep the conversation
        // moving rather than stalling on a "speaking" state forever.
        console.warn("Audio play blocked:", e);
        setTimeout(onDone, 1800);
      }
    } catch (e) {
      console.warn("TTS failed:", e);
      // No audio output — pause briefly so the user can read, then loop
      setTimeout(() => {
        if (!exitingRef.current) setTurn(t => t + 1);
      }, 2200);
    }
  };

  const handleEnd = () => {
    exitingRef.current = true;
    recorder.cancel();
    if (audioElRef.current) {
      try { audioElRef.current.pause(); } catch {}
      // Don't null — element belongs to a JSX ref, will be cleaned by unmount
    }
    onClose();
  };

  // Unmount cleanup
  useEffect(() => {
    return () => {
      exitingRef.current = true;
      try { recorder.cancel(); } catch {}
      if (audioElRef.current) {
        try { audioElRef.current.pause(); } catch {}
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Orb visual: scale modulated by mic level when listening; rhythmic pulse otherwise
  const orbScale =
    state === "listening" ? 1 + recorder.audioLevel * 0.35 :
    state === "speaking"  ? 1 :
    state === "thinking"  ? 1 : 1;
  const orbGlow =
    state === "listening" ? 40 + recorder.audioLevel * 140 :
    state === "speaking"  ? 80 :
    state === "thinking"  ? 60 : 40;

  const stateLabel = {
    connecting: "Connecting…",
    listening: "Listening",
    thinking: "Thinking…",
    speaking: "Speaking",
    error: "Error",
  }[state];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse 900px 600px at 30% 30%,
            rgba(59, 130, 246, 0.18) 0%,
            rgba(29, 78, 216, 0.10) 35%,
            rgba(10, 22, 40, 0) 70%
          ),
          linear-gradient(180deg, #0A1628 0%, #060D1A 100%)
        `,
      }}
    >
      <style>{`
        @keyframes orb-pulse-speak {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .orb-speaking { animation: orb-pulse-speak 0.9s ease-in-out infinite; }
        .orb-thinking-rotate {
          background: conic-gradient(from 0deg, #3B82F6, #8B5CF6, #3B82F6, #8B5CF6, #3B82F6);
          animation: spin-conic 2.5s linear infinite;
        }
        @keyframes spin-conic {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-white/70">
          <AudioLines className="w-4 h-4" />
          <span className="text-[12.5px] font-medium tracking-wide">Voice mode</span>
        </div>
        <button
          onClick={handleEnd}
          className="text-white/50 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main split: orb left + session right on desktop, stacked on mobile */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 px-4 md:px-6 pb-4 md:pb-6 gap-4 md:gap-6 overflow-hidden">
        {/* Top (mobile) / Left (desktop) — orb / state / controls */}
        <div className="flex flex-col items-center justify-center min-w-0 md:flex-1 py-3 md:py-0">
          {/* Orb */}
          <div className="relative mb-4 md:mb-8">
            {state === "thinking" && (
              <div
                className="absolute inset-0 rounded-full orb-thinking-rotate"
                style={{ filter: "blur(20px)", opacity: 0.5 }}
              />
            )}
            <div
              className={`relative w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full transition-transform duration-100 ease-out ${
                state === "speaking" ? "orb-speaking" : ""
              }`}
              style={{
                transform: `scale(${orbScale})`,
                background: state === "thinking"
                  ? "radial-gradient(circle at 30% 30%, #60A5FA 0%, #2563EB 40%, #1E3A8A 80%, #0A1628 100%)"
                  : state === "speaking"
                  ? "radial-gradient(circle at 30% 30%, #34D399 0%, #10B981 40%, #047857 80%, #064E3B 100%)"
                  : state === "error"
                  ? "radial-gradient(circle at 30% 30%, #F87171 0%, #DC2626 50%, #7F1D1D 90%)"
                  : "radial-gradient(circle at 30% 30%, #93C5FD 0%, #3B82F6 40%, #1E40AF 80%, #0A1628 100%)",
                boxShadow: `0 0 ${orbGlow}px ${state === "speaking" ? "rgba(16, 185, 129, 0.55)" : state === "error" ? "rgba(220, 38, 38, 0.5)" : "rgba(59, 130, 246, 0.55)"}, inset -10px -20px 40px rgba(0,0,0,0.4)`,
              }}
            />
          </div>

          {/* State label */}
          <div className="text-white text-[16px] md:text-[19px] font-medium mb-1 tracking-tight">
            {stateLabel}
          </div>
          <div className="text-white/50 text-[11.5px] md:text-[12.5px] mb-3 md:mb-5 max-w-sm text-center px-4">
            {state === "listening" && "Speak now — I'll respond when you pause, or tap Done."}
            {state === "thinking" && "Searching the manuals and thinking…"}
            {state === "speaking" && "Listening will resume automatically."}
            {state === "connecting" && "Setting up the mic…"}
            {state === "error" && errorMsg}
          </div>

          {/* Mic level indicator + Done button — only while listening */}
          {state === "listening" && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-[3px] h-5">
                {Array.from({ length: 18 }).map((_, i) => {
                  const center = 9;
                  const distance = Math.abs(i - center) / center;
                  const falloff = 1 - distance * 0.6;
                  const h = Math.max(0.18, recorder.audioLevel * falloff * 1.4);
                  return (
                    <div
                      key={i}
                      className="w-[3px] rounded-full bg-white/70"
                      style={{ height: `${Math.min(100, h * 100)}%`, transition: "height 60ms linear" }}
                    />
                  );
                })}
              </div>

              {/* Attached image thumbnail (if any) */}
              {voiceImage && (
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-lg p-1.5 pr-3 backdrop-blur-sm">
                  <img src={voiceImage.dataUrl} className="w-9 h-9 object-cover rounded" alt="" />
                  <span className="text-[11.5px] text-white/80">Image will go with your next message</span>
                  <button
                    onClick={() => setVoiceImage(null)}
                    className="text-white/50 hover:text-white"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white/90 border border-white/15 rounded-full text-[11.5px] font-medium transition-colors backdrop-blur-sm"
                  title="Attach an image to your next message"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {voiceImage ? "Change image" : "Attach image"}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
                <button
                  onClick={handleManualDone}
                  className="px-4 py-1.5 bg-white text-[#0A1628] rounded-full text-[12.5px] font-medium hover:bg-white/90 transition-colors"
                >
                  Done speaking
                </button>
              </div>
            </div>
          )}

          {state === "error" && (
            <button
              onClick={() => setTurn(t => t + 1)}
              className="px-4 py-1.5 bg-white text-[#0A1628] rounded-full text-[13px] font-medium hover:bg-white/90 transition-colors"
            >
              Try again
            </button>
          )}
        </div>

        {/* Right (desktop) / Bottom (mobile) — live session panel */}
        <div className="flex flex-1 md:flex-none md:w-[44%] md:max-w-[520px] flex-col bg-white/95 backdrop-blur rounded-2xl border border-white/10 shadow-2xl shadow-black/20 overflow-hidden min-h-0">
          <div className="px-4 md:px-5 py-2.5 md:py-3 border-b border-[#E5E4DF] flex items-center justify-between flex-shrink-0">
            <div className="text-[12.5px] font-semibold text-[#0A1628]">Live session</div>
            <div className="text-[11px] text-[#64748B]">
              {messages.length === 0 ? "Waiting for first turn" : `${Math.floor(messages.filter(m => m.role === "user").length)} exchange${messages.filter(m => m.role === "user").length === 1 ? "" : "s"}`}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-3 md:px-4 py-3 md:py-4 min-h-0" ref={panelScrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#94A3B8] px-6 py-8">
                <AudioLines className="w-6 h-6 mb-3 opacity-50" />
                <div className="text-[13px]">
                  Start talking — your conversation will appear here in real time, with citations.
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <MessageBubble
                    key={i}
                    msg={m}
                    onCitationClick={(chunk) => onCitationClick && onCitationClick(chunk)}
                    onFollowupClick={() => {}}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-4 md:px-6 py-3 md:py-5 flex items-center justify-center flex-shrink-0">
        <button
          onClick={handleEnd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-full text-[13px] font-medium transition-colors shadow-lg shadow-red-900/30"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          End voice
        </button>
      </div>

      {/* Persistent audio element for TTS playback. Primed with silent audio
          on mount (inside the user-gesture context of opening voice mode) so
          iOS allows subsequent .play() calls outside that gesture window. */}
      <audio ref={audioElRef} preload="auto" style={{ display: "none" }} />
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
  const [sarvamKey, setSarvamKey] = useState(() => readStored("garageos.sarvam_key", ""));
  const [voiceLang, setVoiceLang] = useState(() => readStored("garageos.voice_lang", "unknown"));
  const [ttsEnabled, setTtsEnabled] = useState(() => readStored("garageos.tts_enabled", "false") === "true");

  // True if Sarvam is callable — either the server proxy handles auth, or
  // the user has supplied their own browser-side key.
  const voiceReady = SARVAM_USE_PROXY || !!sarvamKey;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewChunk, setPreviewChunk] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);

  // Used by VoiceMode to log a turn (user msg + assistant msg) into the active conversation
  const addVoiceExchange = useCallback((userMsg, assistantMsg) => {
    setMessages(prev => [...prev, userMsg, assistantMsg]);
  }, [setMessages]);

  // Composer state machine: idle | recording | transcribing | transcript_ready
  const [composerState, setComposerState] = useState("idle");
  const [pendingTranscript, setPendingTranscript] = useState("");
  const [pendingLang, setPendingLang] = useState("");
  const [composerError, setComposerError] = useState("");

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
      const MAX_PDF_SIZE = 15 * 1024 * 1024; // 15 MB
      if (file.size > MAX_PDF_SIZE) {
        setUploadError(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 15 MB.`);
        return;
      }
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
  const ingestImageFile = useCallback(async file => {
    if (!file) return false;
    if (!file.type || !file.type.startsWith("image/")) return false;
    // 5 MB raw cap. We compress to JPEG @ 1568px max, so the actual base64
    // payload sent to Claude stays small (~200-800 KB) regardless of input.
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_IMAGE_SIZE) {
      setComposerError(`Image too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`);
      return false;
    }
    try {
      const compressed = await compressImageForVision(file);
      setPendingImage(compressed);
      return true;
    } catch (e) {
      setComposerError(`Couldn't process image: ${e.message}`);
      return false;
    }
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
    setComposerError("");
    if (!voiceReady) {
      setSettingsOpen(true);
      return;
    }
    try {
      await recorder.start();
      setComposerState("recording");
    } catch (e) {
      console.error(e);
      setComposerError("Microphone access denied. Allow microphone permission in your browser to use voice input.");
    }
  };

  const handleStopRecording = async () => {
    setComposerError("");
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
        setComposerError("No speech detected. Try again and speak clearly.");
        setComposerState("idle");
        return;
      }
      setPendingTranscript(transcript);
      setPendingLang(languageCode);
      setComposerState("transcript_ready");
    } catch (e) {
      console.error(e);
      const msg = String(e.message || e);
      // Friendly messages for common cases
      let friendly = "Transcription failed. Please try again.";
      if (/401|403/.test(msg)) friendly = "Sarvam key is invalid or out of credits. Update it in Settings.";
      else if (/decode/i.test(msg)) friendly = "Could not process recorded audio. Try again.";
      else if (/network|fetch/i.test(msg)) friendly = "Network error reaching Sarvam. Check your connection.";
      setComposerError(friendly);
      setComposerState("idle");
    }
  };

  const handleCancelRecording = () => {
    recorder.cancel();
    setComposerState("idle");
    setPendingTranscript("");
    setPendingLang("");
    setComposerError("");
  };

  const handleSendTranscript = () => {
    const t = pendingTranscript.trim();
    const lang = pendingLang;
    setPendingTranscript("");
    setPendingLang("");
    setComposerState("idle");
    setComposerError("");
    if (t) handleSend(t, { detectedLang: lang });
  };

  /* ----- Main send ----- */
  const handleSend = async (rawText, opts = {}) => {
    const text = (rawText ?? input).trim();
    if (!text && !pendingImage) return;
    const image = pendingImage;
    const detectedLang = opts.detectedLang;

    // Capture conversation history BEFORE appending the new user message,
    // so Claude sees prior turns as context but not its own pending input.
    const history = buildConversationHistory(messages, 3);

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

      // 1. Translate non-English voice transcripts to English first
      if (detectedLang && detectedLang !== "en-IN" && detectedLang !== "unknown" && voiceReady) {
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

      // 2. If we have prior conversation, rewrite the query to be standalone
      //    so retrieval actually works on follow-ups like "next steps".
      //    Skip the LLM call when the question already looks self-contained.
      if (history.length > 0 && shouldRewriteQuery(retrievalQuery)) {
        setThinkingStage("Understanding context...");
        retrievalQuery = await rewriteFollowUpQuery(retrievalQuery, history);
      }

      // 3. If image attached, get a one-line visual symptom description
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
        history,
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

      if (ttsEnabled && voiceReady && !refused) {
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
          // Spell out motorcycle acronyms (TVS, EFI, ECU, …) for natural speech
          toSpeak = expandAcronymsForTts(toSpeak);
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
        background: `
          radial-gradient(ellipse 1100px 520px at 50% -180px,
            rgba(255, 167, 102, 0.22) 0%,
            rgba(248, 200, 158, 0.18) 18%,
            rgba(220, 188, 220, 0.16) 38%,
            rgba(173, 188, 255, 0.20) 58%,
            rgba(255, 255, 255, 0) 82%
          ),
          linear-gradient(180deg, #FBFAF7 0%, #F5F4F1 100%)
        `,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#0A1628",
      }}
    >
      <style>{`
        .font-display { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-feature-settings: 'cv11', 'ss01', 'ss03'; }
        .font-serif   { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-feature-settings: 'cv11', 'ss01', 'ss03'; }
        .font-mono    { font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace; }
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
        onSelectConversation={(id) => { handleSelectConversation(id); setSidebarOpenMobile(false); }}
        onNewConversation={() => { handleNewConversation(); setSidebarOpenMobile(false); }}
        onDeleteConversation={handleDeleteConversation}
        documents={documents}
        onSelectDocument={(doc) => { setPreviewDoc(doc); setSidebarOpenMobile(false); }}
        onUploadManual={handleUploadManual}
        isUploading={isUploading}
        uploadError={uploadError}
        onOpenSettings={() => { setSettingsOpen(true); setSidebarOpenMobile(false); }}
        mobileOpen={sidebarOpenMobile}
        onMobileClose={() => setSidebarOpenMobile(false)}
      />

      {/* Mobile backdrop — clicking it closes the drawer */}
      {sidebarOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpenMobile(false)}
          aria-hidden="true"
        />
      )}

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="px-4 md:px-6 py-3 md:py-3.5 border-b border-[#E5E4DF]/60 bg-white/40 backdrop-blur-sm flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpenMobile(true)}
            className="md:hidden -ml-1 p-1.5 rounded-md text-[#0A1628] hover:bg-[#F1F5F9] transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-[13px] font-medium text-[#0A1628] truncate flex-1 min-w-0">
            {activeConversation.title === "New conversation" ? "New diagnosis" : activeConversation.title}
          </div>
          <div className="hidden sm:flex text-[11.5px] text-[#64748B] items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            <span>{chunks.length} sections indexed</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
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
          className="px-4 md:px-6 pb-4 md:pb-5 pt-3 bg-gradient-to-t from-[#F5F4F1] via-[#F5F4F1]/95 to-transparent"
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="max-w-3xl mx-auto">
            {composerError && (
              <div className="mb-2 flex items-start gap-2 bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3 py-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] mt-0.5 flex-shrink-0" />
                <div className="text-[12.5px] text-[#991B1B] leading-snug flex-1">{composerError}</div>
                <button
                  onClick={() => setComposerError("")}
                  className="text-[#991B1B]/60 hover:text-[#991B1B] flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {pendingImage && composerState === "idle" && (
              <div className="mb-2 inline-flex items-center gap-2 bg-white border border-[#E5E4DF] rounded-lg p-1.5 pr-3">
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
                    className="px-3.5 py-1.5 text-[12.5px] text-[#475569] hover:text-[#0A1628] hover:bg-[#F1F5F9] rounded-full font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStopRecording}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0A1628] hover:bg-[#1E293B] text-white rounded-full text-[12.5px] font-medium transition-colors"
                  >
                    <Square className="w-3 h-3 fill-current" strokeWidth={0} />
                    Stop & transcribe
                  </button>
                </div>
              </div>
            )}

            {composerState === "transcribing" && (
              <div className="bg-white border border-[#E5E4DF] rounded-2xl p-4 shadow-sm">
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
                  className="w-full px-2 py-1 text-[16px] md:text-[14px] bg-transparent focus:outline-none resize-none text-[#0A1628]"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2 px-2 pt-2 border-t border-[#E5E4DF]">
                  <button
                    onClick={handleCancelRecording}
                    className="px-3.5 py-1.5 text-[12.5px] text-[#475569] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-full font-medium transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSendTranscript}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0A1628] hover:bg-[#1E293B] text-white rounded-full text-[12.5px] font-medium transition-colors"
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
                  : "border-[#E5E4DF] focus-within:border-[#2563EB] focus-within:shadow-blue-500/5"
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
                  placeholder={isDraggingOver ? "Drop image to attach" : "Describe the issue..."}
                  disabled={isThinking}
                  rows={1}
                  className="w-full px-4 py-3 bg-transparent text-[16px] md:text-[14.5px] focus:outline-none resize-none placeholder:text-[#94A3B8] disabled:opacity-50"
                  style={{ maxHeight: 140 }}
                />
                <div className="flex items-center justify-between gap-2 px-2 pb-2">
                  <div className="flex items-center gap-0.5 min-w-0">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isThinking}
                      className="p-2.5 md:p-2 text-[#5B6B85] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors disabled:opacity-50"
                      title="Attach image"
                      aria-label="Attach image"
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
                      className="p-2.5 md:p-2 text-[#5B6B85] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-lg transition-colors disabled:opacity-50"
                      title={voiceReady ? "Voice input" : "Voice input (add Sarvam key in Settings)"}
                      aria-label="Voice input"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (!voiceReady) {
                          setSettingsOpen(true);
                          return;
                        }
                        setVoiceModeOpen(true);
                      }}
                      disabled={isThinking}
                      className="px-2.5 py-2 md:py-1.5 ml-1 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[#0A1628] hover:text-white hover:bg-[#0A1628] border border-[#E5E4DF] hover:border-[#0A1628] rounded-full transition-colors disabled:opacity-50"
                      title={voiceReady ? "Voice conversation mode" : "Voice mode (add Sarvam key in Settings)"}
                      aria-label="Voice mode"
                    >
                      <AudioLines className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Voice mode</span>
                    </button>
                    {voiceReady && (
                      <button
                        onClick={() => setSettingsOpen(true)}
                        className="hidden sm:flex items-center gap-1 px-2 ml-1 py-0.5 text-[10.5px] font-mono text-[#64748B] hover:text-[#0A1628] hover:bg-[#F1F5F9] rounded-md transition-colors"
                        title="Change voice language"
                      >
                        <Languages className="w-3 h-3" />
                        <span>{voiceLang === "unknown" ? "auto" : voiceLang}</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={isThinking || (!input.trim() && !pendingImage)}
                    className="px-3 md:px-4 py-2 md:py-1.5 bg-[#0A1628] text-white rounded-full text-[13px] font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
                    aria-label="Send"
                  >
                    {isThinking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">Diagnose</span>
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

      {voiceModeOpen && (
        <VoiceMode
          onClose={() => setVoiceModeOpen(false)}
          index={index}
          sarvamKey={sarvamKey}
          voiceLang={voiceLang}
          addExchange={addVoiceExchange}
          messages={messages}
          onCitationClick={setPreviewChunk}
        />
      )}
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
    <div className="flex flex-col items-center justify-center min-h-[64vh] text-center px-4">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center mb-5 md:mb-6 shadow-lg shadow-blue-500/20">
        <Wrench className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
      </div>
      <div className="font-display text-[28px] sm:text-[36px] md:text-[44px] leading-[1.1] md:leading-[1.05] text-[#0A1628] mb-3 max-w-2xl font-bold tracking-[-0.02em]">
        What's wrong with your bike?
      </div>
      <div className="text-[14px] md:text-[15px] text-[#475569] mb-8 md:mb-10 max-w-md leading-relaxed">
        Ask a question, speak it, or attach a photo. Every answer is grounded in your manual sections with verifiable citations.
      </div>

      <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
        {suggestions.map(s => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="px-3 md:px-4 py-2 text-[12px] md:text-[12.5px] text-[#0A1628] bg-white/80 border border-[#E5E4DF] rounded-full hover:border-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
