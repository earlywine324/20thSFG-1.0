import Link from "next/link";
import Image from "next/image";
import { Shield, GraduationCap, Star, Users } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { getRankImage } from "@/app/lib/rank-images";
import { rankOrder } from "@/app/lib/rank-order";
import AssignDropdown from "./components/AssignDropdown";
import { getViewRole } from "@/app/lib/preview";

/* ─── TYPES ─── */
type Soldier = {
  id: string; rank: string; rank_full: string; name: string;
  callsign: string | null; positional_callsign: string | null;
  mos: string; mos_title: string;
  role: string; unit: string; team: string | null;
  status: string; quals: string[]; staff_teams: string[]; avatar: string;
};
type Trainee = { id: string; name: string; callsign: string | null; rank: string };

/* ─── COLOR TOKENS ─── */
const C = {
  bg:      "#07090c",
  surface: "#0d1117",
  surf2:   "#161b22",
  border:  "#21262d",
  text:    "#e6edf3",
  muted:   "#8b949e",
  dim:     "#484f58",
  gold:    "#d29922",
  green:   "#3fb950",
  blue:    "#58a6ff",
  amber:   "#f0883e",
  teal:    "#39d0d8",
} as const;


/* ═══════════════════════════════════════
   ROSTER ROW
═══════════════════════════════════════ */
function RosterRow({
  soldier, admin, assignable, echelonColor,
}: {
  soldier: Soldier; admin: boolean; assignable: Trainee[]; echelonColor: string;
}) {
  const isVacant = soldier.status === "VACANT";
  const isActive = soldier.status === "ACTIVE DUTY";
  const rankImg  = getRankImage(soldier.rank);

  const inner = (
    <div
      className={`flex items-center gap-3 px-4 transition-colors ${!isVacant ? "hover:bg-[rgba(88,166,255,0.04)]" : ""}`}
      style={{
        minHeight: 56,
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      {/* ── Rank image ── */}
      <div
        className="shrink-0 flex items-center justify-center rounded-lg overflow-hidden"
        style={{
          width: 38, height: 38,
          background: isVacant ? "rgba(72,79,88,.08)" : `${echelonColor}12`,
          border:     `1px solid ${isVacant ? C.border : echelonColor + "35"}`,
        }}
      >
        {rankImg ? (
          <Image
            src={rankImg} alt={soldier.rank} width={26} height={26}
            className="object-contain"
            style={{ filter: isVacant ? "grayscale(1) opacity(0.3)" : "drop-shadow(0 0 4px rgba(255,255,255,.08))" }}
          />
        ) : (
          <span className="text-[9px] font-black font-mono"
            style={{ color: isVacant ? C.dim : echelonColor }}>
            {soldier.rank}
          </span>
        )}
      </div>

      {/* ── Name ── */}
      <div className="shrink-0" style={{ width: 168 }}>
        <div className="text-sm font-semibold truncate"
          style={{ color: isVacant ? C.dim : C.text, fontStyle: isVacant ? "italic" : "normal" }}>
          {isVacant ? "— Vacant Billet —" : soldier.name}
        </div>
        {!isVacant && soldier.callsign && (
          <div className="text-[10px] font-mono truncate" style={{ color: C.muted }}>
            {soldier.callsign}
          </div>
        )}
      </div>

      {/* ── Role / MOS ── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {soldier.positional_callsign && (
            <span
              className="shrink-0 text-[9px] font-black font-mono tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: isVacant ? C.dim : echelonColor,
                background: isVacant ? "rgba(72,79,88,.08)" : `${echelonColor}14`,
                border: `1px solid ${isVacant ? C.border : echelonColor + "30"}`,
              }}
            >
              {soldier.positional_callsign}
            </span>
          )}
          <span className="text-sm font-medium truncate" style={{ color: isVacant ? C.dim : C.text }}>
            {soldier.role}
          </span>
        </div>
        {soldier.mos && soldier.mos !== "N/A" && (
          <div className="text-[10px] font-mono truncate mt-0.5" style={{ color: C.muted }}>
            {soldier.mos}{soldier.mos_title ? ` · ${soldier.mos_title}` : ""}
          </div>
        )}
      </div>

      {/* ── Status ── */}
      <div className="shrink-0 flex justify-end" style={{ width: 100 }}>
        {isActive && (
          <span className="flex items-center gap-1.5 text-[9px] font-black font-mono tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{ color: C.green, background: "rgba(63,185,80,.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: C.green, boxShadow: `0 0 5px ${C.green}` }} />
            Active
          </span>
        )}
        {isVacant && (
          <span className="flex items-center gap-1.5 text-[9px] font-black font-mono tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{ color: C.dim, background: "rgba(72,79,88,.08)" }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.dim }} />
            Vacant
          </span>
        )}
        {!isActive && !isVacant && (
          <span className="flex items-center gap-1.5 text-[9px] font-black font-mono tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{ color: C.amber, background: "rgba(240,136,62,.1)" }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: C.amber, boxShadow: `0 0 5px ${C.amber}` }} />
            {soldier.status}
          </span>
        )}
      </div>

      {/* ── Admin actions ── */}
      {admin && (
        <div className="shrink-0 flex justify-end" style={{ width: 90 }}>
          {isVacant
            ? <AssignDropdown billetId={soldier.id} soldiers={assignable} />
            : <span className="text-[10px] font-mono" style={{ color: C.dim }}>Edit →</span>
          }
        </div>
      )}
    </div>
  );

  if (isVacant) return <div key={soldier.id}>{inner}</div>;
  return (
    <Link href={`/roster/${soldier.id}`} key={soldier.id} className="block">
      {inner}
    </Link>
  );
}

/* ═══════════════════════════════════════
   ROSTER TABLE  (header + rows)
═══════════════════════════════════════ */
function RosterTable({
  soldiers, admin, assignable, echelonColor,
}: {
  soldiers: Soldier[]; admin: boolean; assignable: Trainee[]; echelonColor: string;
}) {
  if (soldiers.length === 0) return null;
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      {/* column headers */}
      <div className="flex items-center gap-3 px-4 py-2.5"
        style={{ background: C.surf2, borderBottom: `1px solid ${C.border}` }}>
        <div className="shrink-0 text-[9px] font-black font-mono tracking-widest uppercase" style={{ width: 38, color: C.dim }}>Rank</div>
        <div className="shrink-0 text-[9px] font-black font-mono tracking-widest uppercase" style={{ width: 168, color: C.dim }}>Name</div>
        <div className="flex-1 text-[9px] font-black font-mono tracking-widest uppercase" style={{ color: C.dim }}>Role / Position</div>
        <div className="shrink-0 text-right text-[9px] font-black font-mono tracking-widest uppercase" style={{ width: 100, color: C.dim }}>Status</div>
        {admin && <div className="shrink-0" style={{ width: 90 }} />}
      </div>
      {/* rows */}
      {soldiers.map(s => (
        <RosterRow key={s.id} soldier={s} admin={admin} assignable={assignable} echelonColor={echelonColor} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════ */
function SectionHeader({
  tag, icon, title, subtitle, filled, total, color,
}: {
  tag: string; icon?: React.ReactNode; title: string; subtitle: string;
  filled: number; total: number; color: string;
}) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-4"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <span className="flex items-center gap-1.5 shrink-0 text-[8px] font-black font-mono tracking-[.18em] uppercase px-2 py-1 rounded"
        style={{ color, background: `${color}14`, border: `1px solid ${color}28` }}>
        {icon}{tag}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate" style={{ color: C.text }}>{title}</div>
        <div className="text-[10px] font-mono truncate" style={{ color: C.muted }}>{subtitle}</div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-black font-mono" style={{ color: C.muted }}>
          <span style={{ color: C.text }}>{filled}</span> / {total}
        </span>
        <div className="hidden sm:block w-16 h-1 rounded-full overflow-hidden" style={{ background: C.border }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ELEMENT DIVIDER  (squad / team label)
═══════════════════════════════════════ */
function ElemDivider({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 mt-6">
      <span className="text-[10px] font-black font-mono tracking-[.12em] uppercase whitespace-nowrap"
        style={{ color }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: C.border }} />
      <span className="text-[9px] font-mono whitespace-nowrap" style={{ color: C.dim }}>
        {count} {count === 1 ? "billet" : "billets"}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════
   FIRETEAM DIVIDER  (sub-label inside squad)
═══════════════════════════════════════ */
function FireteamDivider({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 mt-4 mb-2 px-1">
      <span className="text-[8px] font-black font-mono tracking-[.18em] uppercase whitespace-nowrap px-1.5 py-0.5 rounded"
        style={{ color, background: `${color}12`, border: `1px solid ${color}25` }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: C.border }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   SQUAD WITH FIRETEAMS
   Groups soldiers by positional_callsign suffix:
   A = Alpha · B = Bravo · C = Charlie
   Weapons callsigns (G-T1/2/3, 1-5) use full label.
   Soldiers without a fireteam suffix (SL etc.) float top.
═══════════════════════════════════════ */
const FIRETEAM_ORDER = ["Alpha", "Bravo", "Charlie", "G-T1", "G-T2", "G-T3", "AT Team"];

function getFireteamLabel(callsign: string | null): string | null {
  if (!callsign) return null;
  if (/A$/i.test(callsign)) return "Alpha";
  if (/B$/i.test(callsign)) return "Bravo";
  if (/C$/i.test(callsign)) return "Charlie";
  if (/^G-T\d+$/i.test(callsign)) return callsign.toUpperCase();
  if (callsign === "1-5") return "AT Team";
  return null;
}

function SquadWithFireteams({
  soldiers, admin, assignable, echelonColor,
}: {
  soldiers: Soldier[]; admin: boolean; assignable: Trainee[]; echelonColor: string;
}) {
  const leaders  = soldiers.filter(s => !getFireteamLabel(s.positional_callsign));
  const ftMap    = new Map<string, Soldier[]>();

  soldiers
    .filter(s => getFireteamLabel(s.positional_callsign))
    .forEach(s => {
      const ft = getFireteamLabel(s.positional_callsign)!;
      if (!ftMap.has(ft)) ftMap.set(ft, []);
      ftMap.get(ft)!.push(s);
    });

  const fireteams = [...ftMap.entries()].sort(([a], [b]) => {
    const ai = FIRETEAM_ORDER.indexOf(a);
    const bi = FIRETEAM_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  // No positional callsigns set yet — render flat
  if (fireteams.length === 0) {
    return <RosterTable soldiers={soldiers} admin={admin} assignable={assignable} echelonColor={echelonColor} />;
  }

  return (
    <div>
      {/* Squad Leader / no-fireteam billets first */}
      {leaders.length > 0 && (
        <RosterTable soldiers={leaders} admin={admin} assignable={assignable} echelonColor={echelonColor} />
      )}
      {/* Fireteam sub-groups */}
      {fireteams.map(([label, members]) => (
        <div key={label}>
          <FireteamDivider label={label} color={echelonColor} />
          <RosterTable soldiers={members} admin={admin} assignable={assignable} echelonColor={echelonColor} />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   CHAIN OF COMMAND NODE
═══════════════════════════════════════ */
function CmdNode({
  abbr, rankAbbr, name, roleLabel, filled, rankImg,
}: {
  abbr: string; rankAbbr: string; name: string; roleLabel: string; filled: boolean; rankImg: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0" style={{ width: 86 }}>
      {/* ring */}
      <div className="relative w-11 h-11 rounded-full flex items-center justify-center"
        style={{
          background: filled ? `rgba(${abbr === 'PLT' || abbr === 'SL1' ? "88,166,255" : "210,153,34"},.1)` : "rgba(72,79,88,.1)",
          border: `2px solid ${filled ? (abbr === 'PLT' || abbr === 'SL1' ? C.blue : C.gold) : C.dim}`,
          opacity: filled ? 1 : 0.45,
        }}>
        {rankImg && filled ? (
          <Image src={rankImg} alt={rankAbbr} width={24} height={24} className="object-contain" />
        ) : (
          <span className="text-[9px] font-black font-mono"
            style={{ color: filled ? C.gold : C.dim }}>{abbr}</span>
        )}
        {filled && (
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
            style={{ background: C.green, border: `2px solid ${C.bg}` }}>
            <span className="w-1 h-1 rounded-full" style={{ background: "#fff" }} />
          </span>
        )}
      </div>
      <div className="text-[9px] font-black font-mono text-center" style={{ color: filled ? C.gold : C.dim }}>{rankAbbr}</div>
      <div className="text-[10px] font-semibold text-center leading-tight max-w-[80px]"
        style={{ color: filled ? C.text : C.dim }}>
        {filled ? name : "Vacant"}
      </div>
      <div className="text-[8px] font-mono text-center uppercase tracking-wide leading-tight"
        style={{ color: C.muted }}>{roleLabel}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PAGE
═══════════════════════════════════════ */
export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params    = await searchParams;
  const activeTab = params.tab === "admin" ? "admin" : "roster";

  const supabase  = await createClient();
  const { data: allSoldiers } = await supabase
    .from("soldiers")
    .select("id,rank,rank_full,name,callsign,positional_callsign,mos,mos_title,role,unit,team,status,quals,staff_teams,avatar")
    .neq("status", "DISCHARGED");

  const soldiers: Soldier[] = (allSoldiers || []).sort((a, b) => rankOrder(a.rank) - rankOrder(b.rank));
  const viewRole = await getViewRole();
  const admin = viewRole === "admin";

  /* ── Grouping ── */
  const bnHQ    = soldiers.filter(s => s.unit === "Battalion HQ");
  const coHQ    = soldiers.filter(s => s.unit === "Alpha Company, 1/75th RGR" && s.team === "Company HQ");
  const pltHQ   = soldiers.filter(s => s.unit === "Platoon HQ");
  const squad1  = soldiers.filter(s => s.unit === "Alpha Company, 1/75th RGR" && s.team === "1st Squad");
  const squad2  = soldiers.filter(s => s.unit === "Alpha Company, 1/75th RGR" && s.team === "2nd Squad");
  const squad3  = soldiers.filter(s => s.unit === "Alpha Company, 1/75th RGR" && s.team === "3rd Squad");
  const weapons = soldiers.filter(s => s.unit === "Alpha Company, 1/75th RGR" && s.team === "Weapons Squad");
  const coOther = soldiers.filter(s =>
    s.unit === "Alpha Company, 1/75th RGR" &&
    !["Company HQ","1st Squad","2nd Squad","3rd Squad","Weapons Squad"].includes(s.team ?? "")
  );
  const soar    = soldiers.filter(s => s.unit === "160th SOAR");
  const rasp    = soldiers.filter(s => s.unit === "RASP Pipeline" && s.status !== "VACANT");
  // A soldier appears in admin if their primary unit is Administrative OR they have staff_teams entries
  const adminSoldiers = soldiers.filter(s =>
    s.unit === "Administrative" || (s.staff_teams && s.staff_teams.length > 0)
  );

  /* ── Assignable ── */
  const assignable: Trainee[] = soldiers
    .filter(s => s.status !== "VACANT")
    .map(s => ({ id: s.id, name: s.name, callsign: s.callsign, rank: s.rank }));

  /* ── Strength ── */
  const nonRasp     = soldiers.filter(s => s.unit !== "RASP Pipeline" && s.unit !== "Administrative");
  const totalBillets = nonRasp.length;
  const activeDuty   = nonRasp.filter(s => s.status === "ACTIVE DUTY").length;
  const vacantCount  = nonRasp.filter(s => s.status === "VACANT").length;
  const fillPct      = totalBillets > 0 ? Math.round((activeDuty / totalBillets) * 100) : 0;

  const pltTotal  = [pltHQ, squad1, squad2, squad3, weapons, coOther].flat().length;
  const coTotal   = coHQ.length + pltTotal;
  const coFilled  = [coHQ, pltHQ, squad1, squad2, squad3, weapons, coOther].flat().filter(s => s.status === "ACTIVE DUTY").length;
  const pltFilled = [pltHQ, squad1, squad2, squad3, weapons, coOther].flat().filter(s => s.status === "ACTIVE DUTY").length;

  /* ── Chain of command lookup ── */
  const find = (role: string, team?: string) =>
    soldiers.find(s => s.role === role && s.status === "ACTIVE DUTY" && (team ? s.team === team : true));

  const cmdChain: { abbr: string; roleLabel: string; soldier: Soldier | undefined }[] = [
    { abbr: "CO",  roleLabel: "Cdr",       soldier: find("Company Commander") },
    { abbr: "1SG", roleLabel: "First Sgt", soldier: find("First Sergeant") },
    { abbr: "PLT", roleLabel: "Plt Ldr",   soldier: find("Platoon Leader") },
    { abbr: "PSG", roleLabel: "Plt Sgt",   soldier: find("Platoon Sergeant") },
    { abbr: "SL1", roleLabel: "1st SL",    soldier: find("Squad Leader", "1st Squad") },
    { abbr: "SL2", roleLabel: "2nd SL",    soldier: find("Squad Leader", "2nd Squad") },
    { abbr: "SL3", roleLabel: "3rd SL",    soldier: find("Squad Leader", "3rd Squad") },
    { abbr: "SL4", roleLabel: "4th SL",
      soldier: find("Squad Leader", "Weapons Squad")
        ?? find("Weapons Squad Leader")
        ?? soldiers.find(s =>
            s.team === "Weapons Squad" &&
            s.status === "ACTIVE DUTY" &&
            s.role.toLowerCase().includes("leader")
          ),
    },
  ];

  /* ── Admin sections ── */
  const ADMIN_SECTIONS = [
    { tag: "S1", label: "Recruiting and Retention",           subtitle: "Personnel · Manpower · Enlistment",       team: "S1 - Recruiting and Retention",        color: C.blue },
    { tag: "S2", label: "Intelligence",                       subtitle: "SIGINT · OSINT · Threat Analysis",        team: "S2 - Intelligence",                    color: "#e04d4d" },
    { tag: "S3", label: "Operations — Force Improvement",     subtitle: "Training · Doctrine · FIG",               team: "S3 - Force Improvement Group",          color: C.gold },
    { tag: "S4", label: "Logistics — Base Maintenance",       subtitle: "Supply · Maintenance · Facilities",       team: "S4 - Base Maintenance Operations",      color: "#6a9e5f" },
    { tag: "S4", label: "Logistics — Combat Imaging",         subtitle: "Photography · Video · After-Action Media",team: "S4 - Combat Imaging & Documentation",   color: "#6a9e5f" },
    { tag: "S6", label: "Communications — Public Affairs",    subtitle: "PAO · Social Media · Recruitment Media",  team: "S6 - Public Affairs Office",           color: "#9b78e0" },
  ] as const;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>

      {/* ══ PAGE HEADER ══ */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-screen-xl mx-auto px-6 pt-8 pb-0">

          <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
            {/* Unit ID */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 font-black font-mono text-[11px] leading-tight text-center"
                style={{ background: `rgba(210,153,34,.08)`, border: `1px solid rgba(210,153,34,.25)`, color: C.gold }}>
                1/75<br/>RGR
              </div>
              <div>
                <h1 className="text-2xl font-black" style={{ color: C.text }}>Unit Roster</h1>
                <p className="text-sm mt-0.5" style={{ color: C.muted }}>
                  1st Platoon · Alpha Company · 1st Battalion, 75th Ranger Regiment
                </p>
                <span className="inline-block mt-1.5 text-[9px] font-black font-mono tracking-[.2em] uppercase px-2 py-0.5 rounded"
                  style={{ color: C.gold, background: "rgba(210,153,34,.1)", border: "1px solid rgba(210,153,34,.2)" }}>
                  Outlaws · Rangers Lead the Way
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-2">
              {[
                { val: totalBillets, lbl: "Total Billets",    color: C.muted },
                { val: activeDuty,   lbl: "Present for Duty", color: C.green },
                { val: vacantCount,  lbl: "Vacant Billets",   color: C.gold },
                { val: rasp.length,  lbl: "In RASP",          color: C.amber },
              ].map(({ val, lbl, color }) => (
                <div key={lbl} className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
                  style={{ background: C.surf2, border: `1px solid ${C.border}` }}>
                  <span className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: color, boxShadow: color !== C.gold && color !== C.muted ? `0 0 6px ${color}` : undefined }} />
                  <div>
                    <div className="text-xl font-black leading-none" style={{ color }}>{val}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: C.muted }}>{lbl}</div>
                  </div>
                </div>
              ))}
              {/* Fill rate */}
              <div className="flex flex-col justify-center px-4 py-2.5 rounded-lg min-w-[140px]"
                style={{ background: C.surf2, border: `1px solid ${C.border}` }}>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black" style={{ color: C.blue }}>{fillPct}%</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Strength</span>
                </div>
                <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: C.border }}>
                  <div className="h-full rounded-full" style={{ width: `${fillPct}%`, background: C.blue }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex overflow-x-auto" style={{ borderTop: `1px solid ${C.border}` }}>
            {[
              { label: "Unit Roster",          tab: "roster", count: totalBillets },
              { label: "Administrative",        tab: "admin",  count: adminSoldiers.length },
            ].map(({ label, tab, count }) => (
              <Link key={tab} href={tab === "roster" ? "/roster" : "/roster?tab=admin"}
                className="shrink-0 flex items-center gap-2 px-5 py-3.5 text-[11px] font-bold tracking-wide transition-colors"
                style={{
                  color: activeTab === tab ? C.text : C.muted,
                  borderTop: `2px solid ${activeTab === tab ? C.gold : "transparent"}`,
                  marginTop: -1,
                  background: activeTab === tab ? "rgba(210,153,34,.04)" : "transparent",
                }}>
                <Shield className="w-3.5 h-3.5" style={{ opacity: .7 }} />
                {label}
                <span className="text-[9px] font-black font-mono px-1.5 py-0.5 rounded"
                  style={{ background: C.surf2, border: `1px solid ${C.border}`, color: C.dim }}>
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* ══ TAB: UNIT ROSTER ══ */}
        {activeTab === "roster" && (
          <div>

            {/* ── Chain of Command ── */}
            <div className="rounded-lg p-5 mb-8" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[9px] font-black font-mono tracking-[.2em] uppercase" style={{ color: C.dim }}>
                  Chain of Command
                </span>
                <div className="flex-1 h-px" style={{ background: C.border }} />
              </div>
              <div className="flex items-start overflow-x-auto gap-0 pb-1">
                {cmdChain.map((node, i) => (
                  <div key={node.abbr} className="flex items-start">
                    <CmdNode
                      abbr={node.abbr}
                      rankAbbr={node.soldier?.rank ?? (node.abbr === "CO" ? "CPT" : node.abbr === "1SG" ? "1SG" : node.abbr === "PLT" ? "2LT" : node.abbr === "PSG" ? "SFC" : "SSG")}
                      name={node.soldier?.name ?? "Vacant"}
                      roleLabel={node.roleLabel}
                      filled={!!node.soldier}
                      rankImg={node.soldier ? getRankImage(node.soldier.rank) : null}
                    />
                    {i < cmdChain.length - 1 && (
                      <div className="shrink-0 h-px mt-[22px] mx-1" style={{ width: 20, background: C.border }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Battalion HQ ── */}
            {bnHQ.length > 0 && (
              <div className="mb-8">
                <SectionHeader
                  tag="BN" title="1st Battalion, 75th Ranger Regiment"
                  subtitle="Fort Moore, GA · 1/75th RGR"
                  filled={bnHQ.filter(s => s.status === "ACTIVE DUTY").length}
                  total={bnHQ.length} color={C.gold}
                />
                <RosterTable soldiers={bnHQ} admin={admin} assignable={assignable} echelonColor={C.gold} />
              </div>
            )}

            {/* ── Alpha Company ── */}
            <div className="pl-4 sm:pl-6" style={{ borderLeft: `2px solid rgba(210,153,34,.2)` }}>
              <SectionHeader
                tag="CO" title="Alpha Company"
                subtitle="A Co · 1/75th RGR · Outlaws"
                filled={coFilled} total={coTotal} color={C.gold}
              />

              {coHQ.length > 0 && (
                <div className="mb-6">
                  <ElemDivider label="Company HQ" count={coHQ.length} color={C.gold} />
                  <RosterTable soldiers={coHQ} admin={admin} assignable={assignable} echelonColor={C.gold} />
                </div>
              )}

              {/* ── 1st Platoon ── */}
              <div className="pl-4 sm:pl-6 mt-4" style={{ borderLeft: `2px solid rgba(88,166,255,.2)` }}>
                <SectionHeader
                  tag="PLT" title="1st Platoon — Outlaws"
                  subtitle="1st Plt · A Co · 1/75th RGR"
                  filled={pltFilled} total={pltTotal} color={C.blue}
                />

                {pltHQ.length > 0 && (
                  <div className="mb-6">
                    <ElemDivider label="Platoon HQ" count={pltHQ.length} color={C.blue} />
                    <RosterTable soldiers={pltHQ} admin={admin} assignable={assignable} echelonColor={C.blue} />
                  </div>
                )}

                {/* Squads */}
                <div className="pl-4 sm:pl-6 mt-4" style={{ borderLeft: `2px solid rgba(57,208,216,.2)` }}>

                  {squad1.length > 0 && (
                    <div className="mb-6">
                      <ElemDivider label="1st Squad · Alpha" count={squad1.length} color={C.teal} />
                      <SquadWithFireteams soldiers={squad1} admin={admin} assignable={assignable} echelonColor={C.teal} />
                    </div>
                  )}

                  {squad2.length > 0 && (
                    <div className="mb-6">
                      <ElemDivider label="2nd Squad · Bravo" count={squad2.length} color={C.teal} />
                      <SquadWithFireteams soldiers={squad2} admin={admin} assignable={assignable} echelonColor={C.teal} />
                    </div>
                  )}

                  {squad3.length > 0 && (
                    <div className="mb-6">
                      <ElemDivider label="3rd Squad · Charlie" count={squad3.length} color={C.teal} />
                      <SquadWithFireteams soldiers={squad3} admin={admin} assignable={assignable} echelonColor={C.teal} />
                    </div>
                  )}

                  {weapons.length > 0 && (
                    <div className="mb-6">
                      <ElemDivider label="4th Squad · Weapons" count={weapons.length} color={C.teal} />
                      <SquadWithFireteams soldiers={weapons} admin={admin} assignable={assignable} echelonColor={C.teal} />
                    </div>
                  )}

                  {coOther.length > 0 && (
                    <div className="mb-6">
                      <ElemDivider label="Unassigned · Alpha Company" count={coOther.length} color={C.dim} />
                      <RosterTable soldiers={coOther} admin={admin} assignable={assignable} echelonColor={C.dim} />
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* ── 160th SOAR ── (closed — change false to soar.length > 0 to reopen) */}
            {false && (
              <div className="mt-12 pt-10" style={{ borderTop: `1px solid ${C.border}` }}>
                <SectionHeader
                  tag="SOAR" title="160th Special Operations Aviation Regiment"
                  subtitle="Night Stalkers · Task Force Aviation"
                  filled={soar.filter(s => s.status === "ACTIVE DUTY").length}
                  total={soar.length} color="#9b78e0"
                />
                <div className="pl-4 sm:pl-6" style={{ borderLeft: "2px solid rgba(155,120,224,.2)" }}>
                  {(["Command Element","MH-60 Crew 1","MH-60 Crew 2"] as const).map(team => {
                    const crew = soar.filter(s => s.team === team);
                    if (!crew.length) return null;
                    return (
                      <div key={team} className="mb-6">
                        <ElemDivider label={team} count={crew.length} color="#9b78e0" />
                        <RosterTable soldiers={crew} admin={admin} assignable={assignable} echelonColor="#9b78e0" />
                      </div>
                    );
                  })}
                  {(() => {
                    const rest = soar.filter(s => !["Command Element","MH-60 Crew 1","MH-60 Crew 2"].includes(s.team ?? ""));
                    if (!rest.length) return null;
                    return (
                      <div className="mb-6">
                        <ElemDivider label="Unassigned · 160th SOAR" count={rest.length} color={C.dim} />
                        <RosterTable soldiers={rest} admin={admin} assignable={assignable} echelonColor={C.dim} />
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* ── RASP Pipeline ── */}
            {rasp.length > 0 && (
              <div className="mt-12 pt-10" style={{ borderTop: `1px solid ${C.border}` }}>
                <SectionHeader
                  tag="RASP" title="Ranger Assessment & Selection Program"
                  subtitle="Pre-Assignment Pipeline · Awaiting Billet Assignment"
                  filled={rasp.length} total={rasp.length} color={C.amber}
                />
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {rasp.map(s => {
                    const rImg = getRankImage(s.rank);
                    return (
                      <Link key={s.id} href={`/roster/${s.id}`} className="block">
                        <div className="rounded-lg overflow-hidden transition-colors hover:border-amber-400/30"
                          style={{ background: C.surface, border: `1px solid ${C.border}`, position: "relative" }}>
                          <div className="h-0.5" style={{ background: `linear-gradient(90deg,${C.amber},transparent)` }} />
                          <div className="p-4 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                              style={{ background: "rgba(240,136,62,.1)", border: "1px solid rgba(240,136,62,.25)" }}>
                              {rImg
                                ? <Image src={rImg} alt={s.rank} width={24} height={24} className="object-contain" />
                                : <span className="text-[9px] font-black font-mono" style={{ color: C.amber }}>{s.rank}</span>
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[9px] font-black font-mono tracking-wider uppercase mb-1" style={{ color: C.amber }}>{s.rank}</div>
                              <div className="text-sm font-bold truncate" style={{ color: C.text }}>{s.name}</div>
                              {s.callsign && <div className="text-[10px] font-mono truncate" style={{ color: C.muted }}>{s.callsign}</div>}
                              <div className="text-xs font-medium mt-1" style={{ color: C.amber }}>{s.role}</div>
                            </div>
                            <span className="text-[8px] font-black font-mono tracking-wider uppercase px-2 py-0.5 rounded-full"
                              style={{ color: C.amber, background: "rgba(240,136,62,.1)", border: "1px solid rgba(240,136,62,.2)" }}>
                              RASP
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Wall of Honor ── */}
            <div className="mt-12 pt-10" style={{ borderTop: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-3 mb-5">
                <Star className="w-4 h-4" style={{ color: C.gold }} />
                <h2 className="text-lg font-black" style={{ color: C.text }}>Wall of Honor</h2>
                <div className="flex-1 h-px" style={{ background: C.border }} />
              </div>
              <div className="rounded-lg p-12 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <Star className="w-7 h-7 mx-auto mb-3" style={{ color: C.border }} />
                <p className="text-sm italic" style={{ color: C.dim }}>
                  This wall honors Rangers who have served with distinction in 1st Platoon, A Co, 1/75th RGR.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ══ TAB: ADMINISTRATIVE ══ */}
        {activeTab === "admin" && (
          <div>
            {/* Intro */}
            <div className="mb-10">
              <SectionHeader
                tag="STAFF" title="Administrative Positions"
                subtitle="1/75th RGR · Staff Billets · S1 through S6"
                filled={adminSoldiers.filter(s => s.status === "ACTIVE DUTY").length}
                total={adminSoldiers.length} color={C.gold}
              />
              <p className="text-sm mt-3" style={{ color: C.muted, maxWidth: 640 }}>
                Staff sections manage the administrative, operational, and support functions of 1st Platoon, A Co, 1/75th RGR. These billets are filled by Rangers who hold both a line position and a staff duty.
              </p>
            </div>

            <div className="space-y-10">
              {ADMIN_SECTIONS.map(sec => {
                const members = soldiers.filter(s =>
                  (s.unit === "Administrative" && s.team === sec.team) ||
                  (s.staff_teams && s.staff_teams.includes(sec.team))
                );
                return (
                  <div key={sec.team}>
                    <div className="flex items-start gap-4 pb-5 mb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-lg font-black"
                        style={{ background: `${sec.color}12`, border: `2px solid ${sec.color}28`, color: sec.color }}>
                        {sec.tag}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-black" style={{ color: C.text }}>{sec.label}</h3>
                        <p className="text-[10px] font-mono uppercase tracking-wide mt-0.5" style={{ color: C.muted }}>{sec.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black" style={{ color: C.text }}>{members.length}</div>
                        <div className="text-[9px] font-bold uppercase tracking-wide" style={{ color: C.dim }}>
                          {members.length === 1 ? "billet" : "billets"}
                        </div>
                      </div>
                    </div>
                    {members.length > 0 ? (
                      <RosterTable soldiers={members} admin={admin} assignable={assignable} echelonColor={sec.color} />
                    ) : (
                      <div className="rounded-lg p-8 text-center" style={{ background: C.surf2, border: `1px dashed ${C.border}` }}>
                        <p className="text-[10px] font-bold font-mono uppercase tracking-widest" style={{ color: C.dim }}>
                          No billets assigned
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
