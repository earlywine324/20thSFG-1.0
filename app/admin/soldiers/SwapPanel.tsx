"use client";

import { useState, useTransition, useMemo } from "react";
import { ArrowLeftRight, ChevronDown, X, Check, Loader2 } from "lucide-react";
import { swapSoldiers } from "@/app/lib/actions/soldiers";

type SoldierOption = {
  id: string;
  name: string;
  rank: string;
  role: string;
  unit: string;
  team: string | null;
};

function SoldierSelect({
  label,
  value,
  onChange,
  options,
  exclude,
}: {
  label: string;
  value: SoldierOption | null;
  onChange: (s: SoldierOption | null) => void;
  options: SoldierOption[];
  exclude: string | null;
}) {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");

  const filtered = useMemo(() =>
    options
      .filter((o) => o.id !== exclude)
      .filter((o) =>
        query === "" ||
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        o.rank.toLowerCase().includes(query.toLowerCase()) ||
        o.role.toLowerCase().includes(query.toLowerCase()) ||
        (o.team ?? "").toLowerCase().includes(query.toLowerCase())
      ),
    [options, exclude, query]
  );

  function select(s: SoldierOption) {
    onChange(s);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-black tracking-[0.25em] uppercase mb-2" style={{ color: "#6b6a58" }}>{label}</p>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left"
        style={{
          backgroundColor: "#0a0d08",
          border: `1px solid ${value ? "rgba(201,161,40,0.4)" : "#1c2014"}`,
          borderRadius: "4px",
        }}
      >
        {value ? (
          <div className="min-w-0">
            <p className="text-xs font-black truncate" style={{ color: "#e8e4d8" }}>
              {value.rank} {value.name}
            </p>
            <p className="text-[10px] truncate" style={{ color: "#6b6a58" }}>
              {value.role} · {value.team ?? value.unit}
            </p>
          </div>
        ) : (
          <span className="text-xs" style={{ color: "#4a4838" }}>Select soldier…</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "#6b6a58" }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1 w-full overflow-hidden"
          style={{
            backgroundColor: "#0f120a",
            border: "1px solid #1c2014",
            borderRadius: "4px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            maxHeight: "260px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search */}
          <div className="p-2" style={{ borderBottom: "1px solid #1c2014" }}>
            <input
              autoFocus
              type="text"
              placeholder="Search name, rank, role…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-xs outline-none"
              style={{ color: "#e8e4d8", caretColor: "#c9a128" }}
            />
          </div>
          {/* Options */}
          <div className="overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-xs text-center" style={{ color: "#4a4838" }}>No match</p>
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => select(s)}
                  className="w-full text-left px-3 py-2.5 transition-colors"
                  style={{ borderBottom: "1px solid #1c2014" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(201,161,40,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <p className="text-xs font-bold" style={{ color: "#e8e4d8" }}>
                    {s.rank} {s.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "#6b6a58" }}>
                    {s.role} · {s.team ?? s.unit}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SwapPanel({ soldiers }: { soldiers: SoldierOption[] }) {
  const [open, setOpen]       = useState(false);
  const [soldierA, setSoldierA] = useState<SoldierOption | null>(null);
  const [soldierB, setSoldierB] = useState<SoldierOption | null>(null);
  const [result, setResult]   = useState<{ ok: boolean; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const ready = soldierA && soldierB;

  function reset() {
    setSoldierA(null);
    setSoldierB(null);
    setResult(null);
  }

  function handleSwap() {
    if (!soldierA || !soldierB) return;
    setResult(null);
    startTransition(async () => {
      const res = await swapSoldiers(soldierA.id, soldierB.id);
      if (res.error) {
        setResult({ ok: false, msg: res.error });
      } else {
        setResult({ ok: true, msg: `${soldierA.rank} ${soldierA.name} ⇄ ${soldierB.rank} ${soldierB.name} swapped.` });
        setSoldierA(null);
        setSoldierB(null);
      }
    });
  }

  return (
    <div className="mb-6">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); reset(); }}
        className="flex items-center gap-2 px-4 py-2.5 text-xs font-black tracking-widest uppercase transition-all"
        style={{
          backgroundColor: open ? "rgba(77,182,224,0.1)" : "rgba(77,182,224,0.05)",
          border: "1px solid rgba(77,182,224,0.2)",
          borderRadius: "4px",
          color: "#4db6e0",
        }}
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        Swap Soldiers
        {open && <X className="w-3 h-3 ml-1 opacity-60" />}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="mt-3 p-5 rounded-lg"
          style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}
        >
          <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-4" style={{ color: "#6b6a58" }}>
            Select two soldiers to swap billets
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 mb-5">
            {/* Soldier A */}
            <div className="relative flex-1 min-w-0 w-full">
              <SoldierSelect
                label="Soldier A"
                value={soldierA}
                onChange={setSoldierA}
                options={soldiers}
                exclude={soldierB?.id ?? null}
              />
            </div>

            {/* Swap arrow */}
            <div className="flex items-center justify-center sm:mt-7 shrink-0">
              <ArrowLeftRight className="w-4 h-4" style={{ color: "#4db6e0", opacity: ready ? 1 : 0.25 }} />
            </div>

            {/* Soldier B */}
            <div className="relative flex-1 min-w-0 w-full">
              <SoldierSelect
                label="Soldier B"
                value={soldierB}
                onChange={setSoldierB}
                options={soldiers}
                exclude={soldierA?.id ?? null}
              />
            </div>
          </div>

          {/* Preview */}
          {ready && (
            <div
              className="rounded p-4 mb-5 grid sm:grid-cols-2 gap-4"
              style={{ backgroundColor: "rgba(77,182,224,0.04)", border: "1px solid rgba(77,182,224,0.1)" }}
            >
              {[
                { from: soldierA!, to: soldierB! },
                { from: soldierB!, to: soldierA! },
              ].map(({ from, to }) => (
                <div key={from.id}>
                  <p className="text-[9px] font-black tracking-widest uppercase mb-1" style={{ color: "#4db6e0" }}>
                    {from.rank} {from.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "#6b6a58" }}>
                    <span style={{ color: "#8a8870" }}>{from.role}</span>
                    <span style={{ color: "#4a4838" }}> → </span>
                    <span style={{ color: "#8a8870" }}>{to.role}</span>
                  </p>
                  <p className="text-[10px]" style={{ color: "#4a4838" }}>
                    {from.team ?? from.unit} → {to.team ?? to.unit}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Result message */}
          {result && (
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded mb-4"
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

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!ready || pending}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: ready ? "#c9a128" : "rgba(201,161,40,0.1)",
                color: ready ? "#090b07" : "#6b6a58",
                borderRadius: "4px",
              }}
            >
              {pending
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Swapping…</>
                : <><ArrowLeftRight className="w-3.5 h-3.5" /> Execute Swap</>
              }
            </button>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-bold tracking-widest uppercase px-3 py-2.5 transition-colors"
              style={{ color: "#6b6a58" }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
