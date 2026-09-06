"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Shield, Users, MessageSquare, Star, ChevronDown } from "lucide-react";

// ── DATA ────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    icon: Users,
    title: "Brotherhood",
    body: "The squad is a family. We support each other, train together, and grow together. No ego, no fake 'operator' culture — just the guys getting the job done.",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    body: "Clear comms win fights. We emphasize coordinated communication during ops and keep it simple and direct — both in-game and out.",
  },
  {
    icon: Shield,
    title: "Balanced Realism",
    body: "We use realistic structure, basic tactics, and chain of command during operations. We don't do over-the-top roleplay or 'yes sir/no sir 24/7' culture.",
  },
  {
    icon: Star,
    title: "Veteran-Founded",
    body: "This unit is veteran-founded. That shows in how we operate — focus on team cohesion, respect for structure, and emphasis on clear communication without ego.",
  },
];

const FAQS = [
  {
    q: "What is this unit?",
    a: "We are a Bellum milsim unit inspired by 1st Platoon, Alpha Company, 1/75 Ranger Regiment. While we are not a strict realism unit, we aim to replicate the structure, teamwork, and professionalism of a Ranger platoon in a gaming environment.",
  },
  {
    q: "How serious is the unit?",
    a: "We take the game moderately seriously. That means we value teamwork, communication, and coordination — we run organized ops and missions and maintain discipline during gameplay. But we're not overly strict, we understand it's still a game, and we prioritize having a good time with the boys.",
  },
  {
    q: "Are you a realism (milsim) unit?",
    a: "Yes — but in a balanced way. We use realistic structure (platoons, squads, fireteams), basic tactics and communication, and chain of command during operations. We avoid over-the-top roleplay, unnecessary strictness, and a 'yes sir/no sir 24/7' culture.",
  },
  {
    q: "Are you veteran-owned or operated?",
    a: "Yes. This unit is veteran-founded, and that influence shows in how we operate: focus on team cohesion, emphasis on clear communication, and respect for structure without ego. That said, you do NOT need military experience to join.",
  },
  {
    q: "What kind of players are you looking for?",
    a: "We're looking for people who can work in a team, stay composed during ops, want a structured but relaxed environment, and are willing to learn and improve. You don't need to be cracked — you just need the right mindset.",
  },
  {
    q: "What roles are available?",
    a: "Typical roles include Rifleman, Automatic Rifleman (SAW), Grenadier, Team Leader, and Squad Leader (earned role). As the unit grows we may expand into weapons teams, recon elements, and additional leadership positions.",
  },
  {
    q: "Do I have to attend every operation?",
    a: "No — but we expect reasonable consistency. We understand work, school, and real life comes first. Just communicate if you'll be absent.",
  },
  {
    q: `Why "Outlaws"?`,
    a: `"Outlaws" represents our platoon identity: aggressive, independent, and reliable under pressure. It's about being the guys who get the job done — no matter what.`,
  },
];

const REAL_UNIT = [
  { label: "Established", value: "1974" },
  { label: "Component", value: "Active Army" },
  { label: "HQ", value: "Fort Moore, Georgia" },
  { label: "Subordinate to", value: "75th Ranger Regiment" },
  { label: "Motto", value: "Rangers Lead the Way" },
  { label: "Nickname", value: "The Rangers" },
];

