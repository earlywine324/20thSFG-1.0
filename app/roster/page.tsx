import Image from "next/image";
import Link from "next/link";
import { Plane, Shield } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { getRankImage } from "@/app/lib/rank-images";
import { rankOrder } from "@/app/lib/rank-order";
import { getViewRole } from "@/app/lib/preview";
import AssignDropdown from "./components/AssignDropdown";

type Soldier = { id: string; rank: string; rank_full: string; name: string; callsign: string | null; positional_callsign: string | null; mos: string; mos_title: string; role: string; unit: string; team: string | null; status: string; quals: string[]; staff_teams: string[]; avatar: string };
type Trainee = { id: string; name: string; callsign: string | null; rank: string };

const C = { bg: "#07090c", surface: "#0d1117", surface2: "#161b22", border: "#21262d", text: "#e6edf3", muted: "#8b949e", dim: "#484f58", green: "#3fb950", gold: "#d29922", purple: "#9b78e0" };

function BilletRow({ soldier, admin, assignable, accent }: { soldier: Soldier; admin: boolean; assignable: Trainee[]; accent: string }) {
  const vacant = soldier.status === "VACANT";
  const rankImage = getRankImage(soldier.rank);
  const row = (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${accent}12`, border: `1px solid ${accent}35` }}>
        {rankImage ? <Image src={rankImage} alt={soldier.rank} width={26} height={26} className={vacant ? "grayscale opacity-30" : ""} /> : <span className="text-[9px] font-black" style={{ color: accent }}>{soldier.rank}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold" style={{ color: vacant ? C.dim : C.text }}>{vacant ? "Vacant Billet" : soldier.name}</span>
          {soldier.positional_callsign && <span className="rounded px-1.5 py-0.5 text-[9px] font-black uppercase" style={{ color: accent, background: `${accent}14` }}>{soldier.positional_callsign}</span>}
        </div>
        <div className="mt-0.5 text-xs" style={{ color: C.muted }}>{soldier.role}</div>
        <div className="mt-0.5 text-[10px] font-mono" style={{ color: C.dim }}>{soldier.mos}{soldier.mos_title ? ` · ${soldier.mos_title}` : ""}</div>
      </div>
      <span className="hidden rounded-full px-2.5 py-1 text-[9px] font-black uppercase sm:block" style={{ color: vacant ? C.dim : C.green, background: vacant ? "rgba(72,79,88,.08)" : "rgba(63,185,80,.1)" }}>{vacant ? "Vacant" : soldier.status}</span>
      {admin && <div className="w-24 shrink-0 text-right">{vacant ? <AssignDropdown billetId={soldier.id} soldiers={assignable} /> : <span className="text-[10px]" style={{ color: C.dim }}>Assigned</span>}</div>}
    </div>
  );
  return vacant ? row : <Link href={`/roster/${soldier.id}`}>{row}</Link>;
}

function Element({ tag, title, subtitle, icon, soldiers, admin, assignable, accent }: { tag: string; title: string; subtitle: string; icon: React.ReactNode; soldiers: Soldier[]; admin: boolean; assignable: Trainee[]; accent: string }) {
  const filled = soldiers.filter((soldier) => soldier.status !== "VACANT").length;
  return (
    <section className="overflow-hidden rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex flex-wrap items-center gap-4 p-5" style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}35` }}>{icon}</div>
        <div className="min-w-0 flex-1"><div className="text-[9px] font-black tracking-[.2em] uppercase" style={{ color: accent }}>{tag}</div><h2 className="text-lg font-black">{title}</h2><p className="text-xs" style={{ color: C.muted }}>{subtitle}</p></div>
        <div className="text-right"><div className="text-xl font-black" style={{ color: accent }}>{filled} / {soldiers.length}</div><div className="text-[9px] font-bold uppercase" style={{ color: C.muted }}>billets filled</div></div>
      </div>
      {soldiers.map((soldier) => <BilletRow key={soldier.id} soldier={soldier} admin={admin} assignable={assignable} accent={accent} />)}
    </section>
  );
}

export default async function RosterPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("soldiers").select("id,rank,rank_full,name,callsign,positional_callsign,mos,mos_title,role,unit,team,status,quals,staff_teams,avatar").neq("status", "DISCHARGED");
  const soldiers = ((data || []) as Soldier[]).sort((a, b) => rankOrder(a.rank) - rankOrder(b.rank));
  const oda = soldiers.filter((soldier) => soldier.unit === "20th Special Forces Group" && soldier.team === "ODA 2011");
  const soar = soldiers.filter((soldier) => soldier.unit === "160th SOAR (A)" && soldier.team === "MH-60M Crew 1");
  const active = [...oda, ...soar].filter((soldier) => soldier.status !== "VACANT").length;
  const total = oda.length + soar.length;
  const admin = (await getViewRole()) === "admin";
  const assignable = soldiers.filter((soldier) => soldier.status !== "VACANT").map(({ id, name, callsign, rank }) => ({ id, name, callsign, rank }));
  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8">
        <div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-xl text-center text-xs font-black leading-tight" style={{ color: C.gold, background: "rgba(210,153,34,.08)", border: "1px solid rgba(210,153,34,.25)" }}>20th<br />SFG</div><div><h1 className="text-2xl font-black">Task Organization</h1><p className="mt-1 text-sm" style={{ color: C.muted }}>20th Special Forces Group · ODA 2011</p><p className="mt-1 text-[10px] font-black uppercase tracking-[.18em]" style={{ color: C.gold }}>De Oppresso Liber</p></div></div>
        <div className="flex gap-3"><div className="rounded-lg px-4 py-3 text-center" style={{ background: C.surface2, border: `1px solid ${C.border}` }}><div className="text-xl font-black">{total}</div><div className="text-[9px] uppercase" style={{ color: C.muted }}>Total billets</div></div><div className="rounded-lg px-4 py-3 text-center" style={{ background: C.surface2, border: `1px solid ${C.border}` }}><div className="text-xl font-black" style={{ color: C.green }}>{active}</div><div className="text-[9px] uppercase" style={{ color: C.muted }}>Assigned</div></div></div>
      </div></header>
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <Element tag="Special Forces Detachment" title="ODA 2011" subtitle="12-person Operational Detachment Alpha" icon={<Shield className="h-6 w-6" />} soldiers={oda} admin={admin} assignable={assignable} accent={C.gold} />
        <Element tag="Special Operations Aviation" title="MH-60M Crew 1" subtitle="160th Special Operations Aviation Regiment (Airborne)" icon={<Plane className="h-6 w-6" />} soldiers={soar} admin={admin} assignable={assignable} accent={C.purple} />
      </main>
    </div>
  );
}
