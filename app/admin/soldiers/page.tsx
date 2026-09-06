import { createClient } from "@/app/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus, UserCheck, UserX, Users, Archive } from "lucide-react";
import { getRankImage } from "@/app/lib/rank-images";
import AdminAssignDropdown from "./AdminAssignDropdown";
import SwapPanel from "./SwapPanel";

type Soldier = Record<string, string & string[]>;

type BilletGroup = {
  title: string;
  subtitle: string;
  color: string;
  billets: Soldier[];
};

/* ── Role priority: leadership roles float to the top ── */
function rolePriority(role: string): number {
  const r = role.toLowerCase();
  if (r.includes("squad leader"))       return 0;
  if (r.includes("team leader"))        return 1;
  if (r.includes("weapons squad leader")) return 0;
  return 2;
}

function sortBillets(billets: Soldier[]): Soldier[] {
  return [...billets].sort((a, b) => {
    const pd = rolePriority(a.role) - rolePriority(b.role);
    if (pd !== 0) return pd;
    return (a.rank as string).localeCompare(b.rank as string);
  });
}

/* ── Build ordered billet groups from flat soldier list ── */
function buildGroups(soldiers: Soldier[]): BilletGroup[] {
  const pick = (fn: (s: Soldier) => boolean) => sortBillets(soldiers.filter(fn));

  const groups: BilletGroup[] = [
    {
      title: "ODA 2011",
      subtitle: "20th Special Forces Group",
      color: "#c9a128",
      billets: pick((s) => s.unit === "20th Special Forces Group" && s.team === "ODA 2011"),
    },
    {
      title: "MH-60M Crew 1",
      subtitle: "160th SOAR (A)",
      color: "#a78bfa",
      billets: pick((s) => s.unit === "160th SOAR (A)" && s.team === "MH-60M Crew 1"),
    },
    {
      title: "Administrative",
      subtitle: "S-Shops",
      color: "#8892a4",
      billets: pick((s) => s.unit === "Administrative"),
    },
    {
      title: "Selection Pipeline",
      subtitle: "Candidates",
      color: "#f59e0b",
      billets: pick((s) => s.unit === "Selection Pipeline"),
    },
  ];

  // Catch-all for anything not matched above
  const matched = new Set(groups.flatMap((g) => g.billets.map((b) => b.id)));
  const other = soldiers.filter((s) => !matched.has(s.id));
  if (other.length > 0) {
    groups.push({ title: "Other", subtitle: "Unassigned Units", color: "#505870", billets: other });
  }

  return groups.filter((g) => g.billets.length > 0);
}

