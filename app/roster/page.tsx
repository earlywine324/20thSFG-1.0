import Image from "next/image";
import Link from "next/link";
import { Crosshair, Eye, FlaskConical, Gavel } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { getRankImage } from "@/app/lib/rank-images";
import { rankOrder } from "@/app/lib/rank-order";
import { getViewRole } from "@/app/lib/preview";
import AssignDropdown from "./components/AssignDropdown";

type Soldier = { id: string; rank: string; rank_full: string; name: string; callsign: string | null; positional_callsign: string | null; mos: string; mos_title: string; role: string; unit: string; team: string | null; status: string; quals: string[]; staff_teams: string[]; avatar: string };
type Trainee = { id: string; name: string; callsign: string | null; rank: string };

const C = { bg: "#070809", surface: "#0b0d10", surface2: "#101216", border: "#292720", text: "#eee8dc", muted: "#948d80", dim: "#57534b", green: "#64c47b", gold: "#c9a65a", crimson: "#8e2f2f" };

const ORGANIZATION = [
  { team: "Special Activities Division", code: "SAD", subtitle: "Intelligence collection and covert action", accent: "#c9a65a", icon: Eye },
  { team: "Federal Operations Division", code: "FOD", subtitle: "Investigations and crisis response", accent: "#8da5b8", icon: Gavel },
  { team: "Narcotics Operations Division", code: "NOD", subtitle: "Trafficking investigations and interdiction", accent: "#8fa86c", icon: FlaskConical },
  { team: "Special Missions Squadron", code: "SMS", subtitle: "Direct action and hostage rescue", accent: "#a94d46", icon: Crosshair },
];

function BilletRow({ soldier, admin, assignable, accent }: { soldier: Soldier; admin: boolean; assignable: Trainee[]; accent: string }) {
  const vacant = soldier.status === "VACANT";
  const rankImage = getRankImage(soldier.rank);
  const row = (
    <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center" style={{ background: `${accent}12`, border: `1px solid ${accent}35` }}>
        {rankImage ? <Image src={rankImage} alt={soldier.rank_full || soldier.rank} width={26} height={26} className={vacant ? "grayscale opacity-25" : ""} /> : <span className="text-[9px] font-black" style={{ color: accent }}>{soldier.rank}</span>}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold" style={{ color: vacant ? C.dim : C.text }}>{vacant ? "Open Billet" : soldier.name}</span>
          {soldier.positional_callsign && <span className="px-1.5 py-0.5 text-[9px] font-black uppercase" style={{ color: accent, background: `${accent}14` }}>{soldier.positional_callsign}</span>}
        </div>
        <div className="mt-0.5 text-xs" style={{ color: C.muted }}>{soldier.role}</div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[.12em]" style={{ color: C.dim }}>{soldier.mos_title || soldier.mos}</div>
      </div>
      <span className="hidden px-2.5 py-1 text-[9px] font-black uppercase sm:block" style={{ color: vacant ? C.dim : C.green, background: vacant ? "rgba(72,79,88,.08)" : "rgba(63,185,80,.1)" }}>{vacant ? "Available" : soldier.status}</span>
      {admin && <div className="w-24 shrink-0 text-right">{vacant ? <AssignDropdown billetId={soldier.id} soldiers={assignable} /> : <span className="text-[10px]" style={{ color: C.dim }}>Assigned</span>}</div>}
    </div>
  );
  return vacant ? row : <Link href={`/roster/${soldier.id}`}>{row}</Link>;
}

function Element({ code, title, subtitle, soldiers, admin, assignable, accent, Icon }: { code: string; title: string; subtitle: string; soldiers: Soldier[]; admin: boolean; assignable: Trainee[]; accent: string; Icon: React.ComponentType<{ className?: string }> }) {
  const filled = soldiers.filter((soldier) => soldier.status !== "VACANT").length;
  return (
    <section className="overflow-hidden border" style={{ background: C.surface, borderColor: C.border }}>
      <div className="flex flex-wrap items-center gap-4 p-5" style={{ background: C.surface2, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex h-12 w-12 items-center justify-center" style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}35` }}><Icon className="h-6 w-6" /></div>
        <div className="min-w-0 flex-1"><div className="font-mono text-[9px] font-black uppercase tracking-[.22em]" style={{ color: accent }}>{code} {"//"} Operational element</div><h2 className="text-lg font-black">{title}</h2><p className="text-xs" style={{ color: C.muted }}>{subtitle}</p></div>
        <div className="text-right"><div className="text-xl font-black" style={{ color: accent }}>{filled} / {soldiers.length}</div><div className="text-[9px] font-bold uppercase" style={{ color: C.muted }}>billets filled</div></div>
      </div>
      {soldiers.length ? soldiers.map((soldier) => <BilletRow key={soldier.id} soldier={soldier} admin={admin} assignable={assignable} accent={accent} />) : <div className="px-5 py-8 text-center font-mono text-[9px] uppercase tracking-[.18em]" style={{ color: C.dim }}>Element awaiting activation</div>}
    </section>
  );
}

export default async function RosterPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("soldiers").select("id,rank,rank_full,name,callsign,positional_callsign,mos,mos_title,role,unit,team,status,quals,staff_teams,avatar").neq("status", "DISCHARGED");
  const soldiers = ((data || []) as Soldier[]).sort((a, b) => rankOrder(a.rank) - rankOrder(b.rank));
  const operational = soldiers.filter((soldier) => soldier.unit === "Interagency Special Missions Group");
  const active = operational.filter((soldier) => soldier.status !== "VACANT").length;
  const admin = (await getViewRole()) === "admin";
  const assignable = soldiers.filter((soldier) => soldier.status !== "VACANT").map(({ id, name, callsign, rank }) => ({ id, name, callsign, rank }));

  return (
    <div className="min-h-screen" style={{ background: C.bg, color: C.text }}>
      <header className="border-b" style={{ background: C.surface, borderColor: C.border }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-8">
          <div className="flex items-center gap-4">
            <Image src="/lionheart-emblem.webp" alt="LIONHEART emblem" width={72} height={72} />
            <div><p className="font-mono text-[9px] font-bold uppercase tracking-[.24em]" style={{ color: C.gold }}>ISMG // Personnel manifest</p><h1 className="mt-1 text-2xl font-black">LIONHEART Task Organization</h1><p className="mt-1 text-xs" style={{ color: C.muted }}>Four interagency elements under unified mission command</p></div>
          </div>
          <div className="flex gap-3"><div className="border px-4 py-3 text-center" style={{ background: C.surface2, borderColor: C.border }}><div className="text-xl font-black">{operational.length}</div><div className="text-[9px] uppercase" style={{ color: C.muted }}>Total billets</div></div><div className="border px-4 py-3 text-center" style={{ background: C.surface2, borderColor: C.border }}><div className="text-xl font-black" style={{ color: C.green }}>{active}</div><div className="text-[9px] uppercase" style={{ color: C.muted }}>Assigned</div></div></div>
        </div>
      </header>
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-2">
        {ORGANIZATION.map(({ team, code, subtitle, accent, icon }) => <Element key={team} code={code} title={team} subtitle={subtitle} soldiers={operational.filter((soldier) => soldier.team === team)} admin={admin} assignable={assignable} accent={accent} Icon={icon} />)}
      </main>
    </div>
  );
}
