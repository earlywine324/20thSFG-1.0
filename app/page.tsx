import Link from "next/link";
import Image from "next/image";
import {
  Shield, Crosshair, Radio,
  Globe, Zap, BookOpen, ArrowRight, MapPin, Users, TrendingUp,
} from "lucide-react";
import HeroSection from "./components/HeroSection";
import { createClient } from "@/app/lib/supabase/server";

const UNIT_CARDS = [
  { icon: Shield, title: "Ranger Operations", desc: "Direct Action" },
  { icon: Crosshair, title: "Strike & Raid", desc: "Precision Raids" },
  { icon: Globe, title: "Special Recon", desc: "Deep Infiltration" },
  { icon: Radio, title: "Personnel Recovery", desc: "CSAR & EXFIL" },
  { icon: Zap, title: "HALO / HAHO", desc: "Military Freefall" },
];

const CAPABILITIES = [
  { icon: Crosshair, title: "Direct Action", body: "Precision raids against HVTs and key terrain. Fast-rope insertions, CQB, and time-sensitive strike missions." },
  { icon: Globe, title: "Special Reconnaissance", body: "Long-range patrol, OP establishment, and battle damage assessment deep behind enemy lines." },
  { icon: Radio, title: "Personnel Recovery", body: "CSAR and EXFIL of isolated personnel. Rangers don't leave anyone behind." },
  { icon: BookOpen, title: "Airfield Seizure", body: "Rapid seizure of enemy airfields to enable follow-on forces. A hallmark of the 75th Ranger Regiment." },
  { icon: Zap, title: "HALO / HAHO Infiltration", body: "Military freefall enabling covert high-altitude infiltration into denied or austere environments." },
  { icon: Shield, title: "Urban Assault", body: "Close-quarters battle, building clearance, and urban terrain dominance at speed and under fire." },
];

type CompletedOp = {
  id: string;
  title: string;
  type: string;
  event_date: string;
  theatre: string | null;
  element: string | null;
  result: string | null;
  kia: number;
  wia: number;
  summary: string | null;
  op_number: string | null;
};

