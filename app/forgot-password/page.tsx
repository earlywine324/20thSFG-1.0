"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import { ArrowRight, ChevronLeft } from "lucide-react";

type State = "idle" | "loading" | "sent" | "error";

export default function ForgotPasswordPage() {
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value.trim();
    const supabase = createClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setErrorMsg(error.message);
      setState("error");
    } else {
      setState("sent");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#07090e", color: "#e8edf5" }}
    >
      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
          zIndex: 0,
        }}
      />

      {/* Classification bar */}
      <div
        className="relative z-10 py-2 px-6 flex items-center justify-between"
        style={{
          backgroundColor: "rgba(0,0,0,0.6)",
          borderBottom: "1px solid rgba(77,182,224,0.15)",
        }}
      >
        <span
          className="text-[9px] tracking-[0.25em] uppercase"
          style={{ color: "#4db6e0", fontFamily: "monospace" }}
        >
          UNCLASSIFIED // FOR OFFICIAL USE ONLY
        </span>
        <span
          className="text-[9px] tracking-[0.15em] uppercase hidden md:block"
          style={{ color: "#505870", fontFamily: "monospace" }}
        >
          20TH SFG — RGRNET ACCESS TERMINAL
        </span>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Back link */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase mb-8 transition-colors hover:text-[#4db6e0]"
            style={{ color: "#505870", fontFamily: "monospace" }}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Login
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: "rgba(77,182,224,0.06)",
                  border: "1px solid rgba(77,182,224,0.15)",
                }}
              >
                <Image
                  src="/logo-new.png"
                  alt="20th SFG"
                  width={64}
                  height={64}
                  style={{
                    filter: "drop-shadow(0 0 16px rgba(77,182,224,0.2))",
                    opacity: 0.95,
                  }}
                />
              </div>
            </div>
            <p
              className="text-[9px] tracking-[0.3em] uppercase mb-2"
              style={{ color: "#4db6e0", fontFamily: "monospace" }}
            >
              RGRNET // CREDENTIAL RECOVERY
            </p>
            <h1
              className="text-xl font-black tracking-widest uppercase mb-2"
              style={{ color: "#e8edf5", fontFamily: "monospace" }}
            >
              Reset Password
            </h1>
            <p className="text-xs leading-relaxed" style={{ color: "#505870" }}>
              Enter your account email. If it exists in the system,<br />
              a recovery link will be dispatched.
            </p>
          </div>

          {state === "sent" ? (
            /* ── Success state ── */
            <div
              className="rounded-lg p-8 text-center"
              style={{
                backgroundColor: "#0b0e15",
                border: "1px solid rgba(74,222,128,0.2)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  backgroundColor: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.2)",
                }}
              >
                <span style={{ color: "#4ade80", fontSize: "20px" }}>✓</span>
              </div>
              <p
                className="text-[9px] font-black tracking-[0.25em] uppercase mb-3"
                style={{ color: "#4ade80", fontFamily: "monospace" }}
              >
                TRANSMISSION SENT
              </p>
              <p className="text-sm mb-1" style={{ color: "#e8edf5" }}>
                Recovery link dispatched.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#505870" }}>
                Check your email and click the link to set a new password.
                The link expires in 1 hour.
              </p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="text-[10px] font-black tracking-widest uppercase transition-colors hover:text-[#4db6e0]"
                  style={{ color: "#505870", fontFamily: "monospace" }}
                >
                  ← Return to Login
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form
              onSubmit={handleSubmit}
              className="rounded-lg p-7"
              style={{
                backgroundColor: "#0b0e15",
                border: "1px solid #161b27",
              }}
            >
              <div className="mb-6">
                <label
                  className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#505870", fontFamily: "monospace" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded text-sm outline-none transition-colors placeholder:text-[#2e3650]"
                  style={{
                    backgroundColor: "#07090e",
                    border: "1px solid #161b27",
                    color: "#e8edf5",
                    fontFamily: "monospace",
                  }}
                  placeholder="OPERATOR@DOMAIN.COM"
                />
              </div>

              {state === "error" && (
                <div
                  className="mb-5 px-4 py-2.5 rounded"
                  style={{
                    backgroundColor: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.2)",
                  }}
                >
                  <p
                    className="text-[10px] font-black tracking-widest uppercase"
                    style={{ color: "#f87171", fontFamily: "monospace" }}
                  >
                    ERROR: {errorMsg.toUpperCase()}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={state === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded text-xs font-black tracking-[0.2em] uppercase transition-all disabled:opacity-50"
                style={{ backgroundColor: "#e8edf5", color: "#07090e" }}
              >
                {state === "loading" ? "TRANSMITTING..." : (
                  <>Send Recovery Link <ArrowRight className="w-3.5 h-3.5" /></>
                )}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-10 py-3 px-6 text-center"
        style={{ borderTop: "1px solid #161b27" }}
      >
        <p
          className="text-[9px] tracking-[0.2em] uppercase"
          style={{ color: "#1e2535", fontFamily: "monospace" }}
        >
          ODA 2011, 20TH SPECIAL FORCES GROUP — ODA 2011 · ARMA · EST 2026
        </p>
      </div>
    </div>
  );
}
