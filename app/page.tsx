import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Crosshair, Eye, FlaskConical, Gavel, MapPin } from "lucide-react";
import HeroSection from "./components/HeroSection";
import { createClient } from "@/app/lib/supabase/server";

const GOLD = "#c9a65a";

const ELEMENTS = [
  { code: "SAD", title: "Special Activities Division", subtitle: "Intelligence & covert action", icon: Eye, body: "Human intelligence, surveillance, asset handling, special reconnaissance, and low-visibility operations." },
  { code: "FOD", title: "Federal Operations Division", subtitle: "Investigations & crisis response", icon: Gavel, body: "Counterterrorism cases, technical surveillance, evidence exploitation, warrants, and hostage response." },
  { code: "NOD", title: "Narcotics Operations Division", subtitle: "Cartel & interdiction operations", icon: FlaskConical, body: "Undercover investigations, trafficking-network disruption, interdiction, and partner-force operations." },
  { code: "SMS", title: "Special Missions Squadron", subtitle: "National-level direct action", icon: Crosshair, body: "Precision raids, hostage rescue, high-value target capture, and sensitive-site exploitation." },
];

const MISSIONS = [
  "Counterterrorism",
  "Clandestine collection",
  "Hostage rescue",
  "Counternarcotics",
  "Sensitive-site exploitation",
  "Personnel recovery",
];

type CompletedOp = {
  id: string;
  title: string;
  event_date: string;
  theatre: string | null;
  element: string | null;
  result: string | null;
  op_number: string | null;
};

function displayDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value)).toUpperCase();
}

