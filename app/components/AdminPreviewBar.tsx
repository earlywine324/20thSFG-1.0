"use client";

import { useState, useTransition } from "react";
import { setPreviewRole } from "@/app/lib/preview";
import type { ViewRole } from "@/app/lib/preview";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const ROLES: { value: ViewRole; label: string; color: string; bg: string; border: string }[] = [
  {
    value:  "guest",
    label:  "Guest",
    color:  "#8b949e",
    bg:     "rgba(139,148,158,.12)",
    border: "rgba(139,148,158,.2)",
  },
  {
    value:  "member",
    label:  "Member",
    color:  "#58a6ff",
    bg:     "rgba(88,166,255,.12)",
    border: "rgba(88,166,255,.22)",
  },
  {
    value:  "admin",
    label:  "Admin",
    color:  "#d29922",
    bg:     "rgba(210,153,34,.12)",
    border: "rgba(210,153,34,.22)",
  },
];

export default function AdminPreviewBar({ current }: { current: ViewRole }) {
  const [open, setOpen]       = useState(false);
  const [pending, startTransition] = useTransition();

  const isPreviewing = current !== "admin";
  const currentRole  = ROLES.find(r => r.value === current)!;

  function switchRole(role: ViewRole) {
    startTransition(async () => {
      await setPreviewRole(role);
    });
  }

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2"
      style={{ pointerEvents: "none" }}
    >
      {/* Expanded panel */}
      {open && (
        <div
          className="rounded-xl overflow-hidden shadow-2xl"
          style={{
            background:   "#0d1117",
            border:       "1px solid #21262d",
            pointerEvents: "auto",
            minWidth:     220,
          }}
        >
          {/* Header */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #21262d" }}>
            <p className="text-[9px] font-black tracking-[.2em] uppercase" style={{ color: "#484f58" }}>
              Preview As
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#8b949e" }}>
              Toggles what each role sees
            </p>
          </div>

          {/* Role buttons */}
          <div className="p-2 flex flex-col gap-1">
            {ROLES.map(role => {
              const isActive = current === role.value;
              return (
                <button
                  key={role.value}
                  onClick={() => switchRole(role.value)}
                  disabled={pending}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all disabled:opacity-50"
                  style={{
                    background: isActive ? role.bg    : "transparent",
                    border:     `1px solid ${isActive ? role.border : "transparent"}`,
                  }}
                  onMouseEnter={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,.04)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  }}
                >
                  {/* Dot */}
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      background:  isActive ? role.color : "#30363d",
                      boxShadow:   isActive ? `0 0 6px ${role.color}` : "none",
                    }}
                  />
                  <span
                    className="text-xs font-bold flex-1"
                    style={{ color: isActive ? role.color : "#8b949e" }}
                  >
                    {role.label}
                    {isActive && (
                      <span className="ml-2 text-[9px] font-black tracking-wider uppercase"
                        style={{ color: role.color, opacity: .7 }}>
                        {current === "admin" ? "You" : "Previewing"}
                      </span>
                    )}
                  </span>
                  {pending && isActive && (
                    <Loader2 className="w-3 h-3 animate-spin shrink-0" style={{ color: role.color }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="px-4 py-2.5" style={{ borderTop: "1px solid #21262d" }}>
            <p className="text-[9px]" style={{ color: "#484f58" }}>
              Only visible to admins · Resets in 1h
            </p>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl shadow-2xl transition-all"
        style={{
          background:    isPreviewing ? currentRole.bg    : "#0d1117",
          border:        `1px solid ${isPreviewing ? currentRole.border : "#21262d"}`,
          color:         isPreviewing ? currentRole.color : "#484f58",
          pointerEvents: "auto",
        }}
        title="Admin Preview Mode"
      >
        {isPreviewing
          ? <Eye className="w-3.5 h-3.5" />
          : <EyeOff className="w-3.5 h-3.5" />
        }
        <span className="text-[10px] font-black tracking-wider uppercase">
          {isPreviewing ? `Viewing as ${currentRole.label}` : "Preview"}
        </span>
        {isPreviewing && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: currentRole.color }}
          />
        )}
      </button>
    </div>
  );
}
