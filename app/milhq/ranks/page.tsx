import Image from "next/image";
import {
  ArrowDown,
  BadgeCheck,
  Crosshair,
  Eye,
  FlaskConical,
  Gavel,
  Network,
  Shield,
  Star,
  Users,
} from "lucide-react";

type Grade = {
  code: string;
  title: string;
  label: string;
  description: string;
};

const COMMAND_GRADES: Grade[] = [
  {
    code: "LH-9",
    title: "Director",
    label: "Executive Command",
    description:
      "Commands ISMG, sets policy and strategic priorities, and holds final organizational authority.",
  },
  {
    code: "LH-8",
    title: "Deputy Director",
    label: "Executive Command",
    description:
      "Coordinates the four divisions, assumes command when required, and converts strategy into executable plans.",
  },
  {
    code: "LH-7",
    title: "Chief of Operations",
    label: "Operational Command",
    description:
      "Controls the operational cycle, approves mission packages, and enforces training and readiness standards.",
  },
];

const OPERATIONAL_GRADES: Grade[] = [
  {
    code: "LH-6",
    title: "Division Chief",
    label: "Division Command",
    description: "Owns personnel, readiness, doctrine, and performance for one operational division.",
  },
  {
    code: "LH-5",
    title: "Detachment Commander",
    label: "Detachment Command",
    description: "Leads a six-person detachment from mission planning through execution and debrief.",
  },
  {
    code: "LH-4",
    title: "Detachment Deputy",
    label: "Detachment Leadership",
    description: "Assists the commander, manages readiness, and supervises split or supporting elements.",
  },
  {
    code: "LH-3",
    title: "Senior Officer",
    label: "Senior Qualified",
    description: "An experienced agent or operator who leads a specialty and mentors developing personnel.",
  },
  {
    code: "LH-2",
    title: "Officer",
    label: "Mission Qualified",
    description: "A fully qualified member trusted to execute division-specific responsibilities independently.",
  },
  {
    code: "LH-1",
    title: "Candidate",
    label: "Assessment Pipeline",
    description: "A member completing screening, orientation, and foundational division training.",
  },
];

const DIVISIONS = [
  {
    key: "SAD",
    name: "Special Activities Division",
    icon: Eye,
    color: "#c9a65a",
    titles: [
      "Division Chief",
      "Detachment Chief",
      "Team Chief",
      "Senior Case Officer",
      "Operations Officer",
      "Operations Candidate",
    ],
  },
  {
    key: "FOD",
    name: "Federal Operations Division",
    icon: Gavel,
    color: "#879eaa",
    titles: [
      "Special Agent in Charge",
      "Assistant Special Agent in Charge",
      "Supervisory Special Agent",
      "Senior Special Agent",
      "Special Agent",
      "New Agent",
    ],
  },
  {
    key: "NOD",
    name: "Narcotics Operations Division",
    icon: FlaskConical,
    color: "#8e9f78",
    titles: [
      "Special Agent in Charge",
      "Assistant Special Agent in Charge",
      "Group Supervisor",
      "Senior Special Agent",
      "Special Agent",
      "Agent Trainee",
    ],
  },
  {
    key: "SMS",
    name: "Special Missions Squadron",
    icon: Crosshair,
    color: "#a98578",
    titles: [
      "Squadron Commander",
      "Detachment Commander",
      "Assistant Detachment Commander",
      "Team Leader",
      "Operator",
      "Selection Candidate",
    ],
  },
];

const DETACHMENT = [
  ["01", "LH-5", "Detachment Commander", "Mission authority"],
  ["02", "LH-4", "Detachment Deputy", "Readiness and second-in-command"],
  ["03", "LH-3", "Senior Specialist", "Lead discipline and mentorship"],
  ["04", "LH-2", "Specialist", "Primary mission function"],
  ["05", "LH-2", "Specialist", "Primary mission function"],
  ["06", "LH-1", "Candidate / Attached Specialist", "Development or mission augmentation"],
];

function GradeMark({ code, large = false }: { code: string; large?: boolean }) {
  const level = Number(code.split("-")[1]);
  const marks = level > 6 ? level - 6 : Math.max(1, Math.ceil(level / 2));

  return (
    <div
      className={`relative flex ${large ? "h-20 w-20" : "h-14 w-14"} shrink-0 items-center justify-center rounded-full border border-[#c9a65a]/40 bg-[#c9a65a]/[0.06]`}
    >
      <Shield className={`${large ? "h-10 w-10" : "h-7 w-7"} text-[#c9a65a]`} strokeWidth={1.25} />
      <div className="absolute -bottom-1 flex gap-1">
        {Array.from({ length: marks }).map((_, index) => (
          <span key={index} className="h-1 w-1 rounded-full bg-[#c9a65a]" />
        ))}
      </div>
    </div>
  );
}

function GradeCard({ grade, command = false }: { grade: Grade; command?: boolean }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0f10]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#c9a65a]/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a65a]/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="mb-7 flex items-start justify-between gap-4">
        <GradeMark code={grade.code} large={command} />
        <span className="rounded-full border border-[#c9a65a]/20 bg-[#c9a65a]/[0.06] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a65a]">
          {grade.code}
        </span>
      </div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#77766f]">{grade.label}</p>
      <h3 className={`${command ? "text-2xl" : "text-xl"} mb-3 font-semibold tracking-tight text-[#f1ede3]`}>
        {grade.title}
      </h3>
      <p className="text-sm leading-6 text-[#92918a]">{grade.description}</p>
    </article>
  );
}

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div className="mb-9 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end">
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em] text-[#c9a65a]">{eyebrow}</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[#f1ede3] md:text-4xl">{title}</h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-[#85847e] md:justify-self-end">{copy}</p>
    </div>
  );
}

