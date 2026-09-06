"use client";

import { useState, useTransition } from "react";
import { Send, Check, X } from "lucide-react";
import { sendDirectMessage } from "@/app/lib/actions/notifications";

type Recipient = { id: string; name: string; rank: string; label: string };

export default function ComposeForm({ recipients }: { recipients: Recipient[] }) {
  const [soldierId, setSoldierId] = useState("");
  const [title, setTitle]         = useState("");
  const [body, setBody]           = useState("");
  const [result, setResult]       = useState<{ ok: boolean; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const inputStyle = { backgroundColor: "#090b07", border: "1px solid #1c2014", color: "#e8e4d8", borderRadius: "4px" };
  const labelStyle = { color: "#6b6a58" };

  function handleSend() {
    if (!soldierId || !title.trim() || !body.trim()) return;
    setResult(null);
    startTransition(async () => {
      const res = await sendDirectMessage(soldierId, title.trim(), body.trim());
      if (res.error) {
        setResult({ ok: false, msg: res.error });
      } else {
        setResult({ ok: true, msg: "Message sent successfully." });
        setTitle("");
        setBody("");
        setSoldierId("");
      }
    });
  }

  return (
    <div
      className="rounded-lg p-6 space-y-5"
      style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}
    >
      {/* Recipient */}
      <div>
        <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={labelStyle}>
          Recipient *
        </label>
        <select
          value={soldierId}
          onChange={(e) => setSoldierId(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={inputStyle}
        >
          <option value="">— Select soldier —</option>
          {recipients.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={labelStyle}>
          Subject *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Important announcement"
          className="w-full px-4 py-3 text-sm outline-none"
          style={inputStyle}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-[10px] font-black tracking-widest uppercase mb-2" style={labelStyle}>
          Message *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message here..."
          rows={6}
          className="w-full px-4 py-3 text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      {/* Result */}
      {result && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded"
          style={{
            backgroundColor: result.ok ? "rgba(74,222,128,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${result.ok ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`,
          }}
        >
          {result.ok
            ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#4ade80" }} />
            : <X     className="w-3.5 h-3.5 shrink-0" style={{ color: "#ef4444" }} />
          }
          <span className="text-xs" style={{ color: result.ok ? "#4ade80" : "#ef4444" }}>
            {result.msg}
          </span>
        </div>
      )}

      {/* Send */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!soldierId || !title.trim() || !body.trim() || pending}
        className="flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#c9a128", color: "#090b07" }}
      >
        <Send className="w-3.5 h-3.5" />
        {pending ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
}
