"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type StatusVal = "LOADING" | "PENDING" | "NEGOTIATING" | "ACTIVE" | "VERIFIED" | "SECURED" | "BYPASSED";
type StatusRow = { key: string; label: string; initial: StatusVal; final: StatusVal; delay: number };

const STATUS_ROWS: StatusRow[] = [
  { key: "node",      label: "NODE",      initial: "LOADING",     final: "ACTIVE",   delay: 800  },
  { key: "policy",    label: "POLICY",    initial: "LOADING",     final: "ACTIVE",   delay: 1400 },
  { key: "integrity", label: "INTEGRITY", initial: "PENDING",     final: "VERIFIED", delay: 2000 },
  { key: "channel",   label: "CHANNEL",   initial: "NEGOTIATING", final: "SECURED",  delay: 2700 },
  { key: "auth",      label: "AUTH",      initial: "PENDING",     final: "BYPASSED", delay: 3100 },
];

const STATUS_COLOR: Record<StatusVal, string> = {
  LOADING: "#c9a128", PENDING: "#c9a128", NEGOTIATING: "#c9a128",
  ACTIVE: "#4ade80",  VERIFIED: "#4ade80", SECURED: "#4ade80",
  BYPASSED: "#4db6e0",
};

const TOTAL_ANIM = 3700;

/* ════════════════════════════════════════════
   AUDIO ENGINE — Military / Classified Terminal
════════════════════════════════════════════ */

function mkCtx(): AudioContext | null {
  try {
    return new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch { return null; }
}

/**
 * Deep power-on rumble. Simulates a heavy system coming online —
 * server room, secure terminal, hardened facility generator.
 * Returns a stop function.
 */
function startPowerRumble(ctx: AudioContext): () => void {
  const t = ctx.currentTime;

  // Sub-bass fundamental
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(38, t);
  osc1.frequency.linearRampToValueAtTime(42, t + 3.5);

  // Harmonic layer for weight
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(76, t);
  osc2.frequency.linearRampToValueAtTime(84, t + 3.5);

  // Very slow LFO tremolo — gives a mechanical "breathing" texture
  const lfo  = ctx.createOscillator();
  const lfoG = ctx.createGain();
  lfo.type             = "sine";
  lfo.frequency.value  = 0.18;
  lfoG.gain.value      = 0.012;
  lfo.connect(lfoG);

  const mix = ctx.createGain();
  mix.gain.setValueAtTime(0.0001, t);
  mix.gain.linearRampToValueAtTime(0.18, t + 1.8); // slow power-up
  lfoG.connect(mix.gain);

  osc1.connect(mix);
  osc2.connect(mix);
  mix.connect(ctx.destination);
  osc1.start(t); osc2.start(t); lfo.start(t);

  return () => {
    const now = ctx.currentTime;
    mix.gain.setValueAtTime(mix.gain.value, now);
    mix.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    setTimeout(() => { try { osc1.stop(); osc2.stop(); lfo.stop(); } catch { /* ignore */ } }, 1400);
  };
}

/**
 * Single high-frequency digital noise burst on start — like a
 * secure line handshake initiating. Brief and clinical.
 */
function playInitStatic(ctx: AudioContext) {
  const t      = ctx.currentTime;
  const bufLen = Math.floor(ctx.sampleRate * 0.18);
  const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const d      = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 4000;

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

  src.connect(hp); hp.connect(g); g.connect(ctx.destination);
  src.start(t); src.stop(t + 0.2);
}

/**
 * Status confirmation — single clean military-grade beep.
 * Precise, flat, no melody. Like a relay closing on a secure terminal.
 */
function playConfirmBeep(ctx: AudioContext, freq = 1000) {
  const t   = ctx.currentTime;
  const dur = 0.09;

  // Tiny click transient first (relay sound)
  const click = ctx.createOscillator();
  const cg    = ctx.createGain();
  click.type  = "square";
  click.frequency.value = 1800;
  cg.gain.setValueAtTime(0.08, t);
  cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
  click.connect(cg); cg.connect(ctx.destination);
  click.start(t); click.stop(t + 0.015);

  // Clean sine confirmation
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type   = "sine";
  osc.frequency.setValueAtTime(freq, t + 0.008);
  gain.gain.setValueAtTime(0.0001, t + 0.008);
  gain.gain.linearRampToValueAtTime(0.16, t + 0.018);
  gain.gain.setValueAtTime(0.16, t + 0.008 + dur * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.008 + dur);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(t + 0.008); osc.stop(t + 0.008 + dur + 0.01);
}

/**
 * Slow radar sweep pulse — plays every interval during loading.
 * Very low, subliminal. Gives a sense of active scanning/monitoring.
 */
function playRadarPulse(ctx: AudioContext) {
  const t   = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type  = "sine";
  osc.frequency.setValueAtTime(55, t);
  osc.frequency.exponentialRampToValueAtTime(48, t + 0.18);
  g.gain.setValueAtTime(0.10, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  osc.connect(g); g.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.25);
}

/**
 * ACCESS GRANTED — two-stage confirmation.
 * Stage 1: deep bass hit (authoritative, physical)
 * Stage 2: clean high tone (system confirmation)
 * Feels like a vault door unlocking.
 */
function playAccessGranted(ctx: AudioContext) {
  const t = ctx.currentTime;

  // Stage 1 — deep bass hit
  const sub  = ctx.createOscillator();
  const subG = ctx.createGain();
  sub.type   = "sine";
  sub.frequency.setValueAtTime(60, t);
  sub.frequency.exponentialRampToValueAtTime(35, t + 0.35);
  subG.gain.setValueAtTime(0.0001, t);
  subG.gain.linearRampToValueAtTime(0.55, t + 0.018);
  subG.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
  sub.connect(subG); subG.connect(ctx.destination);
  sub.start(t); sub.stop(t + 0.4);

  // Distortion layer on the hit — gives it punch
  const dist  = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = (Math.PI + 80) * x / (Math.PI + 80 * Math.abs(x));
  }
  dist.curve = curve;

  const sub2  = ctx.createOscillator();
  const sub2G = ctx.createGain();
  sub2.type   = "sawtooth";
  sub2.frequency.setValueAtTime(60, t);
  sub2G.gain.setValueAtTime(0.0001, t);
  sub2G.gain.linearRampToValueAtTime(0.04, t + 0.015);
  sub2G.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
  sub2.connect(sub2G); sub2G.connect(dist); dist.connect(ctx.destination);
  sub2.start(t); sub2.stop(t + 0.28);

  // Stage 2 — system confirmation tone (after brief pause)
  const delay = 0.32;
  const osc   = ctx.createOscillator();
  const oscG  = ctx.createGain();
  osc.type    = "sine";
  osc.frequency.setValueAtTime(1047, t + delay);    // C6 — authoritative, not musical
  oscG.gain.setValueAtTime(0.0001, t + delay);
  oscG.gain.linearRampToValueAtTime(0.20, t + delay + 0.02);
  oscG.gain.setValueAtTime(0.20, t + delay + 0.14);
  oscG.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.32);
  osc.connect(oscG); oscG.connect(ctx.destination);
  osc.start(t + delay); osc.stop(t + delay + 0.36);
}