export default async function SoldiersPage() {
  const supabase = await createClient();
  const { data: raw } = await supabase
    .from("soldiers")
    .select("id,name,rank,rank_full,callsign,role,unit,team,status,mos,mos_title,avatar")
    .order("unit")
    .order("team")
    .order("rank");

  const allSoldiers: Soldier[] = (raw as Soldier[]) ?? [];

  // Separate discharged from active roster
  const soldiers   = allSoldiers.filter((s) => s.status !== "DISCHARGED");
  const discharged = allSoldiers
    .filter((s) => s.status === "DISCHARGED")
    .sort((a, b) => (a.name as string).localeCompare(b.name as string));

  const totalActive  = soldiers.filter((s) => s.status === "ACTIVE DUTY").length;
  const totalVacant  = soldiers.filter((s) => s.status === "VACANT").length;
  const totalOther   = soldiers.filter((s) => !["ACTIVE DUTY", "VACANT"].includes(s.status)).length;
  const fillRate     = soldiers.length > 0 ? Math.round((totalActive / soldiers.length) * 100) : 0;

  // Any real soldier (not a vacant billet placeholder) can be assigned/reassigned
  const assignable = soldiers
    .filter((s) => s.status !== "VACANT")
    .map((s) => ({ id: s.id, name: s.name, callsign: s.callsign as string | null, rank: s.rank, unit: s.unit as string }));

  // Swappable: active duty soldiers with a real billet
  const swappable = soldiers
    .filter((s) => s.status === "ACTIVE DUTY")
    .map((s) => ({
      id:   s.id   as string,
      name: s.name as string,
      rank: s.rank as string,
      role: s.role as string,
      unit: s.unit as string,
      team: (s.team as string) || null,
    }))
    .sort((a, b) => (a.team ?? a.unit).localeCompare(b.team ?? b.unit) || a.name.localeCompare(b.name));

  const groups = buildGroups(soldiers);

  return (
    <div className="p-6 lg:p-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-black tracking-[0.35em] uppercase mb-1" style={{ color: "#c9a128" }}>
            Personnel Management
          </p>
          <h1 className="text-3xl font-black" style={{ color: "#e8e4d8" }}>Roster Management</h1>
          <p className="text-xs mt-1" style={{ color: "#6b6a58" }}>
            Click any billet to edit · Use Assign to fill vacant slots
          </p>
        </div>
        <Link
          href="/admin/soldiers/new"
          className="flex items-center gap-2 px-5 py-3 rounded text-xs font-black tracking-widest uppercase shrink-0"
          style={{ backgroundColor: "#c9a128", color: "#090b07" }}
        >
          <Plus className="w-4 h-4" /> Add Soldier
        </Link>
      </div>

      {/* ── Stats bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Active Duty",   value: totalActive, icon: UserCheck, color: "#4ade80" },
          { label: "Vacant Billets", value: totalVacant,  icon: UserX,    color: "#c9a128" },
          { label: "Other Status",   value: totalOther,   icon: Users,    color: "#f59e0b" },
          { label: "Fill Rate",      value: `${fillRate}%`, icon: Users,  color: "#4db6e0" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-lg px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
            <Icon className="w-4 h-4 shrink-0" style={{ color }} />
            <div>
              <p className="text-lg font-black leading-none" style={{ color }}>{value}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: "#6b6a58" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Swap Panel ── */}
      <SwapPanel soldiers={swappable} />

      {/* ── Billet Board ── */}
      {soldiers.length === 0 ? (
        <div className="rounded-lg p-12 text-center" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
          <Users className="w-10 h-10 mx-auto mb-4" style={{ color: "#6b6a58" }} />
          <p className="text-sm mb-6" style={{ color: "#8a8870" }}>No soldiers in database yet.</p>
          <Link href="/admin/soldiers/new"
            className="text-xs font-black tracking-widest uppercase px-5 py-3 rounded inline-block"
            style={{ backgroundColor: "#c9a128", color: "#090b07" }}>
            Add First Soldier
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => {
            const filled  = group.billets.filter((b) => b.status === "ACTIVE DUTY").length;
            const vacant  = group.billets.filter((b) => b.status === "VACANT").length;
            const total   = group.billets.length;

            return (
              <div key={group.title} className="rounded-lg"
                style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>

                {/* Group header */}
                <div className="flex items-center justify-between px-5 py-3"
                  style={{ borderBottom: "1px solid #1c2014", backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
                    <div>
                      <span className="text-xs font-black tracking-widest uppercase" style={{ color: group.color }}>
                        {group.title}
                      </span>
                      <span className="text-[10px] ml-2" style={{ color: "#6b6a58" }}>
                        {group.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold" style={{ color: "#4ade80" }}>
                      {filled} filled
                    </span>
                    {vacant > 0 && (
                      <span className="text-[10px] font-bold" style={{ color: "#c9a128" }}>
                        {vacant} vacant
                      </span>
                    )}
                    <span className="text-[10px]" style={{ color: "#6b6a58" }}>
                      / {total} total
                    </span>
                    {/* Fill bar */}
                    <div className="w-20 h-1 rounded-full overflow-hidden hidden sm:block"
                      style={{ backgroundColor: "#1c2014" }}>
                      <div className="h-full rounded-full"
                        style={{
                          width: total > 0 ? `${(filled / total) * 100}%` : "0%",
                          backgroundColor: filled === total ? "#4ade80" : group.color,
                        }} />
                    </div>
                  </div>
                </div>

                {/* Billet rows */}
                <div className="divide-y divide-[#1c2014]">
                  {group.billets.map((billet) => {
                    const isVacant = billet.status === "VACANT";
                    const isActive = billet.status === "ACTIVE DUTY";
                    const rankImg  = getRankImage(billet.rank);

                    return (
                      // IMPORTANT: No opacity on this container — opacity < 1 creates a stacking context
                      // that traps the position:fixed dropdown and lets sibling rows paint over it.
                      // Instead, dimming is applied to each child element individually.
                      <div key={billet.id} className="flex items-center gap-4 px-5 py-3">

                        {/* Rank insignia */}
                        <div
                          className="w-9 h-9 rounded flex items-center justify-center shrink-0 overflow-hidden"
                          style={{
                            opacity: isVacant ? 0.5 : 1,
                            backgroundColor: isVacant ? "rgba(107,106,88,0.06)" : "rgba(201,161,40,0.06)",
                            border: `1px solid ${isVacant ? "rgba(107,106,88,0.15)" : "rgba(201,161,40,0.2)"}`,
                          }}>
                          {rankImg ? (
                            <Image src={rankImg} alt={billet.rank} width={22} height={22} className="object-contain" />
                          ) : (
                            <span className="text-[9px] font-black" style={{ color: isVacant ? "#6b6a58" : "#c9a128" }}>
                              {billet.rank}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0" style={{ opacity: isVacant ? 0.5 : 1 }}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black" style={{ color: isVacant ? "#6b6a58" : "#e8e4d8" }}>
                              {billet.rank}
                            </span>
                            <span className="text-xs font-bold" style={{ color: isVacant ? "#4a4838" : "#e8e4d8" }}>
                              {isVacant ? "——" : billet.name}
                            </span>
                            {!isVacant && billet.callsign && (
                              <span className="text-[10px]" style={{ color: "#6b6a58" }}>
                                ({billet.callsign})
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] mt-0.5" style={{ color: "#6b6a58" }}>
                            {billet.role}
                            {billet.mos && billet.mos !== "N/A" && (
                              <span style={{ color: "#4a4838" }}> · {billet.mos} {billet.mos_title}</span>
                            )}
                          </p>
                        </div>

                        {/* Status badge */}
                        <span
                          className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded shrink-0"
                          style={{
                            opacity:         isVacant ? 0.5 : 1,
                            color:           isActive ? "#4ade80" : isVacant ? "#6b6a58" : "#f59e0b",
                            backgroundColor: isActive ? "rgba(74,222,128,0.08)" : isVacant ? "rgba(107,106,88,0.08)" : "rgba(245,158,11,0.08)",
                          }}>
                          {isVacant ? "VACANT" : billet.status}
                        </span>

                        {/* Actions — NOT dimmed so dropdown z-index is unaffected */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isVacant ? (
                            <AdminAssignDropdown
                              billetId={billet.id}
                              soldiers={assignable}
                              billetRole={billet.role}
                              billetUnit={billet.unit}
                              billetTeam={billet.team}
                            />
                          ) : (
                            <Link
                              href={`/admin/soldiers/${billet.id}`}
                              className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded transition-colors"
                              style={{
                                color: "#8a8870",
                                backgroundColor: "rgba(138,136,112,0.06)",
                                border: "1px solid rgba(138,136,112,0.12)",
                              }}
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Discharged Personnel Archive ── */}
      {discharged.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="w-4 h-4" style={{ color: "#6b6a58" }} />
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: "#6b6a58" }}>
              Discharged Personnel — {discharged.length}
            </p>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
            <div className="divide-y divide-[#1c2014]">
              {discharged.map((s) => {
                const rankImg = getRankImage(s.rank);
                return (
                  <div key={s.id} className="flex items-center gap-4 px-5 py-3" style={{ opacity: 0.6 }}>
                    <div className="w-9 h-9 rounded flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: "rgba(107,106,88,0.06)", border: "1px solid rgba(107,106,88,0.15)" }}>
                      {rankImg ? (
                        <Image src={rankImg} alt={s.rank} width={22} height={22} className="object-contain grayscale" />
                      ) : (
                        <span className="text-[9px] font-black" style={{ color: "#6b6a58" }}>{s.rank}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black" style={{ color: "#8a8870" }}>
                        {s.rank} {s.name}
                      </p>
                      <p className="text-[10px]" style={{ color: "#4a4838" }}>
                        {s.mos} · {s.mos_title || "—"}
                      </p>
                    </div>
                    <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded shrink-0"
                      style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      DISCHARGED
                    </span>
                    <Link
                      href={`/admin/soldiers/${s.id}`}
                      className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded shrink-0"
                      style={{ color: "#8a8870", backgroundColor: "rgba(138,136,112,0.06)", border: "1px solid rgba(138,136,112,0.12)" }}
                    >
                      View
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
