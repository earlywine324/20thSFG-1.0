import Image from "next/image";
import { Shield } from "lucide-react";

/* ─── RANK DATA ─── */

type Rank = {
  grade: string;
  abbr: string;
  title: string;
  image: string;
  description: string;
  requirements: string[];
};

const ENLISTED: Rank[] = [
  {
    grade: "E-1", abbr: "PVT", title: "Private", image: "/insignia/ranks/E1-PVT-69a12d80c6a4e.png",
    description: "Entry-level rank for Rangers entering the RASP pipeline. Privates are in initial training and have no leadership responsibilities. They focus on meeting the physical and tactical standards required to earn a place in the platoon.",
    requirements: ["Complete enlistment application", "Pass initial screening", "Begin RASP training pipeline"],
  },
  {
    grade: "E-2", abbr: "PV2", title: "Private Second Class", image: "/insignia/ranks/E2-PV2-6999ba19e286b.png",
    description: "Awarded upon successful completion of RASP. PV2s have earned their place in the platoon and are beginning to prove themselves as Rangers. They execute assigned tasks and focus on mastering individual soldier skills.",
    requirements: ["Complete RASP", "Minimum 30 days time in service", "Squad leader recommendation"],
  },
  {
    grade: "E-3", abbr: "PFC", title: "Private First Class", image: "/insignia/ranks/E3-PFC-69b67ad12756e.png",
    description: "An experienced junior Ranger who has demonstrated dedication and competence in the platoon. PFCs assist in training newer members, contribute to fire team operations, and continue to develop their individual skills.",
    requirements: ["Minimum 60 days as PV2", "Demonstrated MOS proficiency", "Participation in at least 2 FTX operations"],
  },
  {
    grade: "E-4", abbr: "SPC", title: "Specialist", image: "/insignia/ranks/E4-SPC-69b67ad8ccce6.png",
    description: "A qualified Ranger and subject matter expert in their MOS. Specialists are the backbone of the fire team, executing missions with skill and reliability. They are fully trusted operators with proven performance in the platoon.",
    requirements: ["Minimum 90 days as PFC", "MOS qualification complete", "Minimum 4 FTX operations attended", "Team leader recommendation"],
  },
  {
    grade: "E-4", abbr: "CPL", title: "Corporal", image: "/insignia/ranks/E4X-CPL-69b67ae206ef4.png",
    description: "The first NCO rank in the Ranger Regiment. Corporals lead a buddy team and hold direct authority over junior enlisted Rangers. They are responsible for the training, welfare, and discipline of their soldiers during operations.",
    requirements: ["Current SPC or equivalent", "Demonstrated leadership in the fire team", "Squad leader recommendation", "Leadership evaluation board"],
  },
];

const NCO: Rank[] = [
  {
    grade: "E-5", abbr: "SGT", title: "Sergeant", image: "/insignia/ranks/E5-SGT-6999b9cc6474e.png",
    description: "A Fire Team Leader — one of the most critical leadership positions in a Ranger platoon. Sergeants lead a 4-man fire team in all operations, making immediate tactical decisions under fire. They are the primary link between the Squad Leader and individual Rangers.",
    requirements: ["Minimum 90 days as CPL", "Demonstrated fire team leadership", "Minimum 6 FTX operations attended", "Passed NCO evaluation board"],
  },
  {
    grade: "E-6", abbr: "SSG", title: "Staff Sergeant", image: "/insignia/ranks/E6-SSG-6999b9b952f93.png",
    description: "The Squad Leader — responsible for leading a 9-man Ranger squad. Staff Sergeants plan and execute squad-level operations, manage their soldiers' welfare and training, and are the primary tactical leaders during direct action missions. There are three SSG Squad Leader billets in 1st Platoon.",
    requirements: ["Minimum 120 days as SGT", "Ranger Tab earned", "Demonstrated squad leadership", "Minimum 10 operations attended", "Platoon Sergeant recommendation"],
  },
  {
    grade: "E-7", abbr: "SFC", title: "Sergeant First Class", image: "/insignia/ranks/E7-SFC-6999b9a7c5144.png",
    description: "The Platoon Sergeant — the most senior NCO in 1st Platoon and the right hand of the Platoon Leader. The SFC is responsible for all enlisted matters, platoon readiness, training standards, and mission execution. In the Ranger Regiment, the Platoon Sergeant is the tactical backbone of the unit.",
    requirements: ["Minimum 180 days as SSG", "Successful tour as Squad Leader", "Ranger Tab and Airborne qualification", "Company Commander recommendation"],
  },
  {
    grade: "E-8", abbr: "MSG", title: "Master Sergeant", image: "/insignia/ranks/E8-MSG-6999b983e4705.png",
    description: "A senior NCO serving in a battalion-level staff or senior advisor role. Master Sergeants provide experienced guidance on operations, training, and personnel. In the Ranger Regiment, MSG billets exist at battalion staff and serve as senior technical experts.",
    requirements: ["Minimum 240 days as SFC", "Proven record as Platoon Sergeant", "Leadership evaluation board", "Battalion commander recommendation"],
  },
  {
    grade: "E-8", abbr: "1SG", title: "First Sergeant", image: "/insignia/ranks/E8X-1SG-6999b918e1887.png",
    description: "The Company First Sergeant — the senior enlisted leader of Alpha Company and principal advisor to the Company Commander on all enlisted matters. The 1SG owns company discipline, welfare, training standards, and administrative readiness. In the Ranger Regiment, the First Sergeant is the backbone of company-level leadership.",
    requirements: ["Minimum 240 days as SFC", "Proven record as Platoon Sergeant", "Selected over MSG by company commander", "Battalion commander approval"],
  },
  {
    grade: "E-9", abbr: "SGM", title: "Sergeant Major", image: "/insignia/ranks/E9-SGM-6999b8ff8e0f4.png",
    description: "A senior enlisted advisor at the battalion level. Sergeant Majors in the Ranger Regiment advise the battalion commander on all enlisted matters, discipline, training standards, and unit readiness. They set the standard for Ranger professionalism across the battalion.",
    requirements: ["Minimum 300 days as MSG", "Exceptional service record", "Senior leadership board selection", "Battalion commander recommendation"],
  },
  {
    grade: "E-9", abbr: "CSM", title: "Command Sergeant Major", image: "/insignia/ranks/E9X-CSM-6999b8e3d9ec0.png",
    description: "The senior enlisted leader of the unit, serving as the principal advisor to the commanding officer on all matters affecting enlisted Rangers. The CSM sets the tone for culture, discipline, and standards throughout the regiment. This is the highest enlisted rank in the unit.",
    requirements: ["Current SGM", "Exemplary leadership record", "Selected by the Commanding Officer", "Minimum 1 year total time in service"],
  },
];