// ── COMPONENT ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq]   = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible((v) => new Set([...v, e.target.id]));
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const glass: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
  };

  const accentBorder: React.CSSProperties = {
    border: "1px solid rgba(77,182,224,0.18)",
    borderRadius: "8px",
    background: "rgba(77,182,224,0.04)",
  };

  function revealStyle(id: string, delay = 0): React.CSSProperties {
    return {
      opacity:   visible.has(id) ? 1 : 0,
      transform: visible.has(id) ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    };
  }

  return (
    <div style={{ backgroundColor: "#07090e", color: "#e8edf5", minHeight: "100vh" }}>

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 1.5rem",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(77,182,224,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(77,182,224,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(77,182,224,0.06) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", pointerEvents: "none",
          background: "linear-gradient(to top, #07090e, transparent)",
        }} />

        {/* HUD top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0.5rem 1.5rem",
          backgroundColor: "rgba(7,9,14,0.8)",
          borderBottom: "1px solid rgba(77,182,224,0.12)",
        }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4db6e0" }}>
            UNCLASSIFIED // PUBLIC RELEASE
          </span>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#505870" }} className="hidden md:block">
            1ST PLT, A CO, 1/75TH RGR — OUTLAWS
          </span>
        </div>

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "720px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
            <span style={{
              width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#4db6e0",
              display: "inline-block", boxShadow: "0 0 0 0 rgba(77,182,224,0.4)",
              animation: "pulse-blue 2s infinite",
            }} />
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4db6e0" }}>
              1ST PLATOON · ALPHA COMPANY · 1/75TH RANGER REGIMENT
            </span>
          </div>

          <div style={{ position: "relative", display: "inline-block", padding: "1.5rem 2.5rem", marginBottom: "1rem" }}>
            {[
              { top: 0, left: 0, borderTop: "2px solid #4db6e0", borderLeft: "2px solid #4db6e0" },
              { top: 0, right: 0, borderTop: "2px solid #4db6e0", borderRight: "2px solid #4db6e0" },
              { bottom: 0, left: 0, borderBottom: "2px solid #4db6e0", borderLeft: "2px solid #4db6e0" },
              { bottom: 0, right: 0, borderBottom: "2px solid #4db6e0", borderRight: "2px solid #4db6e0" },
            ].map((s, i) => (
              <span key={i} style={{ position: "absolute", width: "20px", height: "20px", ...s }} />
            ))}
            <h1 style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)", fontWeight: 900,
              letterSpacing: "-0.01em", lineHeight: 1.05, color: "#e8edf5", margin: 0,
            }}>
              ABOUT THE UNIT
            </h1>
          </div>

          <p style={{ fontFamily: "monospace", fontSize: "1rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#4db6e0", marginBottom: "2.5rem" }}>
            Rangers Lead the Way
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "3rem" }}>
            {[
              { label: "GAME", value: "BELLUM" },
              { label: "TYPE", value: "MILSIM" },
              { label: "STATUS", value: "RECRUITING" },
            ].map(({ label, value }) => (
              <div key={label} style={{ ...accentBorder, padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#505870" }}>{label}</span>
                <span style={{ width: "1px", height: "12px", backgroundColor: "rgba(77,182,224,0.25)" }} />
                <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "#4db6e0" }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", animation: "bounce 2s infinite" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#505870" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ══ 01 / WHO WE ARE ══ */}
      <section id="panel-1" data-reveal style={{ padding: "6rem 1.5rem", maxWidth: "1280px", margin: "0 auto", ...revealStyle("panel-1") }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#4db6e0" }}>
            01 / WHO WE ARE
          </span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(77,182,224,0.3), transparent)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }} className="lg:grid-cols-[3fr_2fr]">
          <div>
            <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#e8edf5", marginBottom: "1.5rem" }}>The Outlaws</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "We are a Bellum milsim unit inspired by 1st Platoon, Alpha Company, 1/75 Ranger Regiment. While we are not a strict realism unit, we aim to replicate the structure, teamwork, and professionalism of a Ranger platoon in a gaming environment.",
                "This unit is veteran-founded, and that influence shows in how we operate — focus on team cohesion, emphasis on clear communication, and respect for structure without ego. You do not need military experience to join.",
                "We take the game moderately seriously. That means organized ops, real structure, and coordinated teamwork. But it also means we're not going to pretend we're in the actual Army. We understand it's still a game, and we prioritize having a good time with the boys.",
                "If you're looking for a unit that feels real enough to be immersive but relaxed enough to enjoy — you'll fit right in.",
              ].map((para, i) => (
                <p key={i} style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#8892a4" }}>{para}</p>
              ))}
            </div>
          </div>

          {/* Real unit card */}
          <div>
            <div style={{ ...glass, overflow: "hidden", position: "sticky", top: "6rem" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(77,182,224,0.12)", background: "rgba(77,182,224,0.05)" }}>
                <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4db6e0", marginBottom: "4px" }}>
                  Real-World Counterpart
                </p>
                <p style={{ fontWeight: 900, fontSize: "0.85rem", color: "#e8edf5" }}>1st Battalion, 75th Ranger Regiment</p>
                <p style={{ fontSize: "0.75rem", color: "#8892a4" }}>United States Army (Active Component)</p>
              </div>
              <div style={{ padding: "1.25rem" }}>
                {REAL_UNIT.map(({ label, value }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    gap: "1rem", padding: "0.65rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <span style={{ fontSize: "0.75rem", color: "#8892a4" }}>{label}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#e8edf5", textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "0.75rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(7,9,14,0.4)" }}>
                <p style={{ fontSize: "10px", color: "#505870", fontStyle: "italic" }}>
                  This is a gaming community. We are not affiliated with the U.S. Army.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 02 / VALUES ══ */}
      <section style={{ padding: "0 1.5rem 6rem", borderTop: "1px solid #161b27", paddingTop: "6rem" }}>
        <div id="panel-2" data-reveal style={{ maxWidth: "1280px", margin: "0 auto", ...revealStyle("panel-2") }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "3rem" }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#4db6e0" }}>
              02 / VALUES
            </span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(77,182,224,0.3), transparent)" }} />
          </div>

          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#e8edf5", marginBottom: "2.5rem" }}>What We Stand For</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {VALUES.map(({ icon: Icon, title, body }, i) => (
              <div key={title} style={{
                ...glass, padding: "1.75rem",
                transition: `opacity 0.7s ease ${i * 100}ms, transform 0.7s ease ${i * 100}ms`,
                opacity: visible.has("panel-2") ? 1 : 0,
                transform: visible.has("panel-2") ? "translateY(0)" : "translateY(22px)",
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  backgroundColor: "rgba(77,182,224,0.08)", border: "1px solid rgba(77,182,224,0.18)",
                  marginBottom: "1rem",
                }}>
                  <Icon size={20} style={{ color: "#4db6e0" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#4db6e0", flexShrink: 0, animation: "pulse-blue 2s infinite" }} />
                  <h3 style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", color: "#e8edf5" }}>{title}</h3>
                </div>
                <p style={{ fontSize: "0.8rem", lineHeight: 1.7, color: "#8892a4" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 03 / FAQ ══ */}
      <section style={{ padding: "6rem 1.5rem", borderTop: "1px solid #161b27", background: "linear-gradient(180deg, #07090e 0%, #0a0d14 100%)" }}>
        <div id="panel-3" data-reveal style={{ maxWidth: "860px", margin: "0 auto", ...revealStyle("panel-3") }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "3rem" }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#4db6e0" }}>
              03 / FAQ
            </span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(77,182,224,0.3), transparent)" }} />
          </div>

          <h2 style={{ fontSize: "2rem", fontWeight: 900, color: "#e8edf5", marginBottom: "2.5rem" }}>Frequently Asked Questions</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {FAQS.map(({ q, a }, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{
                  ...glass,
                  overflow: "hidden",
                  borderColor: isOpen ? "rgba(77,182,224,0.25)" : "rgba(255,255,255,0.06)",
                  transition: "border-color 0.2s",
                }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between", gap: "1rem",
                      padding: "1.1rem 1.5rem", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: isOpen ? "#e8edf5" : "#b0bec5" }}>
                      {q}
                    </span>
                    <ChevronDown
                      size={16}
                      style={{
                        color: "#4db6e0", flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 1.5rem 1.25rem" }}>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.8, color: "#8892a4", borderTop: "1px solid rgba(77,182,224,0.1)", paddingTop: "1rem" }}>
                        {a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 04 / JOIN ══ */}
      <section style={{ padding: "6rem 1.5rem", borderTop: "1px solid #161b27", background: "linear-gradient(180deg, #07090e 0%, #09101a 100%)" }}>
        <div id="panel-4" data-reveal style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", ...revealStyle("panel-4") }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "1rem" }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4db6e0",
              display: "inline-block", animation: "pulse-blue 2s infinite",
            }} />
            <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4db6e0" }}>
              How to Join
            </span>
          </div>

          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#e8edf5", marginBottom: "1rem" }}>
            Ready to Serve?
          </h2>

          <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "#8892a4", maxWidth: "520px", margin: "0 auto 3rem" }}>
            No long, drawn-out process. We keep it simple — if you have the right mindset, you'll fit right in.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem", marginBottom: "2.5rem", textAlign: "left",
          }}>
            {[
              { step: "01", title: "Join the Discord",    body: "Find us through the enlistment page and join the server." },
              { step: "02", title: "Introduce Yourself",  body: "Drop an intro in the channel and get familiar with the unit." },
              { step: "03", title: "Short Onboarding",    body: "Go through a quick onboarding — no drawn-out gatekeeping." },
              { step: "04", title: "Get Placed",          body: "Get assigned to a squad in 1st Platoon and start running ops." },
            ].map(({ step, title, body }) => (
              <div key={step} style={{ ...glass, padding: "1.5rem", position: "relative", overflow: "hidden" }}>
                <span style={{
                  position: "absolute", top: "4px", right: "12px",
                  fontWeight: 900, fontSize: "4rem", color: "rgba(77,182,224,0.05)",
                  lineHeight: 1, fontFamily: "monospace", userSelect: "none",
                }}>
                  {step}
                </span>
                <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4db6e0", marginBottom: "6px" }}>
                  Step {step}
                </p>
                <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#e8edf5", marginBottom: "6px" }}>{title}</h3>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "#8892a4" }}>{body}</p>
              </div>
            ))}
          </div>

          <Link href="/enlist" style={{
            display: "inline-flex", alignItems: "center", gap: "10px",
            fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.15em",
            textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: "6px",
            backgroundColor: "#111827", color: "#4db6e0",
            border: "1px solid rgba(77,182,224,0.35)",
            boxShadow: "0 0 20px rgba(77,182,224,0.1)",
            textDecoration: "none", fontFamily: "sans-serif",
          }}>
            Start Enlistment <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes pulse-blue {
          0%, 100% { box-shadow: 0 0 0 0 rgba(77,182,224,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(77,182,224,0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(6px); }
        }
        @media (min-width: 1024px) {
          .lg\\:grid-cols-\\[3fr_2fr\\] { grid-template-columns: 3fr 2fr; }
        }
      `}</style>
    </div>
  );
}
