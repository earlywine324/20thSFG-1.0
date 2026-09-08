import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crosshair, Eye, FlaskConical, Gavel } from "lucide-react";

const GOLD = "#c9a65a";

const ELEMENTS = [
  { code: "SAD", name: "Special Activities Division", icon: Eye, description: "Runs intelligence collection, surveillance, source operations, special reconnaissance, and low-visibility field activity." },
  { code: "FOD", name: "Federal Operations Division", icon: Gavel, description: "Develops federal cases, executes warrants, handles evidence, and leads counterterrorism and crisis-response investigations." },
  { code: "NOD", name: "Narcotics Operations Division", icon: FlaskConical, description: "Targets trafficking networks through undercover work, interdiction, intelligence development, and partner-force missions." },
  { code: "SMS", name: "Special Missions Squadron", icon: Crosshair, description: "Conducts direct action, hostage rescue, high-value target capture, personnel recovery, and sensitive-site exploitation." },
];

const FAQS = [
  ["Is ISMG a real government organization?", "No. ISMG and the LIONHEART Program are completely fictional and exist only as the setting for our gaming community."],
  ["What games does the unit play?", "Arma is our main realism platform. Members also play other tactical, cooperative, and casual games together."],
  ["How serious is the realism?", "Operations use organized planning, authentic communications, defined roles, and a chain of command. Outside missions, we keep the community relaxed and approachable."],
  ["Do I need military or law-enforcement experience?", "No. We train new members and care more about reliability, communication, maturity, and willingness to learn."],
  ["How does a campaign work?", "A story can begin with surveillance and intelligence collection, develop into an investigation, and finish with an interdiction, raid, or recovery mission."],
  ["How do I join?", "Submit a screening application. Approved candidates complete orientation and initial training before receiving an operational assignment."],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#070809] text-[#eee8dc]">
      <section className="relative overflow-hidden border-b border-[#c9a65a]/15 px-6 py-24">
        <div className="absolute inset-0"><Image src="/lionheart-hero.webp" alt="" fill sizes="100vw" className="object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-[#070809] via-[#070809]/90 to-[#070809]/70" /></div>
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.34em]" style={{ color: GOLD }}>Program brief // Public release</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Interagency Special<br /><span style={{ color: GOLD }}>Missions Group</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#aaa395]">LIONHEART is a fictional special-missions program created for connected Arma campaigns that move between intelligence work, investigations, interdiction, and direct action.</p>
          </div>
          <Image src="/lionheart-emblem.webp" alt="LIONHEART emblem" width={300} height={300} priority className="mx-auto w-full max-w-[280px] drop-shadow-[0_18px_50px_rgba(0,0,0,.75)]" />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.3em]" style={{ color: GOLD }}>The concept</p>
            <h2 className="mt-4 text-4xl font-black">One headquarters. Four operational disciplines.</h2>
          </div>
          <div className="space-y-5 text-sm leading-7 text-[#9b9487]">
            <p>ISMG was designed to support more than conventional military missions. Its fictional mandate allows members to investigate threats, build intelligence pictures, conduct surveillance, work undercover, interdict criminal networks, and execute high-risk tactical missions.</p>
            <p>The unit draws creative inspiration from modern intelligence services, federal law enforcement, counternarcotics task forces, and military special mission units. It does not represent or claim affiliation with any real organization.</p>
            <p>Our goal is immersive teamwork without unnecessary roleplay. Mission nights are organized and disciplined. The community around them stays relaxed.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#24231f] bg-[#0b0d10] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.3em]" style={{ color: GOLD }}>Task organization</p>
          <h2 className="mt-4 text-4xl font-black">Operational elements</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {ELEMENTS.map(({ code, name, icon: Icon, description }) => (
              <article key={code} className="border border-[#292720] bg-[#090b0d] p-7">
                <div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center border border-[#c9a65a]/25 bg-[#c9a65a]/[.06]" style={{ color: GOLD }}><Icon className="h-5 w-5" /></div><div><p className="font-mono text-[9px] font-black uppercase tracking-[.22em]" style={{ color: GOLD }}>{code}</p><h3 className="text-lg font-black">{name}</h3></div></div>
                <p className="mt-5 text-sm leading-6 text-[#918a7d]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center"><p className="font-mono text-[10px] font-bold uppercase tracking-[.3em]" style={{ color: GOLD }}>Candidate information</p><h2 className="mt-4 text-4xl font-black">Frequently asked questions</h2></div>
          <div className="mt-10 divide-y divide-[#292720] border-y border-[#292720]">
            {FAQS.map(([question, answer]) => <div key={question} className="grid gap-3 py-6 md:grid-cols-[280px_1fr]"><h3 className="text-sm font-black">{question}</h3><p className="text-sm leading-6 text-[#918a7d]">{answer}</p></div>)}
          </div>
          <div className="mt-14 border border-[#c9a65a]/25 bg-[#c9a65a]/[.04] p-8 text-center"><p className="font-mono text-[9px] font-bold uppercase tracking-[.28em]" style={{ color: GOLD }}>Screening is open</p><h2 className="mt-3 text-2xl font-black">Ready to enter the program?</h2><Link href="/enlist" className="mt-6 inline-flex items-center gap-2 bg-[#c9a65a] px-7 py-3.5 text-xs font-black uppercase tracking-[.2em] text-[#090a0c]">Begin application <ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </div>
  );
}
