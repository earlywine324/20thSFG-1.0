"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { dischargeSoldier } from "@/app/lib/actions/soldiers";
import { UserMinus, X } from "lucide-react";

export default function DischargeButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Honorable Discharge");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDischarge() {
    startTransition(async () => {
      const result = await dischargeSoldier(id, reason || "Honorable Discharge");
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin/soldiers");
        router.refresh();
      }
    });
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-5 py-3 rounded text-xs font-black tracking-widest uppercase"
        style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.25)" }}
      >
        <UserMinus className="w-4 h-4" />
        Discharge {name}
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-lg p-6 space-y-5"
            style={{ backgroundColor: "#0f120a", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserMinus className="w-4 h-4" style={{ color: "#ef4444" }} />
                <p className="text-xs font-black tracking-widest uppercase" style={{ color: "#ef4444" }}>
                  Discharge Soldier
                </p>
              </div>
              <button onClick={() => setOpen(false)} style={{ color: "#6b6a58" }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{name}</p>
            <p className="text-[11px]" style={{ color: "#6b6a58" }}>
              Status will be set to DISCHARGED, a service record entry will be logged, and their billet will be marked vacant.
            </p>

            {/* Reason input */}
            <div>
              <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={{ color: "#6b6a58" }}>
                Discharge Reason
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm outline-none"
                style={{ backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8" }}
                placeholder="Honorable Discharge"
              />
            </div>

            {error && (
              <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: "#ef4444" }}>
                ERROR: {error}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleDischarge}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-3 rounded text-xs font-black tracking-widest uppercase disabled:opacity-50"
                style={{ backgroundColor: "#ef4444", color: "#fff" }}
              >
                <UserMinus className="w-4 h-4" />
                {isPending ? "Processing..." : "Confirm Discharge"}
              </button>
              <button
                onClick={() => { setOpen(false); setError(""); }}
                className="px-5 py-3 rounded text-xs font-black tracking-widest uppercase"
                style={{ color: "#8a8870", border: "1px solid #1c2014" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