export default function RanksPage() {
  return (
    <main className="min-h-screen bg-[#070809] text-[#f1ede3]">
      <section className="relative isolate overflow-hidden border-b border-white/[0.07] px-6 py-20 md:py-28">
        <Image
          src="/lionheart-hero.webp"
          alt=""
          fill
          priority
          className="-z-20 object-cover object-center opacity-20 grayscale"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#070809] via-[#070809]/95 to-[#070809]/60" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.025)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-[#c9a65a]/30 bg-black/40">
              <Image src="/lionheart-emblem.webp" alt="Lionheart seal" fill className="object-contain p-1" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a65a]">Personnel Directive // 01</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#77766f]">Interagency Special Missions Group</p>
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] md:text-7xl">
                Grade <span className="text-[#c9a65a]">&amp;</span> Authority
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-[#aaa79e]">
                One unified Lionheart grade establishes authority across ISMG. Each division applies its own professional title without changing the chain of command.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
              {[["09", "Unified grades"], ["04", "Division ladders"], ["06", "Person detachments"]].map(([number, label]) => (
                <div key={label} className="border-l border-[#c9a65a]/30 py-2 pl-4">
                  <p className="text-xl font-semibold text-[#f1ede3]">{number}</p>
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[#77766f]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Strategic authority"
            title="Command Group"
            copy="The command group sets policy, synchronizes the divisions, and maintains final authority over the operational cycle."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {COMMAND_GRADES.map((grade) => <GradeCard key={grade.code} grade={grade} command />)}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-[#0a0b0c] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Operational authority"
            title="Division & Detachment Grades"
            copy="LH-6 through LH-1 defines the working chain of command used inside every Lionheart division and deployed detachment."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {OPERATIONAL_GRADES.map((grade) => <GradeCard key={grade.code} grade={grade} />)}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Division equivalency"
            title="One Grade. Four Professions."
            copy="Members display the common LH grade first, followed by the title used within their assigned division."
          />

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0b0d0e]">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[90px_repeat(4,1fr)] border-b border-white/[0.08] bg-white/[0.02]">
                <div className="p-5 text-[9px] font-bold uppercase tracking-[0.2em] text-[#66655f]">Grade</div>
                {DIVISIONS.map((division) => {
                  const Icon = division.icon;
                  return (
                    <div key={division.key} className="border-l border-white/[0.06] p-5">
                      <div className="mb-3 flex items-center gap-2" style={{ color: division.color }}>
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-[0.18em]">{division.key}</span>
                      </div>
                      <p className="text-xs leading-5 text-[#8f8e87]">{division.name}</p>
                    </div>
                  );
                })}
              </div>

              {OPERATIONAL_GRADES.map((grade, row) => (
                <div key={grade.code} className="grid grid-cols-[90px_repeat(4,1fr)] border-b border-white/[0.06] last:border-b-0">
                  <div className="flex items-center p-5 text-sm font-semibold text-[#c9a65a]">{grade.code}</div>
                  {DIVISIONS.map((division) => (
                    <div key={division.key} className="flex items-center border-l border-white/[0.06] p-5 text-sm leading-5 text-[#d2cfc6]">
                      {division.titles[row]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#c9a65a]/15 bg-[#c9a65a]/[0.04] p-4 text-xs leading-5 text-[#96948d]">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a65a]" />
            <p><span className="font-semibold text-[#d9d5ca]">Display example:</span> LH-3 · Senior Case Officer · Special Activities Division</p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.07] bg-[#0a0b0c] px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.32em] text-[#c9a65a]">Deployable element</p>
            <h2 className="text-4xl font-semibold tracking-tight text-[#f1ede3]">Six-Person Detachment</h2>
            <p className="mt-5 text-sm leading-6 text-[#85847e]">
              Every division uses the same compact command model. The leadership seats remain fixed while the specialist billets change with the mission.
            </p>
            <div className="mt-8 rounded-2xl border border-[#c9a65a]/20 bg-[#c9a65a]/[0.04] p-6">
              <Network className="mb-5 h-6 w-6 text-[#c9a65a]" />
              <p className="text-lg font-semibold text-[#e8e3d7]">Command stays fixed.</p>
              <p className="text-lg text-[#9b998f]">Specialties change.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-6 left-[23px] top-6 w-px bg-gradient-to-b from-[#c9a65a]/60 via-[#c9a65a]/20 to-transparent" />
            <div className="space-y-3">
              {DETACHMENT.map(([position, grade, title, description], index) => (
                <div key={position} className="relative grid grid-cols-[48px_64px_1fr] items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0d0f10] p-4">
                  <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#c9a65a]/30 bg-[#0d0f10] text-[10px] font-bold text-[#c9a65a]">{position}</div>
                  <span className="text-xs font-semibold text-[#c9a65a]">{grade}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#e5e1d7]">{title}</p>
                    <p className="mt-1 text-xs text-[#77766f]">{description}</p>
                  </div>
                  {index < DETACHMENT.length - 1 && <ArrowDown className="absolute -bottom-3 left-[15px] z-20 h-3 w-3 text-[#c9a65a]/50" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-[9px] uppercase tracking-[0.22em] text-[#5f5e59]">
          <span className="flex items-center gap-2"><Star className="h-3 w-3 text-[#c9a65a]" /> LIONHEART Personnel System</span>
          <span className="flex items-center gap-2"><Users className="h-3 w-3" /> Fictional organization // Internal use</span>
        </div>
      </footer>
    </main>
  );
}
