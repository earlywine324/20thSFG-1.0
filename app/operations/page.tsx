import Link from "next/link";
import { Target, Radio, Eye, Users, BookOpen, Calendar, Clock, MapPin, Plus } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { checkAdmin } from "@/app/lib/dal";

/* ─── TYPES ─── */
type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  time: string | null;
  type: string;
  lead: string | null;
  element: string | null;
  theatre: string | null;
  status: string;
  result: string | null;
  kia: number;
  wia: number;
  summary: string | null;
  op_number: string | null;
};

/* ─── HELPERS ─── */
function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const days   = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
}

function formatOpDate(iso: string): string {
  const d = new Date(iso);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${String(d.getUTCDate()).padStart(2,"0")} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function currentMonthLabel(): string {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const now = new Date();
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

const TYPE_COLORS: Record<string, string> = {
  "FTX / Operation": "text-red-400 bg-red-400/10",
  "Squad Drill":     "text-amber-400 bg-amber-400/10",
  "Candidate Training":   "text-blue-400 bg-blue-400/10",
  "Course / School": "text-green-400 bg-green-400/10",
  "Ceremony":        "text-purple-400 bg-purple-400/10",
};

const EVENT_TYPES = [
  { color: "bg-red-400",    label: "FTX / Operation" },
  { color: "bg-amber-400",  label: "Squad Drill" },
  { color: "bg-blue-400",   label: "Candidate Training" },
  { color: "bg-green-400",  label: "Course / School" },
  { color: "bg-purple-400", label: "Ceremony" },
];

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default async function OperationsPage() {
  const supabase = await createClient();
  const admin = await checkAdmin();

  /* Fetch upcoming events — event_date >= today, sorted soonest first */
  const today = new Date().toISOString().split("T")[0];
  const { data: upcomingRaw } = await supabase
    .from("events")
    .select("*")
    .eq("status", "UPCOMING")
    .gte("event_date", today)
    .order("event_date", { ascending: true });

  /* Fetch past ops — status = COMPLETED, sorted most recent first */
  const { data: pastRaw } = await supabase
    .from("events")
    .select("*")
    .eq("status", "COMPLETED")
    .order("event_date", { ascending: false });

  const upcoming: Event[] = upcomingRaw || [];
  const pastOps:  Event[] = pastRaw    || [];

  return (
    <div className="bg-[#090b07] text-[#e8e4d8]">

      {/* ── PAGE HEADER ── */}
      <section
        className="relative py-20 px-6 overflow-hidden bg-black-mc grain"
        style={{ borderBottom: "1px solid #1c2014" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#c9a128 1px, transparent 1px), linear-gradient(90deg, #c9a128 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c9a128] mb-4">
            Operational Tempo
          </p>
          <h1 className="text-5xl font-black text-[#e8e4d8] mb-4">Operations & Training</h1>
          <p className="text-[#8a8870] max-w-xl leading-relaxed">
            Upcoming operations, training events, and sanitized mission history for the LIONHEART Program.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { icon: Target,   label: "Operations Completed", value: String(pastOps.filter(e => e.type === "FTX / Operation").length) },
              { icon: Calendar, label: "Upcoming Events",       value: String(upcoming.length) },
              { icon: BookOpen, label: "Past Ops on Record",    value: String(pastOps.length) },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 bg-[#0f120a] border border-[#1c2014] rounded-lg px-4 py-3"
              >
                <Icon className="w-4 h-4 text-[#c9a128]" />
                <div>
                  <p className="text-lg font-black text-[#e8e4d8] leading-none">{value}</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#8a8870]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c9a128] mb-2">
                {currentMonthLabel()}
              </p>
              <h2 className="text-3xl font-black text-[#e8e4d8]">Upcoming Events</h2>
            </div>
            <div className="flex items-center gap-4">
              {/* Legend */}
              <div className="flex flex-wrap gap-3">
                {EVENT_TYPES.map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#8a8870]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Admin: create event button */}
              {admin && (
                <Link
                  href="/operations/new"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase transition-all shrink-0"
                  style={{
                    backgroundColor: "rgba(201,161,40,0.1)",
                    border: "1px solid rgba(201,161,40,0.3)",
                    color: "#c9a128",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Event
                </Link>
              )}
            </div>
          </div>

          {/* Events list */}
          {upcoming.length === 0 ? (
            <div
              className="rounded-lg p-12 text-center"
              style={{ backgroundColor: "#0c0f0a", border: "1px dashed #1c2014" }}
            >
              <Calendar className="w-8 h-8 text-[#252a1c] mx-auto mb-3" />
              <p className="text-[#4a4838] text-sm font-bold tracking-widest uppercase mb-1">
                No Upcoming Events
              </p>
              {admin && (
                <Link
                  href="/operations/new"
                  className="text-[#c9a128] text-xs font-bold hover:underline"
                >
                  + Create the first event
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#0f120a] border border-[#1c2014] rounded-lg overflow-hidden hover:border-[#252a1c] transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Date column */}
                    <div className="md:w-40 shrink-0 bg-[#090b07] border-b md:border-b-0 md:border-r border-[#1c2014] px-5 py-4 flex md:flex-col items-center justify-between md:justify-center gap-3 md:gap-2 md:text-center">
                      <div>
                        <p className="text-[#c9a128] text-xs font-black tracking-wider">
                          {formatEventDate(event.event_date)}
                        </p>
                        {event.time && (
                          <p className="text-[#6b6a58] text-[10px] flex items-center gap-1 md:justify-center mt-0.5">
                            <Clock className="w-3 h-3" /> {event.time}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded ${
                          TYPE_COLORS[event.type] ?? "text-[#8a8870] bg-[#1c2014]"
                        }`}
                      >
                        {event.type}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <h3 className="text-[#e8e4d8] font-bold text-sm mb-2">{event.title}</h3>
                      {event.description && (
                        <p className="text-[#8a8870] text-xs leading-relaxed mb-3">
                          {event.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-xs text-[#6b6a58]">
                        {event.element && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.element}
                          </span>
                        )}
                        {event.lead && (
                          <span className="flex items-center gap-1">
                            <Radio className="w-3 h-3" />
                            Lead: {event.lead}
                          </span>
                        )}
                        {event.theatre && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.theatre}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PAST OPS LOG ── */}
      <section className="py-16 px-6 border-t border-[#1c2014] bg-[#0f120a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c9a128] mb-2">
              After-Action Reports
            </p>
            <h2 className="text-3xl font-black text-[#e8e4d8]">Operational History</h2>
          </div>

          {pastOps.length === 0 ? (
            <div
              className="rounded-lg p-10 text-center"
              style={{ backgroundColor: "#090b07", border: "1px dashed #1c2014" }}
            >
              <p className="text-[#4a4838] text-xs font-bold tracking-widest uppercase">
                No completed operations on record yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1c2014]">
                    {["Op #", "Name", "Type", "Date", "Theatre", "Element", "Result", "Casualties"].map((h) => (
                      <th
                        key={h}
                        className="text-[10px] font-black tracking-widest uppercase text-[#8a8870] pb-3 text-left pr-6 first:pl-0"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                  {pastOps.map((op) => (
                    <tr key={op.id} className="hover:bg-[#090b07]/50 transition-colors">
                      <td className="py-4 pr-6">
                        <span className="text-[10px] font-black tracking-wider text-[#c9a128] bg-[#c9a128]/10 px-2 py-0.5 rounded">
                          {op.op_number ?? "—"}
                        </span>
                      </td>
                      <td className="py-4 pr-6">
                        <p className="text-[#e8e4d8] font-bold text-xs">{op.title}</p>
                        {op.summary && (
                          <p className="text-[#6b6a58] text-[10px] mt-0.5 leading-relaxed max-w-xs">
                            {op.summary}
                          </p>
                        )}
                      </td>
                      <td className="py-4 pr-6">
                        <span
                          className={`text-[10px] font-bold tracking-wider ${
                            TYPE_COLORS[op.type]?.split(" ")[0] ?? "text-[#8a8870]"
                          }`}
                        >
                          {op.type}
                        </span>
                      </td>
                      <td className="py-4 pr-6 text-[#8a8870] text-xs whitespace-nowrap">
                        {formatOpDate(op.event_date)}
                      </td>
                      <td className="py-4 pr-6">
                        {op.theatre ? (
                          <span className="flex items-center gap-1 text-[#8a8870] text-xs">
                            <MapPin className="w-3 h-3" /> {op.theatre}
                          </span>
                        ) : (
                          <span className="text-[#4a4838] text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 pr-6 text-[#8a8870] text-xs">{op.element ?? "—"}</td>
                      <td className="py-4 pr-6">
                        <span
                          className={`text-[10px] font-black tracking-wider ${
                            op.result === "SUCCESS"   ? "text-green-400" :
                            op.result === "FAILED"    ? "text-red-400"   :
                            op.result === "COMPLETED" ? "text-green-400" :
                                                        "text-[#8a8870]"
                          }`}
                        >
                          {op.result ?? "—"}
                        </span>
                      </td>
                      <td className="py-4 text-xs">
                        <span className="text-red-400">{op.kia ?? 0} KIA</span>
                        <span className="text-[#6b6a58] mx-1">/</span>
                        <span className="text-amber-400">{op.wia ?? 0} WIA</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── DOCTRINE ── */}
      <section className="py-16 px-6 border-t border-[#1c2014]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#c9a128] mb-4">
                Operational Standard
              </p>
              <h2 className="text-3xl font-black text-[#e8e4d8] mb-6">How We Operate</h2>
              <div className="space-y-4 text-[#8a8870] text-sm leading-relaxed">
                <p>
                  All operations follow a structured 5-phase cycle: Intelligence preparation, mission
                  planning, rehearsal, execution, and after-action review.
                </p>
                <p>
                  Operations are briefed using the standard Army OPORD format. Every operator is expected
                  to understand their role, the commander&#39;s intent, and the scheme of maneuver before
                  stepping off.
                </p>
                <p>
                  Friday events are typically training or squad-level drills. Saturday events are the
                  primary operational period. All hands are expected at Saturday ops unless excused with
                  24-hour notice.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Eye,      title: "Pre-Mission Intel Brief", body: "All ops begin with an intelligence preparation of the battlefield. S2 presents OPFOR disposition, terrain analysis, and weather." },
                { icon: Target,   title: "OPORD Delivery",          body: "Commanders issue orders in standard 5-paragraph OPORD format. No freewheeling." },
                { icon: Radio,    title: "Comms Plan",               body: "PACE (Primary, Alternate, Contingency, Emergency) comms plan required for every operation." },
                { icon: BookOpen, title: "After-Action Review",      body: "Every op ends with a structured AAR. Sustains, improves, and individual callouts." },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="bg-[#0f120a] border border-[#1c2014] rounded-lg p-4 flex gap-4 hover:border-[#252a1c] transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-[#1a7a70]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-[#1a7a70]" />
                  </div>
                  <div>
                    <p className="text-[#e8e4d8] font-bold text-xs mb-1">{title}</p>
                    <p className="text-[#8a8870] text-xs leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