const OFFICER: Rank[] = [
  {
    grade: "O-1", abbr: "2LT", title: "Second Lieutenant", image: "/insignia/ranks/O1-2LT-6999b57050da7.png",
    description: "An entry-level commissioned officer learning the fundamentals of Ranger leadership. Second Lieutenants may serve as assistant platoon leaders or in training billets, gaining the tactical foundation required to lead Rangers in combat.",
    requirements: ["Officer candidate program completion", "Infantry Officer Basic Course equivalent", "Ranger Assessment complete"],
  },
  {
    grade: "O-2", abbr: "1LT", title: "First Lieutenant", image: "/insignia/ranks/O2-1LT-6999b55b25615.png",
    description: "The Platoon Leader of 1st Platoon — the primary commissioned officer responsible for planning, leading, and accounting for all Rangers in the platoon. The 1LT works in direct partnership with the Platoon Sergeant (SFC) to execute the company commander's intent. This is the most important officer billet in a Ranger platoon.",
    requirements: ["Minimum 180 days as 2LT or direct appointment", "Ranger Tab", "Demonstrated platoon-level leadership", "Company Commander selection"],
  },
  {
    grade: "O-3", abbr: "CPT", title: "Captain", image: "/insignia/ranks/O3-CPT-6999b54675e25.png",
    description: "The Company Commander of Alpha Company. The Captain is responsible for the overall readiness, training, discipline, and operations of the company. In the Ranger Regiment, CPTs are highly experienced combat leaders who have proven themselves through multiple platoon-level deployments.",
    requirements: ["Minimum 240 days as 1LT", "Successful platoon command tour", "Ranger Tab and Airborne qualification", "Battalion commander selection"],
  },
  {
    grade: "O-4", abbr: "MAJ", title: "Major", image: "/insignia/ranks/O4-MAJ-6999b5341b384.png",
    description: "A field-grade officer serving as the Battalion Executive Officer (XO) or operations officer (S3). Majors coordinate operations across the battalion, manage planning cycles, and advise the battalion commander. They have proven themselves in multiple company-level assignments.",
    requirements: ["Minimum 300 days as CPT", "Successful company command", "Senior leader course equivalent", "Battalion commander recommendation"],
  },
  {
    grade: "O-5", abbr: "LTC", title: "Lieutenant Colonel", image: "/insignia/ranks/O5-LTC-6999b470e637c.png",
    description: "The Battalion Commander — commanding the 1st Battalion, 75th Ranger Regiment. The LTC has full command authority and responsibility for all training, readiness, and operations of the battalion. In the Ranger Regiment, the Battalion Commander leads one of the most elite light infantry units in the U.S. Army.",
    requirements: ["Minimum 360 days as MAJ", "Battalion-level staff and command experience", "Regimental commander recommendation"],
  },
  {
    grade: "O-6", abbr: "COL", title: "Colonel", image: "/insignia/ranks/O6-COL-6999b3e5dc0ae.png",
    description: "The Regimental Commander of the 75th Ranger Regiment. The Colonel has ultimate authority and responsibility for the entire regiment's operations, personnel, training, and readiness. This is the highest command billet in the unit and is selected by unit leadership council.",
    requirements: ["Minimum 360 days as LTC", "Proven command at battalion level", "Selected by unit leadership council"],
  },
];

