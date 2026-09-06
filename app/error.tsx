"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: "#090b07" }}>
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <AlertTriangle className="w-7 h-7" style={{ color: "#ef4444" }} />
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: "#ef4444" }}>System Error</p>
          <h2 className="text-2xl font-black mb-3" style={{ color: "#e8e4d8" }}>Something went wrong</h2>
          <p className="text-sm" style={{ color: "#6b6a58" }}>
            An unexpected error occurred. Try reloading — if the problem persists, contact an admin.
          </p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-black tracking-widest uppercase"
          style={{ backgroundColor: "#c9a128", color: "#090b07" }}
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
