"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { login, signup } from "@/app/lib/actions/auth";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const [status, setStatus]       = useState<string>("");
  const [statusColor, setStatusColor] = useState("#505870");
  const [mode, setMode]           = useState<"login" | "create">("login");

  async function handleSubmit(formData: FormData) {
    setStatus("AUTHENTICATING...");
    setStatusColor("#4db6e0");
    formData.set("redirect", redirectTo);

    if (mode === "create") {
      const result = await signup(formData);
      if (result?.error) {
        setStatus(`ERROR: ${result.error.toUpperCase()}`);
        setStatusColor("#ef4444");
      } else if (result?.success) {
        setStatus(result.success.toUpperCase());
        setStatusColor("#4ade80");
      }
    } else {
      const result = await login(formData);
      if (result?.error) {
        setStatus(`ACCESS DENIED: ${result.error.toUpperCase()}`);
        setStatusColor("#ef4444");
      }
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
                  width={72}
                  height={72}
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
              RGRNET v1.75 // SECURE SESSION
            </p>
            <h1
              className="text-xl font-black tracking-widest uppercase mb-2"
              style={{ color: "#e8edf5", fontFamily: "monospace" }}
            >
              ODA NETWORK LOGIN
            </h1>
            <p
              className="text-[10px] tracking-[0.15em] uppercase"
              style={{ color: "#505870", fontFamily: "monospace" }}
            >
              ODA 2011 · 20th Special Forces Group
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="w-10 h-px" style={{ backgroundColor: "#161b27" }} />
              <span
                className="text-[8px] tracking-[0.2em] uppercase"
                style={{ color: "#2e3650", fontFamily: "monospace" }}
              >
                ODA 2011 · ARMA
              </span>
              <div className="w-10 h-px" style={{ backgroundColor: "#161b27" }} />
            </div>
          </div>

          {/* Mode toggle */}
          <div
            className="flex rounded-lg overflow-hidden mb-6"
            style={{ border: "1px solid #161b27" }}
          >
            {(["login", "create"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase transition-all"
                style={{
                  backgroundColor:
                    mode === m ? "rgba(77,182,224,0.1)" : "transparent",
                  color: mode === m ? "#4db6e0" : "#505870",
                  borderBottom: mode === m ? "2px solid #4db6e0" : "2px solid transparent",
                  fontFamily: "monospace",
                }}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form card */}
          <form
            action={handleSubmit}
            className="rounded-lg p-7"
            style={{
              backgroundColor: "#0b0e15",
              border: "1px solid #161b27",
            }}
          >
            <div className="space-y-5">

              {mode === "create" && (
                <div>
                  <label
                    className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#505870", fontFamily: "monospace" }}
                  >
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    required
                    className="w-full px-4 py-3 rounded text-sm outline-none transition-colors focus:border-[#4db6e0] placeholder:text-[#2e3650]"
                    style={{
                      backgroundColor: "#07090e",
                      border: "1px solid #161b27",
                      color: "#e8edf5",
                      fontFamily: "monospace",
                    }}
                    placeholder="CALLSIGN"
                  />
                </div>
              )}

              <div>
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
                  className="w-full px-4 py-3 rounded text-sm outline-none transition-colors focus:border-[#4db6e0] placeholder:text-[#2e3650]"
                  style={{
                    backgroundColor: "#07090e",
                    border: "1px solid #161b27",
                    color: "#e8edf5",
                    fontFamily: "monospace",
                  }}
                  placeholder="OPERATOR@DOMAIN.COM"
                />
              </div>

              <div>
                <label
                  className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                  style={{ color: "#505870", fontFamily: "monospace" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  autoComplete={mode === "create" ? "new-password" : "current-password"}
                  className="w-full px-4 py-3 rounded text-sm outline-none transition-colors focus:border-[#4db6e0]"
                  style={{
                    backgroundColor: "#07090e",
                    border: "1px solid #161b27",
                    color: "#e8edf5",
                  }}
                  placeholder="••••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-7 py-3.5 rounded text-xs font-black tracking-[0.2em] uppercase transition-all"
              style={{
                backgroundColor: "#e8edf5",
                color: "#07090e",
              }}
            >
              {mode === "login" ? "Authenticate" : "Create Account"}
            </button>

            {/* Status */}
            {status && (
              <div
                className="mt-5 px-4 py-2.5 rounded text-center"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  border: `1px solid ${statusColor}30`,
                }}
              >
                <p
                  className="text-[10px] font-black tracking-widest uppercase"
                  style={{ color: statusColor, fontFamily: "monospace" }}
                >
                  {status}
                </p>
              </div>
            )}
          </form>

          {/* Footer links */}
          <div className="text-center mt-7 space-y-3">
            <div>
              <Link
                href="/forgot-password"
                className="text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-[#4db6e0]"
                style={{ color: "#505870", fontFamily: "monospace" }}
              >
                Forgot password?
              </Link>
            </div>
            <div>
              <Link
                href="/enlist"
                className="text-[10px] tracking-[0.2em] uppercase transition-colors hover:text-[#4db6e0]"
                style={{ color: "#505870", fontFamily: "monospace" }}
              >
                No account? Enlist here →
              </Link>
            </div>
            <div>
              <Link
                href="/"
                className="text-[10px] tracking-[0.15em] uppercase"
                style={{ color: "#2e3650", fontFamily: "monospace" }}
              >
                ← Return to Main Site
              </Link>
            </div>
          </div>

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#07090e" }} className="min-h-screen" />}>
      <LoginForm />
    </Suspense>
  );
}