function formatOpDate(iso: string): string {
  const d = new Date(iso);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${String(d.getUTCDate()).padStart(2,"0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const TYPE_COLOR: Record<string, string> = {
  "FTX / Operation": "text-red-400",
  "Squad Drill":     "text-amber-400",
  "RASP Training":   "text-blue-400",
  "Course / School": "text-green-400",
  "Ceremony":        "text-purple-400",
};

export default async function Home() {
  const supabase = await createClient();

  const [
    { data },
    { count: totalRangers },
    { count: opsCompleted },
    { data: squadRows },
    { count: vacantBillets },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, type, event_date, theatre, element, result, kia, wia, summary, op_number")
      .eq("status", "COMPLETED")
      .order("event_date", { ascending: false })
      .limit(5),
    supabase
      .from("soldiers")
      .select("*", { count: "exact", head: true })
      .eq("status", "ACTIVE DUTY")
      .neq("unit", "RASP Pipeline"),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "COMPLETED"),
    supabase
      .from("soldiers")
      .select("team")
      .eq("status", "ACTIVE DUTY")
      .eq("unit", "Alpha Company, 1/75th RGR")
      .in("team", ["1st Squad", "2nd Squad", "3rd Squad", "Weapons Squad"]),
    supabase
      .from("soldiers")
      .select("*", { count: "exact", head: true })
      .eq("status", "VACANT"),
  ]);

  const recentOps: CompletedOp[] = data || [];
  const activeSquads = new Set((squadRows || []).map((s) => s.team)).size;
  const recruitmentStatus = (vacantBillets ?? 0) > 0 ? "OPEN" : "CLOSED";

  // MilsimUnits ranking
  let milsimRank: { rank: number; totalUnits: number; unitSlug: string } | null = null;
  try {
    const msuRes = await fetch(
      "https://milsimunits.com/api/units/aae531d5-23eb-40b6-a66b-1a8c5f3335c2/embed?rankingType=overall",
      { next: { revalidate: 3600 } },
    );
    if (msuRes.ok) {
      const msuData = await msuRes.json();
      milsimRank = { rank: msuData.rank, totalUnits: msuData.totalUnits, unitSlug: msuData.unitSlug };
    }
  } catch { /* silently degrade */ }
  return (
    <div style={{ backgroundColor: "#07090e", color: "#e8edf5" }}>

      {/* ── HERO ── */}
      <HeroSection />

      {/* ── UNIT CARDS STRIP ── */}
      <section className="relative" style={{ backgroundColor: "#0c0f17", borderBottom: "1px solid #161b27" }}>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{
          backgroundImage: "linear-gradient(#4db6e0 1px, transparent 1px), linear-gradient(90deg, #4db6e0 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />
        <div className="relative max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {UNIT_CARDS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(77,182,224,0.08)", border: "1px solid rgba(77,182,224,0.18)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#4db6e0" }} />
                </div>
                <h3 className="text-xs font-black tracking-widest uppercase" style={{ color: "#e8edf5" }}>{title}</h3>
                <p className="text-[10px] tracking-wider uppercase" style={{ color: "#505870" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE-COLUMN CONTENT GRID ── */}
      <section style={{ backgroundColor: "#07090e" }}>
        {/* Classification strip */}
        <div className="px-6 py-2" style={{ backgroundColor: "rgba(77,182,224,0.04)", borderBottom: "1px solid #161b27" }}>
          <div className="max-w-7xl mx-auto">
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
              OPERATIONAL BRIEFING — FOR PUBLIC DISSEMINATION
            </span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left — Copy Panel */}
            <div className="rounded-lg p-8" style={{ backgroundColor: "#0c0f17", border: "1px solid #161b27" }}>
              <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "#4db6e0", fontFamily: "monospace" }}>
                1ST PLT, A CO, 1/75TH RGR — SITREP
              </p>
              <h2 className="text-2xl font-black mb-3 leading-tight" style={{ color: "#e8edf5" }}>
                Rangers Lead<br />
                <span style={{ color: "#4db6e0" }}>The Way.</span>
              </h2>
              <div className="w-10 h-0.5 mb-5" style={{ backgroundColor: "#4db6e0" }} />
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#8892a4" }}>
                The Outlaws are a Bellum milsim community dedicated to the highest standards of military realism. We model our structure, tactics, and doctrine after the real-world 1st Battalion, 75th Ranger Regiment — one of the most elite light infantry units in the U.S. Army.
              </p>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#8892a4" }}>
                Rangers complete RASP before assignment to a squad. Missions follow complete military doctrine — from intel briefs to after-action reviews.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-2 font-black text-xs tracking-widest uppercase px-6 py-3 rounded"
                style={{ backgroundColor: "#161b27", color: "#e8edf5", border: "1px solid #1e2535" }}>
                Read Our History <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Center — Media Panel */}
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0c0f17", border: "1px solid #161b27" }}>
              <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #161b27" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#4db6e0" }} />
                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#8892a4" }}>Unit Media</span>
              </div>
              <div className="aspect-video">
                <Image
                  src="/hero-bg.jpeg"
                  alt="1/75th RGR Operations"
                  width={640}
                  height={360}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold mb-1" style={{ color: "#e8edf5" }}>Operation Copper Strike</h3>
                <p className="text-xs" style={{ color: "#505870" }}>HALO insertion deep into denied territory. 1st Platoon Outlaws execute a precision strike against high-value targets.</p>
              </div>
            </div>

            {/* Right — Info Box */}
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0c0f17", border: "1px solid #161b27" }}>
              <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid #161b27" }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#4db6e0" }} />
                <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#8892a4" }}>Unit Status</span>
              </div>
              <div className="p-5 space-y-5">
                {[
                  { label: "Active Squads", value: String(activeSquads),          color: "#4ade80" },
                  { label: "Total Rangers", value: String(totalRangers ?? 0),     color: "#e8edf5" },
                  { label: "Ops Completed", value: String(opsCompleted ?? 0),     color: "#e8edf5" },
                  { label: "Recruitment",   value: recruitmentStatus,             color: recruitmentStatus === "OPEN" ? "#4ade80" : "#f87171" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #161b27" }}>
                    <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#505870" }}>{label}</span>
                    <span className="text-sm font-black" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 text-center" style={{ borderTop: "1px solid #161b27", backgroundColor: "rgba(77,182,224,0.04)" }}>
                <Link href="/enlist"
                  className="text-xs font-black tracking-widest uppercase"
                  style={{ color: "#4db6e0" }}>
                  Submit Enlistment Application →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-24 px-6 relative overflow-hidden bg-mc grain"
        style={{ borderTop: "1px solid #161b27", borderBottom: "1px solid #161b27" }}>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(7,9,14,0.58)" }} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-4" style={{ color: "#4db6e0" }}>Core Missions</p>
            <h2 className="text-4xl font-black" style={{ color: "#e8edf5" }}>The Ranger Mission Set</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg p-6"
                style={{ backgroundColor: "rgba(12,15,23,0.85)", border: "1px solid #161b27" }}>
                <div className="w-10 h-10 rounded flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(77,182,224,0.08)", border: "1px solid rgba(77,182,224,0.18)" }}>
                  <Icon className="w-5 h-5" style={{ color: "#4db6e0" }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "#e8edf5" }}>{title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "#8892a4" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPERATIONS LOG ── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#07090e" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-3" style={{ color: "#4db6e0" }}>After-Action Reports</p>
              <h2 className="text-4xl font-black" style={{ color: "#e8edf5" }}>Operational History</h2>
            </div>
            <Link href="/operations" className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#8892a4" }}>
              Full Log →
            </Link>
          </div>

          {recentOps.length === 0 ? (
            <div className="rounded-lg p-10 text-center" style={{ backgroundColor: "#0c0f17", border: "1px dashed #161b27" }}>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#2e3650" }}>
                No completed operations on record yet
              </p>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0c0f17", border: "1px solid #161b27" }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #161b27" }}>
                      {["Op #", "Name", "Type", "Date", "Theatre", "Element", "Result", "Casualties"].map((h) => (
                        <th key={h} className="text-[10px] font-black tracking-widest uppercase text-left px-5 py-3"
                          style={{ color: "#505870" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOps.map((op) => (
                      <tr key={op.id} className="transition-colors hover:bg-[#0b0e15]"
                        style={{ borderBottom: "1px solid #161b27" }}>
                        <td className="px-5 py-4">
                          <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded"
                            style={{ color: "#4db6e0", backgroundColor: "rgba(77,182,224,0.08)" }}>
                            {op.op_number ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs font-bold" style={{ color: "#e8edf5" }}>{op.title}</p>
                          {op.summary && (
                            <p className="text-[10px] mt-0.5 leading-relaxed max-w-xs" style={{ color: "#505870" }}>
                              {op.summary}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] font-bold tracking-wider ${TYPE_COLOR[op.type] ?? "text-[#8892a4]"}`}>
                            {op.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-xs" style={{ color: "#8892a4" }}>
                          {formatOpDate(op.event_date)}
                        </td>
                        <td className="px-5 py-4">
                          {op.theatre ? (
                            <span className="flex items-center gap-1 text-xs" style={{ color: "#8892a4" }}>
                              <MapPin className="w-3 h-3" /> {op.theatre}
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "#2e3650" }}>—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {op.element ? (
                            <span className="flex items-center gap-1 text-xs" style={{ color: "#8892a4" }}>
                              <Users className="w-3 h-3" /> {op.element}
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: "#2e3650" }}>—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-[10px] font-black tracking-wider ${
                            op.result === "SUCCESS"   ? "text-green-400" :
                            op.result === "FAILED"    ? "text-red-400"   :
                            op.result === "COMPLETED" ? "text-green-400" :
                                                        "text-[#505870]"
                          }`}>
                            {op.result ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs">
                          <span className="text-red-400">{op.kia ?? 0} KIA</span>
                          <span className="mx-1" style={{ color: "#2e3650" }}>/</span>
                          <span className="text-amber-400">{op.wia ?? 0} WIA</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 text-right" style={{ borderTop: "1px solid #161b27" }}>
                <Link href="/operations" className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: "#4db6e0" }}>
                  View Full Operational History →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── MILSIMUNITS RANKING ── */}
      {milsimRank && (() => {
        const percentile = Math.round((milsimRank.rank / milsimRank.totalUnits) * 100);
        const profileUrl = `https://milsimunits.com/unit/1-75thrr`;
        return (
          <section className="px-6 py-12" style={{ backgroundColor: "#07090e", borderTop: "1px solid #161b27" }}>
            <div className="max-w-7xl mx-auto">
              <div
                className="rounded-lg overflow-hidden"
                style={{ backgroundColor: "#0c0f17", border: "1px solid #161b27" }}
              >
                {/* Header bar */}
                <div
                  className="px-6 py-3 flex items-center justify-between"
                  style={{ borderBottom: "1px solid #161b27", backgroundColor: "rgba(77,182,224,0.03)" }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: "#4db6e0" }} />
                    <span
                      className="text-[10px] font-black tracking-[0.3em] uppercase"
                      style={{ color: "#505870", fontFamily: "monospace" }}
                    >
                      MilsimUnits.com // Overall Community Ranking
                    </span>
                  </div>
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{ color: "#4db6e0" }}
                  >
                    View Profile →
                  </a>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x" style={{ borderColor: "#161b27" }}>
                  {/* Rank */}
                  <div className="flex flex-col items-center justify-center py-8 gap-1">
                    <span
                      className="text-[10px] font-black tracking-[0.3em] uppercase mb-1"
                      style={{ color: "#505870", fontFamily: "monospace" }}
                    >
                      Unit Rank
                    </span>
                    <span
                      className="text-4xl md:text-5xl font-black leading-none"
                      style={{ color: "#e8edf5" }}
                    >
                      <span style={{ color: "#4db6e0", fontSize: "0.6em" }}>#</span>
                      {milsimRank.rank}
                    </span>
                  </div>

                  {/* Total units */}
                  <div className="flex flex-col items-center justify-center py-8 gap-1">
                    <span
                      className="text-[10px] font-black tracking-[0.3em] uppercase mb-1"
                      style={{ color: "#505870", fontFamily: "monospace" }}
                    >
                      Total Units
                    </span>
                    <span
                      className="text-4xl md:text-5xl font-black leading-none"
                      style={{ color: "#e8edf5" }}
                    >
                      {milsimRank.totalUnits.toLocaleString()}
                    </span>
                  </div>

                  {/* Percentile */}
                  <div className="flex flex-col items-center justify-center py-8 gap-1">
                    <span
                      className="text-[10px] font-black tracking-[0.3em] uppercase mb-1"
                      style={{ color: "#505870", fontFamily: "monospace" }}
                    >
                      Percentile
                    </span>
                    <span
                      className="text-4xl md:text-5xl font-black leading-none"
                      style={{ color: "#4ade80" }}
                    >
                      Top {percentile}%
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="px-6 py-2.5 text-center"
                  style={{ borderTop: "1px solid #161b27" }}
                >
                  <span
                    className="text-[9px] tracking-[0.2em] uppercase"
                    style={{ color: "#2e3650", fontFamily: "monospace" }}
                  >
                    Ranking updates hourly · Powered by MilsimUnits.com
                  </span>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* ── RECRUITMENT CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden bg-black-mc grain"
        style={{ borderTop: "1px solid #161b27" }}>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(7,9,14,0.45)" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Image src="/logo-new.png" alt="1/75th RGR" width={72} height={72} className="opacity-75" />
          </div>
          <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-4" style={{ color: "#4db6e0" }}>Recruitment Open</p>
          <h2 className="text-5xl font-black mb-4 leading-tight" style={{ color: "#e8edf5" }}>
            Think You Have<br /><span style={{ color: "#4db6e0" }}>What It Takes?</span>
          </h2>
          <p className="max-w-xl mx-auto mb-10 leading-relaxed text-sm" style={{ color: "#8892a4" }}>
            No long, drawn-out process. If you have the right mindset, you&apos;ll fit right in.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 text-left">
            {[
              { step: "01", title: "Join the Discord",   body: "Find us through the enlistment page and join the server." },
              { step: "02", title: "Introduce Yourself", body: "Drop an intro in the channel and get familiar with the unit." },
              { step: "03", title: "Short Onboarding",   body: "Go through a quick onboarding — no drawn-out gatekeeping." },
              { step: "04", title: "Get Placed",         body: "Get assigned to a squad in 1st Platoon and start running ops." },
            ].map(({ step, title, body }) => (
              <div key={step} className="rounded-lg p-5 relative overflow-hidden"
                style={{ backgroundColor: "rgba(12,15,23,0.82)", border: "1px solid #161b27" }}>
                <span className="absolute top-2 right-3 font-black" style={{ fontSize: "5rem", color: "rgba(77,182,224,0.05)", lineHeight: 1 }}>{step}</span>
                <h3 className="relative font-bold text-sm mb-2" style={{ color: "#e8edf5" }}>{title}</h3>
                <p className="relative text-xs leading-relaxed" style={{ color: "#8892a4" }}>{body}</p>
              </div>
            ))}
          </div>
          <Link href="/enlist"
            className="inline-flex items-center gap-3 font-black text-sm tracking-widest uppercase px-10 py-4 rounded"
            style={{ backgroundColor: "#111827", color: "#4db6e0", border: "1px solid rgba(77,182,224,0.35)", boxShadow: "0 4px 24px rgba(77,182,224,0.12)" }}>
            Begin Enlistment Process <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-6 px-6 text-center" style={{ backgroundColor: "#07090e", borderTop: "1px solid #161b27" }}>
        <p className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#505870", fontFamily: "monospace" }}>
          © 2026 1st Platoon, Alpha Company, 1/75th Ranger Regiment — Outlaws. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
