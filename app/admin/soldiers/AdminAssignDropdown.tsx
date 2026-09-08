"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { assignSoldierToBillet } from "@/app/lib/actions/soldiers";
import { UserPlus, Search, X, Loader2, ChevronRight, Plus } from "lucide-react";

type SoldierOption = {
  id: string;
  name: string;
  callsign: string | null;
  rank: string;
  unit: string;
};

type Panel = { top: number; left: number; width: number };

export default function AdminAssignDropdown({
  billetId,
  soldiers,
  billetRole,
  billetUnit,
  billetTeam,
}: {
  billetId: string;
  soldiers: SoldierOption[];
  billetRole?: string;
  billetUnit?: string;
  billetTeam?: string;
}) {
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [panel, setPanel]     = useState<Panel>({ top: 0, left: 0, width: 300 });

  const btnRef   = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  /* Position the fixed panel relative to the trigger button */
  const positionPanel = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const panelW = 320;
    const spaceRight = window.innerWidth - r.right;
    const left = spaceRight < panelW ? Math.max(8, r.right - panelW) : r.left;
    setPanel({ top: r.bottom + 6, left, width: panelW });
  }, []);

  function openDropdown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setSearch("");
    positionPanel();
    setOpen(true);
  }

  /* Close on outside click + reposition on scroll */
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setError(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    window.addEventListener("scroll", positionPanel, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [open, positionPanel]);

  /* Auto-focus search when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  async function handleAssign(soldier: SoldierOption) {
    setLoading(soldier.id);
    setError(null);
    const result = await assignSoldierToBillet(soldier.id, billetId);
    if (result.error) {
      setError(result.error);
      setLoading(null);
      return;
    }
    setSuccess(true);
    setLoading(null);
    setOpen(false);
    router.refresh();
  }

  /* Build the "create & assign" URL so the new-soldier form can auto-populate */
  const createUrl = (() => {
    const params = new URLSearchParams();
    if (billetRole) params.set("role", billetRole);
    if (billetUnit) params.set("unit", billetUnit);
    if (billetTeam) params.set("team", billetTeam);
    params.set("billetId", billetId);
    return `/admin/soldiers/new?${params.toString()}`;
  })();

  const filtered = soldiers.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.rank.toLowerCase().includes(q) ||
      (s.callsign && s.callsign.toLowerCase().includes(q)) ||
      s.unit.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        ref={btnRef}
        onClick={openDropdown}
        className="flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-all shrink-0"
        style={{
          color:           success ? "#4ade80" : "#c9a128",
          backgroundColor: success ? "rgba(74,222,128,0.08)" : "rgba(201,161,40,0.08)",
          border:          `1px solid ${success ? "rgba(74,222,128,0.2)" : "rgba(201,161,40,0.2)"}`,
        }}
        title="Assign soldier to this billet"
      >
        <UserPlus className="w-3 h-3" />
        {success ? "Assigned" : "Assign"}
      </button>

      {/* ── Fixed panel — renders outside any overflow container ── */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9999] rounded-lg shadow-2xl overflow-hidden"
          style={{
            top:             panel.top,
            left:            panel.left,
            width:           panel.width,
            backgroundColor: "#0f120a",
            border:          "1px solid #1c2014",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5"
            style={{ borderBottom: "1px solid #1c2014" }}>
            <div>
              <p className="text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: "#8a8870" }}>
                Assign to Billet
              </p>
              {billetRole && (
                <p className="text-[9px] mt-0.5 truncate" style={{ color: "#4a4838" }}>
                  {billetRole}
                </p>
              )}
            </div>
            <button
              onClick={() => { setOpen(false); setError(null); }}
              className="p-0.5 rounded transition-colors hover:bg-[#1c2014]"
              style={{ color: "#6b6a58" }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2" style={{ borderBottom: "1px solid #1c2014" }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded"
              style={{ backgroundColor: "#090b07", border: "1px solid #1c2014" }}>
              <Search className="w-3 h-3 shrink-0" style={{ color: "#6b6a58" }} />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, rank, unit…"
                className="w-full bg-transparent text-xs outline-none placeholder:text-[#4a4838]"
                style={{ color: "#e8e4d8" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ color: "#6b6a58" }}>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-2" style={{ borderBottom: "1px solid #1c2014", backgroundColor: "rgba(239,68,68,0.06)" }}>
              <p className="text-[10px] font-bold" style={{ color: "#f87171" }}>
                ⚠ {error}
              </p>
            </div>
          )}

          {/* Soldier list */}
          <div className="max-h-56 overflow-y-auto">
            {soldiers.length === 0 ? (
              /* ── Empty state: no soldiers exist yet ── */
              <div className="px-4 py-5">
                <p className="text-xs font-bold mb-1" style={{ color: "#6b6a58" }}>
                  No soldiers available to assign
                </p>
                <p className="text-[10px] mb-4" style={{ color: "#4a4838" }}>
                  Approve an application or add a soldier manually first.
                  You can also create a new soldier directly for this billet.
                </p>
                <a
                  href={createUrl}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded text-[10px] font-black tracking-widest uppercase justify-center"
                  style={{
                    backgroundColor: "rgba(201,161,40,0.1)",
                    border: "1px solid rgba(201,161,40,0.2)",
                    color: "#c9a128",
                  }}
                >
                  <Plus className="w-3 h-3" />
                  Create Soldier for This Billet
                </a>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-4 py-4 text-center">
                <p className="text-xs" style={{ color: "#6b6a58" }}>
                  No results for &ldquo;{search}&rdquo;
                </p>
              </div>
            ) : (
              filtered.map((s) => {
                const isLoading = loading === s.id;
                const isRasp = s.unit === "LIONHEART Selection";
                return (
                  <button
                    key={s.id}
                    onClick={() => handleAssign(s)}
                    disabled={!!loading}
                    className="w-full flex items-center gap-3 text-left px-3 py-2.5 transition-colors disabled:opacity-50"
                    style={{ borderBottom: "1px solid #1c2014" }}
                    onMouseEnter={(e) => {
                      if (!loading) e.currentTarget.style.backgroundColor = "rgba(201,161,40,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Rank badge */}
                    <span
                      className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: "#c9a128", backgroundColor: "rgba(201,161,40,0.1)", border: "1px solid rgba(201,161,40,0.15)" }}
                    >
                      {s.rank}
                    </span>

                    {/* Name + unit */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate" style={{ color: "#e8e4d8" }}>
                        {s.name}
                        {s.callsign && (
                          <span className="text-[10px] font-normal ml-1" style={{ color: "#6b6a58" }}>
                            ({s.callsign})
                          </span>
                        )}
                      </p>
                      <p className="text-[9px] truncate" style={{ color: isRasp ? "#f59e0b" : "#4a4838" }}>
                        {isRasp ? "⬡ LIONHEART Selection" : s.unit}
                      </p>
                    </div>

                    {/* Action icon */}
                    <div className="shrink-0">
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#c9a128" }} />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" style={{ color: "#4a4838" }} />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 flex items-center justify-between" style={{ borderTop: "1px solid #1c2014" }}>
            <p className="text-[9px]" style={{ color: "#4a4838" }}>
              {soldiers.length > 0
                ? `${filtered.length} of ${soldiers.length} soldier${soldiers.length !== 1 ? "s" : ""}`
                : "No soldiers on record"}
            </p>
            <a
              href={createUrl}
              className="flex items-center gap-1 text-[9px] font-black tracking-widest uppercase transition-colors"
              style={{ color: "#6b6a58" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#c9a128"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#6b6a58"; }}
            >
              <Plus className="w-2.5 h-2.5" />
              New Soldier
            </a>
          </div>
        </div>
      )}
    </>
  );
}
