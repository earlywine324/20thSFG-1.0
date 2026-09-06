import Image from "next/image";
import { Star } from "lucide-react";

type Qualification = {
  name: string;
  abbr: string;
  image?: string;
  category: "badge" | "tab" | "skill";
  description: string;
  requirements: string[];
};

const QUALIFICATIONS: { section: string; subtitle: string; items: Qualification[] }[] = [
  {
    section: "Tabs & Identifiers",
    subtitle: "Shoulder Tabs & Unit Identifiers",
    items: [
      {
        name: "Ranger Tab",
        abbr: "Ranger Tab",
        image: "/insignia/quals/Ranger-Tab-69c21f34e155a.png",
        category: "tab",
        description: "The Ranger Tab is the most prestigious qualification in the unit, earned through completion of the Ranger School equivalent — an intense 62-day small-unit leadership course covering patrolling, raids, ambushes, and survival in mountain, swamp, and desert environments. Every Ranger in 1/75th is expected to earn this tab.",
        requirements: ["Complete RASP (Ranger Assessment and Selection Program)", "Complete Mountain, Swamp, and Desert phases", "Pass all patrol evaluations", "Peer evaluation score above threshold", "Platoon Leader endorsement"],
      },
      {
        name: "Sapper Tab",
        abbr: "Sapper Tab",
        image: "/insignia/quals/sapper.png",
        category: "tab",
        description: "Awarded to soldiers who complete the Sapper Leader Course equivalent, demonstrating mastery of combat engineering, demolitions, route clearance, and obstacle construction/breaching. Sapper-qualified Rangers bring critical engineer capability to any squad.",
        requirements: ["Open to all MOS", "Complete Sapper assessment phase", "Pass demolitions qualification", "Complete combat engineering evaluations", "Physical fitness standard met"],
      },
    ],
  },
  {
    section: "Airborne & Freefall",
    subtitle: "Parachutist Qualifications",
    items: [
      {
        name: "U.S. Army Airborne Badge",
        abbr: "Airborne",
        image: "/insignia/quals/Parachutist-Basic-69c215b3a9bbb.png",
        category: "badge",
        description: "The basic parachutist qualification. Airborne-qualified soldiers have completed jump school and are certified for static-line parachute operations. This is a foundational qualification for all Rangers — every member of the 1/75th is expected to be Airborne qualified.",
        requirements: ["Complete Ground Week training", "Complete Tower Week training", "Execute minimum 5 qualifying static-line jumps", "Pass physical fitness requirements"],
      },
      {
        name: "Military Freefall Parachutist Badge (HALO)",
        abbr: "HALO",
        image: "/insignia/quals/Freefall-Basic-69c21d2b272da.png",
        category: "badge",
        description: "Identifies soldiers qualified in High Altitude Low Opening (HALO) and High Altitude High Opening (HAHO) freefall parachute operations. HALO-qualified operators can infiltrate targets from extreme altitudes, making them critical for covert insertion missions.",
        requirements: ["Current Airborne qualification", "Minimum E-5 rank", "Complete MFF ground training phase", "Execute qualifying freefall jumps from altitude", "Pass oxygen equipment and equipment rigging evaluations"],
      },
    ],
  },
  {
    section: "Combat & Operations",
    subtitle: "Operational Skill Badges",
    items: [
      {
        name: "Combat Infantryman Badge",
        abbr: "CIB",
        image: "/insignia/quals/CIB.png",
        category: "badge",
        description: "Awarded to infantry soldiers who have satisfactorily performed duty in active ground combat while assigned to an infantry unit. The CIB is one of the most respected recognitions, signifying direct combat experience.",
        requirements: ["MOS 11-series", "Actively engaged in ground combat", "Verified enemy contact during FTX or campaign", "Commander certification after action review"],
      },
      {
        name: "Expert Infantryman Badge",
        abbr: "EIB",
        image: "/insignia/quals/eib.png",
        category: "badge",
        description: "Awarded to infantry soldiers who demonstrate expert proficiency in infantry skills testing. The EIB is earned through a rigorous evaluation of land navigation, weapons, medical, communications, and tactical tasks — without the requirement for combat experience.",
        requirements: ["MOS 11-series", "Pass all 30+ individual skill stations", "Complete 12-mile road march within standard", "Score Expert on weapons qualification", "No more than 1 re-test allowed"],
      },
      {
        name: "Air Assault Badge",
        abbr: "Air Assault",
        image: "/insignia/quals/Air-Assault-69c215ba85f15.png",
        category: "badge",
        description: "Identifies soldiers trained in air assault helicopter operations including rappelling, sling load, and pathfinder-insertion techniques. Air Assault qualified soldiers can plan and execute helicopter-based operations.",
        requirements: ["Complete Air Assault obstacle course", "Pass rappelling qualification (3 tower, 2 helicopter)", "Complete sling load operations training", "Pass written examination", "Complete 12-mile road march within standard"],
      },
    ],
  },
  {
    section: "Specialist Skills",
    subtitle: "Advanced MOS & Technical Qualifications",
    items: [
      {
        name: "Special Operations Combat Medic",
        abbr: "SOCM",
        image: "/insignia/quals/socom.png",
        category: "skill",
        description: "The advanced medical qualification for 68W Combat Medics. SOCM-qualified medics can perform trauma surgery, advanced pharmacology, and prolonged field care in austere environments without evacuation support. They are the lifeline of any squad.",
        requirements: ["MOS 68W", "Complete SOCM didactic phase", "Pass clinical rotations", "Demonstrate surgical and trauma skills", "National Registry EMT-P equivalent certification"],
      },
      {
        name: "Demolitions Qualification",
        abbr: "Demo",
        category: "skill",
        description: "Advanced certification in military demolitions, breaching, and explosive ordnance. Demo-qualified soldiers can plan and execute demolition operations including building breaches, bridge drops, obstacle reduction, and improvised munitions construction.",
        requirements: ["Open to all MOS (11-series preferred)", "Complete demolitions safety course", "Pass explosive ordnance identification exam", "Execute qualifying demolition operations", "Annual recertification required"],
      },
      {
        name: "Special Operations Diver",
        abbr: "Combat Diver",
        image: "/insignia/quals/Combat-Diver-69c21e751201e.png",
        category: "skill",
        description: "Qualifies soldiers for underwater infiltration operations using open and closed-circuit diving systems. Combat Divers can conduct beach reconnaissance, underwater demolitions, and maritime interdiction operations.",
        requirements: ["Minimum E-5 rank", "Pass Combat Diver screening test", "Complete pool and open water phases", "Qualify on closed-circuit rebreather", "Pass underwater navigation evaluation"],
      },
      {
        name: "Joint Terminal Attack Controller",
        abbr: "JTAC",
        category: "skill",
        description: "Certifies the soldier to direct close air support (CAS) and other air-delivered ordnance onto enemy targets. JTAC-qualified operators are essential for coordinating air-ground operations and force multiplication.",
        requirements: ["Minimum E-6 rank or officer", "Complete JTAC academic training", "Pass CAS simulation evaluations", "Execute live control of air assets", "Annual recertification required"],
      },
    ],
  },
];