/* ─── RANK CARD ─── */
function RankCard({ rank }: { rank: Rank }) {
  return (
    <div className="bg-[#0f120a] border border-[#1c2014] rounded-lg overflow-hidden hover:border-[#252a1c] transition-colors">
      <div className="flex items-start gap-5 p-5">
        {/* Insignia */}
        <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" style={{
          backgroundColor: "rgba(77,182,224,0.06)",
          border: "1px solid rgba(77,182,224,0.15)",
        }}>
          <Image src={rank.image} alt={rank.title} width={48} height={48} className="object-contain" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded" style={{
              color: "#4db6e0", backgroundColor: "rgba(77,182,224,0.1)",
            }}>{rank.grade}</span>
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#8a8870" }}>{rank.abbr}</span>
          </div>
          <h3 className="text-base font-black mb-2" style={{ color: "#e8e4d8" }}>{rank.title}</h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color: "#8a8870" }}>{rank.description}</p>

          {/* Requirements */}
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-1.5" style={{ color: "#6b6a58" }}>Requirements</p>
            <ul className="space-y-1">
              {rank.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#6b6a58" }}>
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "#4db6e0" }} />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SECTION ─── */
function RankSection({ title, subtitle, ranks }: { title: string; subtitle: string; ranks: Rank[] }) {
  return (
    <section className="py-12 px-6 border-t border-[#1c2014]">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-10 rounded-full" style={{ backgroundColor: "#4db6e0" }} />
          <div>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "#4db6e0" }}>{subtitle}</p>
            <h2 className="text-xl font-black" style={{ color: "#e8e4d8" }}>{title}</h2>
          </div>
          <div className="h-px flex-1" style={{ backgroundColor: "#1c2014" }} />
          <span className="text-sm font-black" style={{ color: "#8a8870" }}>{ranks.length}</span>
        </div>
        <div className="space-y-4">
          {ranks.map((r) => <RankCard key={r.abbr + r.grade} rank={r} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ─── */
export default function RanksPage() {
  return (
    <div className="bg-[#090b07] text-[#e8e4d8]">
      {/* Header */}
      <section className="relative py-20 px-6 overflow-hidden bg-black-mc grain" style={{ borderBottom: "1px solid #1c2014" }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(#4db6e0 1px, transparent 1px), linear-gradient(90deg, #4db6e0 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4" style={{ color: "#4db6e0" }} />
            <p className="text-[10px] font-black tracking-[0.35em] uppercase" style={{ color: "#4db6e0" }}>Military Headquarters</p>
          </div>
          <h1 className="text-5xl font-black mb-4" style={{ color: "#e8e4d8" }}>Rank Structure</h1>
          <p className="max-w-xl leading-relaxed" style={{ color: "#8a8870" }}>
            Complete rank structure for 1st Platoon, Alpha Company, 1/75th Ranger Regiment. Ranks follow U.S. Army conventions adapted for our Bellum milsim unit.
          </p>

          {/* Key billets callout */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { billet: "Company Commander", rank: "CPT" },
              { billet: "Company First Sergeant", rank: "1SG" },
              { billet: "Platoon Leader", rank: "1LT" },
              { billet: "Platoon Sergeant", rank: "SFC" },
              { billet: "Squad Leader", rank: "SSG" },
              { billet: "Fire Team Leader", rank: "SGT" },
              { billet: "Ranger", rank: "SPC/CPL" },
            ].map(({ billet, rank }) => (
              <div key={billet} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{
                backgroundColor: "rgba(77,182,224,0.06)",
                border: "1px solid rgba(77,182,224,0.15)",
              }}>
                <span className="text-[10px] font-black tracking-wider uppercase" style={{ color: "#4db6e0" }}>{rank}</span>
                <span className="text-[10px]" style={{ color: "#505870" }}>—</span>
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: "#8a8870" }}>{billet}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RankSection title="Enlisted Ranks" subtitle="E-1 through E-4 · Junior Rangers" ranks={ENLISTED} />
      <RankSection title="Non-Commissioned Officers" subtitle="E-5 through E-9 · Ranger Leadership" ranks={NCO} />
      <RankSection title="Commissioned Officers" subtitle="O-1 through O-6 · Officer Corps" ranks={OFFICER} />
    </div>
  );
}
