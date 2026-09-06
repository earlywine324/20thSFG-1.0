"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-sm w-full text-center space-y-5">
        <AlertTriangle className="w-8 h-8 mx-auto" style={{ color: "#ef4444" }} />
        <div>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-1" style={{ color: "#ef4444" }}>Admin Error</p>
          <p className="text-sm" style={{ color: "#8a8870" }}>Something went wrong loading this page.</p>
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-3 rounded text-xs font-black tracking-widest uppercase"
          style={{ backgroundColor: "rgba(201,161,40,0.12)", color: "#c9a128", border: "1px solid rgba(201,161,40,0.2)" }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    </div>
  );
}
