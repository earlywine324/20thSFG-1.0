"use client";

import { useState } from "react";
import Link from "next/link";
import { submitApplication, type EnlistResult } from "@/app/lib/actions/enlist";
import { ArrowRight, CheckCircle, ChevronRight, Crosshair } from "lucide-react";
import type { OpenBillet } from "@/app/enlist/EnlistClientPage";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const SECTIONS = [
  { id: "personnel", label: "01 — Personnel Information" },
  { id: "experience", label: "02 — Experience & Preference" },
  { id: "availability", label: "03 — Availability" },
  { id: "statement", label: "04 — Statement of Intent" },
];

const inputCls =
  "w-full px-4 py-3 rounded text-sm outline-none focus:border-[#4db6e0] transition-colors placeholder:text-[#2e3650]";

const inputStyle = {
  backgroundColor: "#0b0e15",
  border: "1px solid #1a2035",
  color: "#e8edf5",
};

export default function EnlistForm({ openBillets }: { openBillets: OpenBillet[] }) {
  const [result, setResult] = useState<EnlistResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBilletId, setSelectedBilletId] = useState<string>("");

  // Group billets by squad
  const billetsBySquad = openBillets.reduce<Record<string, OpenBillet[]>>((acc, b) => {
    (acc[b.team] ??= []).push(b);
    return acc;
  }, {});

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    const res = await submitApplication(formData);
    setResult(res);
    setSubmitting(false);
  }

  if (result?.success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 py-20"
        style={{ backgroundColor: "#07090e" }}
      >
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: "#4ade80" }} />
          </div>
          <p
            className="text-[9px] font-black tracking-[0.3em] uppercase mb-3"
            style={{ color: "#4ade80", fontFamily: "monospace" }}
          >
            TRANSMISSION RECEIVED
          </p>
          <h2
            className="text-2xl font-black tracking-widest uppercase mb-4"
            style={{ color: "#e8edf5", fontFamily: "monospace" }}
          >
            Application Submitted
          </h2>
          <p className="text-sm mb-2" style={{ color: "#8892a4" }}>
            {result.success}
          </p>
          <p
            className="text-xs mt-6"
            style={{ color: "#505870", fontFamily: "monospace" }}
          >
            RESPONSE TIME: 48–72 HOURS VIA DISCORD
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="text-[10px] font-black tracking-widest uppercase"
              style={{ color: "#4db6e0" }}
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#07090e" }}>

      {/* Form header */}
      <div
        className="py-12 px-6 text-center"
        style={{ borderBottom: "1px solid #161b27", backgroundColor: "#0b0e15" }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded mb-5"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", border: "1px solid #161b27" }}
        >
          <span
            className="text-[9px] font-black tracking-[0.25em] uppercase"
            style={{ color: "#505870", fontFamily: "monospace" }}
          >
            ACCESSION FORM // STAGE 1 OF 1
          </span>
        </div>
        <h2
          className="text-3xl font-black tracking-tight mb-2"
          style={{ color: "#e8edf5" }}
        >
          Enlistment Application
        </h2>
        <p className="text-sm" style={{ color: "#8892a4" }}>
          Complete all required fields. Incomplete applications will not be considered.
        </p>
        {/* Section index */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6">
          {SECTIONS.map((s) => (
            <span
              key={s.id}
              className="text-[9px] font-black tracking-[0.15em] uppercase"
              style={{ color: "#2e3650", fontFamily: "monospace" }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <form action={handleSubmit} className="max-w-3xl mx-auto px-6 py-14 space-y-14">

        {/* ── 01 PERSONNEL ── */}
        <fieldset>
          <legend className="w-full mb-6">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #161b27" }}>
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded"
                style={{
                  color: "#4db6e0",
                  backgroundColor: "rgba(77,182,224,0.08)",
                  border: "1px solid rgba(77,182,224,0.2)",
                  fontFamily: "monospace",
                }}
              >
                01
              </span>
              <span
                className="text-[10px] font-black tracking-[0.25em] uppercase"
                style={{ color: "#8892a4" }}
              >
                Personnel Information
              </span>
            </div>
          </legend>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Callsign / Handle <span style={{ color: "#4db6e0" }}>*</span>
              </label>
              <input
                type="text"
                name="callsign"
                required
                className={inputCls}
                style={inputStyle}
                placeholder="e.g. D.Anderson"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Age <span style={{ color: "#4db6e0" }}>*</span>
              </label>
              <input
                type="number"
                name="age"
                required
                min={16}
                max={99}
                className={inputCls}
                style={inputStyle}
                placeholder="18"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Discord Username <span style={{ color: "#4db6e0" }}>*</span>
              </label>
              <input
                type="text"
                name="discord"
                required
                className={inputCls}
                style={inputStyle}
                placeholder="username or user#0000"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Timezone <span style={{ color: "#4db6e0" }}>*</span>
              </label>
              <select
                name="timezone"
                required
                className={inputCls}
                style={inputStyle}
              >
                <option value="">Select timezone</option>
                <option value="EST">Eastern (EST/EDT)</option>
                <option value="CST">Central (CST/CDT)</option>
                <option value="MST">Mountain (MST/MDT)</option>
                <option value="PST">Pacific (PST/PDT)</option>
                <option value="EUROPE">Europe</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </fieldset>

        {/* ── 02 EXPERIENCE ── */}
        <fieldset>
          <legend className="w-full mb-6">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #161b27" }}>
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded"
                style={{
                  color: "#4db6e0",
                  backgroundColor: "rgba(77,182,224,0.08)",
                  border: "1px solid rgba(77,182,224,0.2)",
                  fontFamily: "monospace",
                }}
              >
                02
              </span>
              <span
                className="text-[10px] font-black tracking-[0.25em] uppercase"
                style={{ color: "#8892a4" }}
              >
                Experience &amp; Preference
              </span>
            </div>
          </legend>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Arma / Milsim Hours <span style={{ color: "#4db6e0" }}>*</span>
              </label>
              <select name="armaHours" required className={inputCls} style={inputStyle}>
                <option value="">Select range</option>
                <option value="0-100">0 – 100 hours</option>
                <option value="100-500">100 – 500 hours</option>
                <option value="500-1000">500 – 1,000 hours</option>
                <option value="1000+">1,000+ hours</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Prior Milsim Units
              </label>
              <input
                type="text"
                name="priorUnits"
                className={inputCls}
                style={inputStyle}
                placeholder="List any previous units (optional)"
              />
            </div>
          </div>

          {/* ── Open Position Selector ── */}
          <div className="mt-5">
            <label className="block text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: "#505870" }}>
              Requested Position <span style={{ color: "#4db6e0" }}>*</span>
            </label>
            <p className="text-[10px] mb-3" style={{ color: "#2e3650" }}>
              Select an open billet. Only positions currently vacant are shown. Leadership roles are filled internally.
            </p>

            {openBillets.length === 0 ? (
              <div className="rounded p-4 text-center" style={{ backgroundColor: "#0b0e15", border: "1px solid #1a2035" }}>
                <Crosshair className="w-5 h-5 mx-auto mb-2" style={{ color: "#2e3650" }} />
                <p className="text-xs font-bold" style={{ color: "#505870" }}>No open entry-level positions at this time.</p>
                <p className="text-[10px] mt-1" style={{ color: "#2e3650" }}>Check back later or reach out on Discord.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(billetsBySquad).map(([squad, billets]) => (
                  <div key={squad}>
                    <p className="text-[9px] font-black tracking-[.18em] uppercase mb-1.5" style={{ color: "#4db6e0" }}>
                      {squad}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {billets.map(b => {
                        const active = selectedBilletId === b.id;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBilletId(active ? "" : b.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-all"
                            style={{
                              background: active ? "rgba(77,182,224,.12)" : "#0b0e15",
                              border: `1px solid ${active ? "rgba(77,182,224,.35)" : "#1a2035"}`,
                              color: active ? "#4db6e0" : "#505870",
                            }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: active ? "#4db6e0" : "#2e3650" }}
                            />
                            {b.role}
                            {b.mos && b.mos !== "N/A" && (
                              <span className="text-[9px] font-mono" style={{ color: active ? "#4db6e0" : "#2e3650" }}>
                                · {b.mos}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden fields carrying the selection */}
            <input type="hidden" name="billetId" value={selectedBilletId} />
            <input
              type="hidden"
              name="mosPreference"
              value={openBillets.find(b => b.id === selectedBilletId)?.mos ?? "any"}
            />
          </div>
        </fieldset>

        {/* ── 03 AVAILABILITY ── */}
        <fieldset>
          <legend className="w-full mb-6">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #161b27" }}>
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded"
                style={{
                  color: "#4db6e0",
                  backgroundColor: "rgba(77,182,224,0.08)",
                  border: "1px solid rgba(77,182,224,0.2)",
                  fontFamily: "monospace",
                }}
              >
                03
              </span>
              <span
                className="text-[10px] font-black tracking-[0.25em] uppercase"
                style={{ color: "#8892a4" }}
              >
                Availability
              </span>
            </div>
          </legend>
          <p className="text-xs mb-4" style={{ color: "#505870" }}>
            Select all days you are generally available for operations and training.
          </p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <label
                key={day}
                className="flex items-center gap-2 px-4 py-2.5 rounded cursor-pointer text-xs font-bold tracking-wider uppercase select-none transition-colors"
                style={{
                  backgroundColor: "#0b0e15",
                  border: "1px solid #1a2035",
                  color: "#505870",
                }}
              >
                <input
                  type="checkbox"
                  name="availability"
                  value={day}
                  className="accent-[#4db6e0]"
                />
                {day}
              </label>
            ))}
          </div>
        </fieldset>

        {/* ── 04 STATEMENT ── */}
        <fieldset>
          <legend className="w-full mb-6">
            <div className="flex items-center gap-3 pb-3" style={{ borderBottom: "1px solid #161b27" }}>
              <span
                className="text-[9px] font-black tracking-[0.25em] uppercase px-2 py-0.5 rounded"
                style={{
                  color: "#4db6e0",
                  backgroundColor: "rgba(77,182,224,0.08)",
                  border: "1px solid rgba(77,182,224,0.2)",
                  fontFamily: "monospace",
                }}
              >
                04
              </span>
              <span
                className="text-[10px] font-black tracking-[0.25em] uppercase"
                style={{ color: "#8892a4" }}
              >
                Statement of Intent
              </span>
            </div>
          </legend>
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Why do you want to join the LIONHEART Program? <span style={{ color: "#4db6e0" }}>*</span>
              </label>
              <textarea
                name="motivation"
                required
                rows={5}
                className={`${inputCls} resize-none leading-relaxed`}
                style={inputStyle}
                placeholder="Tell us about yourself, your goals, and what draws you to this unit. Minimum 2–3 sentences."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#505870" }}>
                Referred By
              </label>
              <input
                type="text"
                name="referredBy"
                className={inputCls}
                style={inputStyle}
                placeholder="Name of member who referred you (optional)"
              />
            </div>
          </div>
        </fieldset>

        {/* Acknowledgement */}
        <div
          className="rounded-lg p-5"
          style={{ backgroundColor: "#0b0e15", border: "1px solid #1a2035" }}
        >
          <div className="flex items-start gap-3 mb-4">
            <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#4db6e0" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#505870" }}>
              By submitting this application you acknowledge that entry is selective, that you
              will be required to complete screening and onboarding before receiving an operational assignment, and that you agree to
              operate under the unit&#39;s chain of command and standards of conduct.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#4db6e0" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#505870" }}>
              Submission does not guarantee acceptance. A recruiter will contact you via Discord
              within 48–72 hours.
            </p>
          </div>
        </div>

        {/* Error banner */}
        {result?.error && (
          <div
            className="p-4 rounded"
            style={{
              backgroundColor: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p
              className="text-xs font-black tracking-widest uppercase"
              style={{ color: "#f87171", fontFamily: "monospace" }}
            >
              ERROR: {result.error}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-3 font-black text-xs tracking-[0.2em] uppercase px-10 py-4 transition-all disabled:opacity-50"
            style={{ backgroundColor: "#e8edf5", color: "#07090e" }}
          >
            {submitting ? "TRANSMITTING..." : "Submit Application"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <p
            className="text-[9px] tracking-wider uppercase"
            style={{ color: "#2e3650", fontFamily: "monospace" }}
          >
            ENTRY IS A PRIVILEGE, NOT A GUARANTEE
          </p>
        </div>

      </form>
    </div>
  );
}
