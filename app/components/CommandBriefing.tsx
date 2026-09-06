"use client";

import { useState, useEffect, useRef } from "react";
import { Radio, Square } from "lucide-react";

export default function CommandBriefing() {
  const [state, setState] = useState<"idle" | "playing" | "unsupported">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/command-briefing.mp3");
    audio.preload = "metadata";
    audio.onended = () => setState("idle");
    audio.onerror = () => setState("idle");
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  function play() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => setState("idle"));
    setState("playing");
  }

  function stop() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setState("idle");
  }

  if (state === "unsupported") return null;

  const isPlaying = state === "playing";

  return (
    <button
      onClick={isPlaying ? stop : play}
      className="group flex items-center gap-3 px-5 py-2.5 transition-all"
      style={{
        border: `1px solid ${isPlaying ? "rgba(239,68,68,0.5)" : "rgba(77,182,224,0.25)"}`,
        backgroundColor: isPlaying ? "rgba(239,68,68,0.08)" : "rgba(77,182,224,0.05)",
        color: isPlaying ? "#f87171" : "#8892a4",
        borderRadius: "2px",
        fontFamily: "monospace",
      }}
    >
      {/* Pulsing transmission dot */}
      <span
        className="relative flex items-center justify-center shrink-0"
        style={{ width: 10, height: 10 }}
      >
        <span
          className="absolute inline-flex w-full h-full rounded-full"
          style={{
            backgroundColor: isPlaying ? "#f87171" : "#4db6e0",
            opacity: 0.4,
            animation: isPlaying ? "ping 1s cubic-bezier(0,0,0.2,1) infinite" : "none",
          }}
        />
        <span
          className="relative inline-flex rounded-full"
          style={{
            width: 6, height: 6,
            backgroundColor: isPlaying ? "#f87171" : "#4db6e0",
          }}
        />
      </span>

      {isPlaying ? (
        <Square className="w-3 h-3 shrink-0" fill="currentColor" />
      ) : (
        <Radio className="w-3 h-3 shrink-0" />
      )}

      <span className="text-[10px] font-black tracking-[0.2em] uppercase">
        {isPlaying ? "Stop Transmission" : "Command Briefing"}
      </span>

      {isPlaying && (
        <span className="text-[9px] tracking-widest uppercase animate-pulse" style={{ color: "#f87171" }}>
          · LIVE
        </span>
      )}
    </button>
  );
}