/* ════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════ */

export default function TerminalGate({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress]     = useState(0);
  const [statuses, setStatuses]     = useState<Record<string, StatusVal>>(
    Object.fromEntries(STATUS_ROWS.map((r) => [r.key, r.initial])) as Record<string, StatusVal>,
  );
  const [done, setDone]             = useState(false);
  const [phase, setPhase]           = useState<"INITIALIZING" | "HANDSHAKE" | "COMPLETE">("INITIALIZING");
  const [audioArmed, setAudioArmed] = useState(false);

  const rafRef       = useRef<number | null>(null);
  const startRef     = useRef<number | null>(null);
  const completedRef = useRef(false);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const droneStopRef = useRef<(() => void) | null>(null);
  const radarRef     = useRef<NodeJS.Timeout | null>(null);
  const armedRef     = useRef(false);

  // Each status row uses the same clean 1kHz beep — uniform, military
  const BEEP_FREQ = 1000;

  const armAudio = useCallback(() => {
    if (armedRef.current) return;
    armedRef.current = true;
    const ctx = mkCtx();
    if (!ctx) return;
    audioCtxRef.current = ctx;
    setAudioArmed(true);

    // Power-on sequence
    playInitStatic(ctx);
    droneStopRef.current = startPowerRumble(ctx);

    // Confirmation beep on each status flip
    STATUS_ROWS.forEach((row) => {
      setTimeout(() => {
        if (audioCtxRef.current) playConfirmBeep(audioCtxRef.current, BEEP_FREQ);
      }, row.delay);
    });

    // Slow radar pulse every 700ms during loading
    radarRef.current = setInterval(() => {
      if (audioCtxRef.current) playRadarPulse(audioCtxRef.current);
    }, 700);

    // Access granted at completion
    setTimeout(() => {
      if (radarRef.current) clearInterval(radarRef.current);
      if (audioCtxRef.current) playAccessGranted(audioCtxRef.current);
      // Stop rumble after granted sound finishes
      setTimeout(() => droneStopRef.current?.(), 600);
    }, TOTAL_ANIM - 150);
  }, []);

  // Try auto-arm on mount
  useEffect(() => {
    const t = setTimeout(armAudio, 80);
    return () => clearTimeout(t);
  }, [armAudio]);

  // Visual animation loop
  useEffect(() => {
    STATUS_ROWS.forEach((row) => {
      setTimeout(() => setStatuses((prev) => ({ ...prev, [row.key]: row.final })), row.delay);
    });

    setTimeout(() => setPhase("HANDSHAKE"), 600);
    setTimeout(() => setPhase("COMPLETE"), TOTAL_ANIM - 200);

    function tick(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const pct = Math.min(100, Math.round((elapsed / TOTAL_ANIM) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        if (radarRef.current) clearInterval(radarRef.current);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 600);
        }, 400);
      }
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (radarRef.current) clearInterval(radarRef.current);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-700 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#07090e" }}
      onClick={armAudio}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
      }} />
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 20%, rgba(0,0,0,0.7) 100%)",
      }} />

      <div className="relative w-full max-w-xl px-6">

        {/* Classification bar */}
        <div className="flex items-center justify-between px-4 py-1.5 mb-8 rounded" style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          border: "1px solid rgba(77,182,224,0.15)",
        }}>
          <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "#4db6e0", fontFamily: "monospace" }}>
            UNCLASSIFIED // PUBLIC RELEASE
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
            ACCESSION NODE
          </span>
        </div>

        {/* Title block */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.3em] uppercase mb-2" style={{
            color: audioArmed ? "#4ade80" : "#505870",
            fontFamily: "monospace",
            transition: "color 0.4s",
          }}>
            AUDIO: {audioArmed ? "ARMED" : "ARM"}
          </p>
          <h1 className="text-lg font-black tracking-widest uppercase leading-snug" style={{ color: "#e8edf5", fontFamily: "monospace" }}>
            INITIALIZING LIONHEART<br />
            <span style={{ color: "#4db6e0" }}>ENLISTMENT INTERFACE</span>
          </h1>
          <p className="text-xs mt-2 leading-relaxed" style={{ color: "#505870", fontFamily: "monospace" }}>
            Establishing secure session, validating policy,<br />
            and staging accession workflow
          </p>
        </div>

        {/* Status grid */}
        <div className="rounded-lg p-5 mb-5" style={{ backgroundColor: "rgba(0,0,0,0.4)", border: "1px solid #161b27" }}>
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid #161b27" }}>
            <span className="text-[9px] font-black tracking-[0.25em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
              SESSION STATE
            </span>
            <span className="text-[9px] font-black tracking-[0.2em] uppercase animate-pulse" style={{ color: "#c9a128", fontFamily: "monospace" }}>
              {phase === "COMPLETE" ? "ACTIVE" : "INITIALIZING"}
            </span>
          </div>
          <div className="space-y-3">
            {STATUS_ROWS.map((row) => {
              const val     = statuses[row.key];
              const isFinal = val === row.final;
              return (
                <div key={row.key} className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase" style={{ color: "#8892a4", fontFamily: "monospace" }}>
                    {row.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isFinal ? "" : "animate-pulse"}`}
                      style={{ backgroundColor: STATUS_COLOR[val] }}
                    />
                    <span className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: STATUS_COLOR[val], fontFamily: "monospace" }}>
                      {val}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="rounded-full h-1 overflow-hidden mb-2" style={{ backgroundColor: "#161b27" }}>
            <div className="h-full rounded-full transition-none" style={{
              width: `${progress}%`,
              backgroundColor: progress === 100 ? "#4ade80" : "#4db6e0",
            }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
              PHASE: HANDSHAKE {progress}%
            </span>
            <span className="text-[9px] tracking-wider uppercase" style={{ color: "#2e3650", fontFamily: "monospace" }}>
              DO NOT REFRESH&nbsp;&nbsp;AUDIT: ENABLED
            </span>
          </div>
        </div>

        {/* Node ID */}
        <div className="mt-4 text-center">
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "#2e3650", fontFamily: "monospace" }}>
            NODE&nbsp;&nbsp;ISMG-LH01&nbsp;&nbsp;·&nbsp;&nbsp;LIONHEART · ARMA
          </span>
        </div>
      </div>
    </div>
  );
}
