"use client";

import { useState, useCallback, useRef } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import TerminalGate from "./components/TerminalGate";
import EnlistForm from "./components/EnlistForm";

export type OpenBillet = {
  id: string;
  role: string;
  mos: string;
  mosTitle: string;
  team: string;
};

const REQUIREMENTS = [
  { label: "Minimum Age",           value: "16 years or older" },
  { label: "Primary Platform",      value: "Arma" },
  { label: "Commitment",            value: "Primary ops Saturdays, mandatory attendance" },
  { label: "Communication",         value: "Discord required — active participation expected" },
  { label: "Conduct",               value: "Maturity, discipline, and team-first mentality" },
  { label: "Training Pipeline",     value: "Short onboarding process — Discord intro, brief orientation, squad placement" },
];

export default function EnlistClientPage({ openBillets }: { openBillets: OpenBillet[] }) {
  const [gateComplete, setGateComplete] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleGateComplete = useCallback(() => {
    setGateComplete(true);
  }, []);

  function handleBeginApplication() {
    setFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#07090e", color: "#e8edf5" }}
    >
      {/* Terminal gate overlay */}
      {!gateComplete && <TerminalGate onComplete={handleGateComplete} />}

      {/* Main content fades in after gate */}
      <div
        className={`transition-opacity duration-700 ${
          gateComplete ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >

        {/* ── GATE LANDING ── */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
          style={{ borderBottom: "1px solid #161b27" }}
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#4db6e0 1px, transparent 1px), linear-gradient(90deg, #4db6e0 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              opacity: 0.025,
            }}
          />
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            }}
          />
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          <div className="relative w-full max-w-2xl mx-auto text-center">

            {/* Classification bar */}
            <div
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded mb-10"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(77,182,224,0.15)",
              }}
            >
              <span
                className="text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "#4db6e0", fontFamily: "monospace" }}
              >
                UNCLASSIFIED // PUBLIC RELEASE
              </span>
              <span className="w-px h-3" style={{ backgroundColor: "rgba(77,182,224,0.2)" }} />
              <span
                className="text-[9px] tracking-[0.2em] uppercase"
                style={{ color: "#505870", fontFamily: "monospace" }}
              >
                RECRUITMENT CELL OVERSIGHT
              </span>
            </div>

            {/* Overline */}
            <p
              className="text-[10px] font-black tracking-[0.4em] uppercase mb-4"
              style={{ color: "#4db6e0", fontFamily: "monospace" }}
            >
              Interagency Special Missions Group
            </p>

            {/* Title */}
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6"
              style={{ color: "#e8edf5" }}
            >
              Enlistment Portal
            </h1>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-px" style={{ backgroundColor: "#161b27" }} />
              <span
                className="text-[9px] tracking-[0.3em] uppercase"
                style={{ color: "#505870", fontFamily: "monospace" }}
              >
                LIONHEART · ARMA
              </span>
              <div className="w-16 h-px" style={{ backgroundColor: "#161b27" }} />
            </div>

            {/* Unit description */}
            <p
              className="text-sm leading-relaxed mb-3 mx-auto max-w-lg"
              style={{ color: "#8892a4" }}
            >
              We are an Arma realism unit built around the fictional ISMG LIONHEART Program.
              We use authentic roles, teamwork, and mission planning while keeping the community
              welcoming and enjoyable. Members also play other games together.
            </p>
            <p
              className="text-sm leading-relaxed mb-10 mx-auto max-w-lg"
              style={{ color: "#8892a4" }}
            >
              Veteran-founded. Balanced realism. No ego, no fake &ldquo;operator&rdquo; culture.
              You don&apos;t need to be cracked — you just need the right mindset and a willingness
              to work as a team.
            </p>

            {/* Requirements grid */}
            <div
              className="rounded-lg p-6 mb-10 text-left"
              style={{
                backgroundColor: "rgba(0,0,0,0.35)",
                border: "1px solid #161b27",
              }}
            >
              <p
                className="text-[9px] font-black tracking-[0.3em] uppercase mb-4"
                style={{ color: "#505870", fontFamily: "monospace" }}
              >
                MINIMUM REQUIREMENTS // ACCESSION STANDARDS
              </p>
              <div className="space-y-3">
                {REQUIREMENTS.map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <ChevronRight
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: "#4db6e0" }}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
                      <span
                        className="text-[10px] font-black tracking-[0.15em] uppercase shrink-0"
                        style={{ color: "#8892a4", fontFamily: "monospace", minWidth: "160px" }}
                      >
                        {label}
                      </span>
                      <span className="text-xs" style={{ color: "#505870" }}>
                        {value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleBeginApplication}
                className="flex items-center gap-2 font-black text-xs tracking-[0.2em] uppercase px-10 py-4 transition-all"
                style={{
                  backgroundColor: "#e8edf5",
                  color: "#07090e",
                }}
              >
                Begin Initial Application
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="https://discord.gg/NDuQrF7S"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-black text-xs tracking-[0.2em] uppercase px-8 py-4 transition-all"
                style={{
                  border: "1px solid rgba(88,101,242,0.4)",
                  color: "#e0e2ff",
                  backgroundColor: "rgba(88,101,242,0.08)",
                }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.014.044.03.057a19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Join Discord
              </a>
            </div>

            {/* Footer tag */}
            <p
              className="text-[9px] tracking-[0.3em] uppercase mt-10"
              style={{ color: "#2e3650", fontFamily: "monospace" }}
            >
              ISMG, LIONHEART PROGRAM — CANDIDATE SCREENING
              <br />
              <span style={{ color: "#1e2535" }}>
                ENTRY IS A PRIVILEGE, NOT A GUARANTEE
              </span>
            </p>
          </div>
        </section>

        {/* ── APPLICATION FORM (reveals on click) ── */}
        {formOpen && (
          <div
            ref={formRef}
            className="animate-fade-in"
            style={{ scrollMarginTop: "4rem" }}
          >
            <EnlistForm openBillets={openBillets} />
          </div>
        )}

      </div>
    </div>
  );
}