const CAT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  tab:   { bg: "rgba(201,161,40,0.08)",  border: "rgba(201,161,40,0.2)", text: "#c9a128" },
  badge: { bg: "rgba(26,122,112,0.08)",  border: "rgba(26,122,112,0.2)", text: "#1a9a8a" },
  skill: { bg: "rgba(184,152,88,0.08)",  border: "rgba(184,152,88,0.2)", text: "#b89858" },
};

function QualCard({ qual }: { qual: Qualification }) {
  const color = CAT_COLORS[qual.category];
  return (
    <div className="bg-[#0f120a] border border-[#1c2014] rounded-lg overflow-hidden hover:border-[#252a1c] transition-colors">
      <div className="flex items-start gap-5 p-5">
        <div className="w-24 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-2" style={{
          backgroundColor: color.bg, border: `1px solid ${color.border}`,
        }}>
          {qual.image ? (
            <Image src={qual.image} alt={qual.name} width={88} height={52} className="object-contain w-full h-full" />
          ) : (
            <Star className="w-6 h-6" style={{ color: color.text }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-black" style={{ color: "#e8e4d8" }}>{qual.name}</h3>
            <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded" style={{
              color: color.text, backgroundColor: color.bg,
            }}>{qual.category}</span>
          </div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#6b6a58" }}>{qual.abbr}</p>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#8a8870" }}>{qual.description}</p>
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1.5" style={{ color: "#6b6a58" }}>Requirements</p>
            <ul className="space-y-1">
              {qual.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b6a58" }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function QualificationsPage() {
  return (
    <div className="bg-[#090b07] text-[#e8e4d8]">
      {/* Header */}
      <section className="relative py-20 px-6 overflow-hidden bg-black-mc grain" style={{ borderBottom: "1px solid #1c2014" }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(#c9a128 1px, transparent 1px), linear-gradient(90deg, #c9a128 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4" style={{ color: "#c9a128" }} />
            <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#c9a128" }}>Military Headquarters</p>
          </div>
          <h1 className="text-5xl font-black mb-4" style={{ color: "#e8e4d8" }}>Qualifications</h1>
          <p className="max-w-xl leading-relaxed" style={{ color: "#8a8870" }}>
            Badges, tabs, and skill qualifications authorized by 1st Plt, A Co, 1/75th RGR. Rangers earn these through completing training courses, operational experience, and demonstrating proficiency.
          </p>
        </div>
      </section>

      {/* Sections */}
      {QUALIFICATIONS.map((sec) => (
        <section key={sec.section} className="py-12 px-6 border-t border-[#1c2014]">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#c9a128" }} />
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "#c9a128" }}>{sec.subtitle}</p>
                <h2 className="text-xl font-black" style={{ color: "#e8e4d8" }}>{sec.section}</h2>
              </div>
              <div className="h-px flex-1" style={{ backgroundColor: "#1c2014" }} />
              <span className="text-sm font-black" style={{ color: "#8a8870" }}>{sec.items.length}</span>
            </div>
            <div className="space-y-4">
              {sec.items.map((q) => <QualCard key={q.abbr} qual={q} />)}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
