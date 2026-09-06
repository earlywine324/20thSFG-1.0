"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveApplication, denyApplication } from "@/app/lib/actions/applications";
import { CheckCircle, XCircle } from "lucide-react";

export default function ApplicationActions({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeny, setShowDeny] = useState(false);
  const [notes, setNotes] = useState("");

  const [approved, setApproved] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const result = await approveApplication(id);
    if (result.success) {
      setApproved(true);
    }
    setLoading(false);
    router.refresh();
  }

  async function handleDeny() {
    setLoading(true);
    await denyApplication(id, notes);
    router.refresh();
  }

  return (
    <div className="rounded-lg p-5" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
      <p className="text-[10px] font-black tracking-widest uppercase mb-4" style={{ color: "#8a8870" }}>
        Actions
      </p>

      {approved ? (
        <div className="p-4 rounded" style={{ backgroundColor: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)" }}>
          <p className="text-sm font-bold mb-1" style={{ color: "#4ade80" }}>Application Approved</p>
          <p className="text-xs" style={{ color: "#8a8870" }}>
            Soldier profile created and assigned to <strong style={{ color: "#e8e4d8" }}>USAJFKSWCS — Initial Entry Training (IET)</strong>.
            Go to <a href="/admin/soldiers" className="underline" style={{ color: "#c9a128" }}>Roster Management</a> to assign them to a billet.
          </p>
        </div>
      ) : showDeny ? (
        <div className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for denial (optional)..."
            rows={3}
            className="w-full px-4 py-3 rounded text-sm outline-none resize-none"
            style={{ backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8" }}
          />
          <div className="flex gap-3">
            <button
              onClick={handleDeny}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded text-xs font-black tracking-widest uppercase disabled:opacity-50"
              style={{ backgroundColor: "#ef4444", color: "#fff" }}
            >
              <XCircle className="w-4 h-4" />
              {loading ? "Processing..." : "Confirm Deny"}
            </button>
            <button
              onClick={() => setShowDeny(false)}
              className="px-6 py-3 rounded text-xs font-black tracking-widest uppercase"
              style={{ color: "#8a8870", border: "1px solid #1c2014" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded text-xs font-black tracking-widest uppercase disabled:opacity-50"
            style={{ backgroundColor: "#4ade80", color: "#090b07" }}
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? "Processing..." : "Approve"}
          </button>
          <button
            onClick={() => setShowDeny(true)}
            className="flex items-center gap-2 px-6 py-3 rounded text-xs font-black tracking-widest uppercase"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <XCircle className="w-4 h-4" />
            Deny
          </button>
        </div>
      )}
    </div>
  );
}