export default async function Home() {
  const supabase = await createClient();
  const [{ data }, { count: assigned }, { count: billets }, { count: completed }] = await Promise.all([
    supabase.from("events").select("id,title,event_date,theatre,element,result,op_number").eq("status", "COMPLETED").order("event_date", { ascending: false }).limit(4),
    supabase.from("soldiers").select("*", { count: "exact", head: true }).eq("status", "ACTIVE DUTY").neq("unit", "LIONHEART Selection"),
    supabase.from("soldiers").select("*", { count: "exact", head: true }).eq("status", "VACANT"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "COMPLETED"),
  ]);
  const recentOps = (data || []) as CompletedOp[];
  const recruiting = (billets || 0) > 0;

  return (
    <div className="bg-[#070809] text-[#eee8dc]">
      <HeroSection />

      <section className="border-y border-[#c9a65a]/15 bg-[#0b0d10]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#c9a65a]/10 px-6 md:grid-cols-4">
          {[
            ["Program", "LIONHEART"],
            ["Assigned personnel", String(assigned || 0)],
            ["Operations logged", String(completed || 0)],
            ["Recruitment", recruiting ? "OPEN" : "CLOSED"],
          ].map(([label, value]) => (
            <div key={label} className="px-5 py-7 text-center">
              <p className="font-mono text-[9px] uppercase tracking-[.25em] text-[#706a5f]">{label}</p>
              <p className="mt-2 text-sm font-black uppercase tracking-[.14em]" style={{ color: value === "OPEN" ? "#6ecb84" : GOLD }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.34em]" style={{ color: GOLD }}>Interagency task organization</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Four disciplines.<br />One mission group.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#969083]">
              ISMG combines the investigative depth of a federal task force, the reach of an intelligence service,
              the focus of a counternarcotics unit, and the precision of a special mission unit. LIONHEART turns those
              capabilities into one connected Arma campaign experience.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {ELEMENTS.map(({ code, title, subtitle, icon: Icon, body }) => (
              <article key={code} className="group border border-[#24231f] bg-[#0c0e11] p-7 transition hover:border-[#c9a65a]/45">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-11 w-11 items-center justify-center border border-[#c9a65a]/25 bg-[#c9a65a]/[.06]" style={{ color: GOLD }}><Icon className="h-5 w-5" /></div>
                  <span className="font-mono text-[10px] font-black tracking-[.24em] text-[#59554d]">{code}</span>
                </div>
                <h3 className="mt-6 text-lg font-black">{title}</h3>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[.2em]" style={{ color: GOLD }}>{subtitle}</p>
                <p className="mt-4 text-sm leading-6 text-[#8f897d]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#24231f] bg-[#0b0d10] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div className="relative min-h-[430px] overflow-hidden border border-[#2b2923]">
            <Image src="/lionheart-hero.webp" alt="Fictional LIONHEART joint operations center" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="font-mono text-[9px] uppercase tracking-[.26em]" style={{ color: GOLD }}>Mission profile // Joint operations</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[#b7b0a2]">Intelligence drives the operation. Investigators build the target. Tactical elements finish the mission.</p>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.34em]" style={{ color: GOLD }}>Operational mandate</p>
            <h2 className="mt-4 text-4xl font-black">Built for connected campaigns.</h2>
            <p className="mt-5 text-sm leading-7 text-[#969083]">Members are not limited to one style of play. A case can begin with surveillance, develop into an undercover investigation, and end with a coordinated assault or extraction.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {MISSIONS.map((mission) => (
                <div key={mission} className="flex items-center gap-3 border border-[#24231f] bg-[#080a0c] px-4 py-3 text-xs font-bold text-[#bbb3a4]">
                  <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: GOLD }} /> {mission}
                </div>
              ))}
            </div>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.2em]" style={{ color: GOLD }}>View program brief <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="font-mono text-[10px] font-bold uppercase tracking-[.34em]" style={{ color: GOLD }}>Sanitized archive</p><h2 className="mt-3 text-4xl font-black">Mission log</h2></div>
            <Link href="/operations" className="text-xs font-black uppercase tracking-[.18em] text-[#918a7d] hover:text-[#c9a65a]">Open full archive →</Link>
          </div>
          <div className="mt-9 overflow-hidden border border-[#24231f] bg-[#0b0d10]">
            {recentOps.length ? recentOps.map((op) => (
              <div key={op.id} className="grid gap-4 border-b border-[#24231f] px-6 py-5 last:border-0 md:grid-cols-[110px_1fr_180px_120px] md:items-center">
                <span className="font-mono text-[10px] font-bold" style={{ color: GOLD }}>{op.op_number || "PENDING"}</span>
                <div><p className="text-sm font-black">{op.title}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-[#6f6a5f]"><MapPin className="h-3 w-3" />{op.theatre || "REDACTED"}</p></div>
                <span className="text-xs text-[#918a7d]">{op.element || "Joint task element"}</span>
                <span className="font-mono text-[10px] text-[#6f6a5f]">{displayDate(op.event_date)}</span>
              </div>
            )) : <div className="px-6 py-12 text-center font-mono text-[10px] uppercase tracking-[.22em] text-[#5e5a52]">No sanitized mission records released</div>}
          </div>
        </div>
      </section>

      <section className="border-t border-[#c9a65a]/15 bg-[radial-gradient(circle_at_50%_0%,rgba(201,166,90,.10),transparent_42%)] px-6 py-24 text-center">
        <Image src="/lionheart-emblem.webp" alt="LIONHEART emblem" width={92} height={92} className="mx-auto" />
        <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[.34em]" style={{ color: GOLD }}>Candidate screening active</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black md:text-5xl">Your first assignment starts here.</h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#969083]">We want dependable players who communicate, learn, and contribute. Prior military or milsim experience is not required.</p>
        <Link href="/enlist" className="mt-8 inline-flex items-center gap-2 bg-[#c9a65a] px-8 py-4 text-xs font-black uppercase tracking-[.2em] text-[#090a0c]">Apply to LIONHEART <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <div className="border-t border-[#24231f] px-6 py-4 text-center font-mono text-[9px] uppercase tracking-[.2em] text-[#4e4b45]">
        Fictional gaming organization // Not affiliated with any government agency or military organization
      </div>
    </div>
  );
}
