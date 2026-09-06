"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm  = (form.elements.namedItem("confirm")  as HTMLInputElement).value;

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      setState("error");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      setState("error");
      return;
    }

    setState("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(error.message);
      setState("error");
    } else {
      setState("success");
      setTimeout(() => router.push("/admin"), 2500);
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
              RGRNET // CREDENTIAL UPDATE
            </p>
            <h1
              className="text-xl font-black tracking-widest uppercase mb-2"
              style={{ color: "#e8edf5", fontFamily: "monospace" }}
            >
              New Password
            </h1>
            <p className="text-xs" style={{ color: "#505870" }}>
              Set a new password for your account.
            </p>
          </div>

          {state === "success" ? (
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
                PASSWORD UPDATED
              </p>
              <p className="text-sm mb-1" style={{ color: "#e8edf5" }}>
                Credentials successfully updated.
              </p>
              <p className="text-xs" style={{ color: "#505870" }}>
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-lg p-7"
              style={{
                backgroundColor: "#0b0e15",
                border: "1px solid #161b27",
              }}
            >
              <div className="space-y-5">

                {/* New password */}
                <div>
                  <label
                    className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#505870", fontFamily: "monospace" }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      name="password"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-11 rounded text-sm outline-none transition-colors"
                      style={{
                        backgroundColor: "#07090e",
                        border: "1px solid #161b27",
                        color: "#e8edf5",
                      }}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#505870" }}
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    className="block text-[10px] font-black tracking-[0.2em] uppercase mb-2"
                    style={{ color: "#505870", fontFamily: "monospace" }}
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirm"
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-11 rounded text-sm outline-none transition-colors"
                      style={{
                        backgroundColor: "#07090e",
                        border: "1px solid #161b27",
                        color: "#e8edf5",
                      }}
                      placeholder="••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#505870" }}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password rules */}
              <p
                className="text-[9px] tracking-wider mt-3"
                style={{ color: "#2e3650", fontFamily: "monospace" }}
              >
                MINIMUM 6 CHARACTERS REQUIRED
              </p>

              {/* Error */}
              {state === "error" && (
                <div
                  className="mt-5 px-4 py-2.5 rounded"
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
                className="w-full flex items-center justify-center gap-2 mt-7 py-3.5 rounded text-xs font-black tracking-[0.2em] uppercase transition-all disabled:opacity-50"
                style={{ backgroundColor: "#e8edf5", color: "#07090e" }}
              >
                {state === "loading" ? "UPDATING..." : (
                  <>Update Password <ArrowRight className="w-3.5 h-3.5" /></>
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
