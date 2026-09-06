"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteSoldier } from "@/app/lib/actions/soldiers";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    await deleteSoldier(id);
    router.push("/admin/soldiers");
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "#ef4444" }}>Delete {name}?</span>
        <button onClick={handleDelete} className="px-3 py-1.5 rounded text-[10px] font-black tracking-widest uppercase"
          style={{ backgroundColor: "#ef4444", color: "#fff" }}>
          Yes
        </button>
        <button onClick={() => setConfirming(false)} className="px-3 py-1.5 rounded text-[10px] font-black tracking-widest uppercase"
          style={{ color: "#8a8870", border: "1px solid #1c2014" }}>
          No
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)}
      className="flex items-center gap-2 px-4 py-2 rounded text-[10px] font-black tracking-widest uppercase"
      style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
      <Trash2 className="w-3 h-3" /> Delete
    </button>
  );
}
