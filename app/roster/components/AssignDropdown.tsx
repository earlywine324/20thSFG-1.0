"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assignSoldierToBillet } from "@/app/lib/actions/soldiers";
import { UserPlus, Search } from "lucide-react";

type SoldierOption = {
  id: string;
  name: string;
  callsign: string | null;
  rank: string;
};

export default function AssignDropdown({ billetId, soldiers }: { billetId: string; soldiers: SoldierOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleAssign(soldierId: string) {
    setLoading(true);
    const result = await assignSoldierToBillet(soldierId, billetId);
    if (result.error) {
      alert("Error: " + result.error);
    }
    setLoading(false);
    setOpen(false);
    setSearch("");
    router.refresh();
  }

  if (soldiers.length === 0) return null;

  const filtered = soldiers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rank.toLowerCase().includes(q) ||
      (s.callsign && s.callsign.toLowerCase().includes(q))
    );
  });

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-colors"
        style={{
          color: "#c9a128",
          backgroundColor: "rgba(201,161,40,0.08)",
          border: "1px solid rgba(201,161,40,0.15)",
        }}
      >
        <UserPlus className="w-3 h-3" />
        Assign Soldier
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-64 rounded-lg overflow-hidden shadow-xl z-50"
          style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}
        >
          <p className="px-3 py-2 text-[9px] font-black tracking-widest uppercase" style={{ color: "#8a8870", borderBottom: "1px solid #1c2014" }}>
            Select Active Soldier
          </p>

          {/* Search */}
          <div className="px-3 py-2" style={{ borderBottom: "1px solid #1c2014" }}>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ backgroundColor: "#090b07", border: "1px solid #1c2014" }}>
              <Search className="w-3 h-3 shrink-0" style={{ color: "#6b6a58" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or rank..."
                className="w-full bg-transparent text-xs outline-none"
                style={{ color: "#e8e4d8" }}
                autoFocus
              />
            </div>
          </div>

          {/* Soldier list */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-3 text-xs italic" style={{ color: "#6b6a58" }}>No soldiers found.</p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleAssign(s.id)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2.5 text-xs transition-colors disabled:opacity-50"
                  style={{ color: "#e8e4d8", borderBottom: "1px solid #1c2014" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(201,161,40,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span className="font-bold" style={{ color: "#c9a128" }}>{s.rank}</span>{" "}
                  {s.name}
                  {s.callsign && <span style={{ color: "#6b6a58" }}> ({s.callsign})</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
