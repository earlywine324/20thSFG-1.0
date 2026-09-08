import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { checkAdmin } from "@/app/lib/dal";
import { getRankImage } from "@/app/lib/rank-images";
import { calcDuration, parseMilDate } from "@/app/lib/promotions";

function formatLastActive(dateStr: string | null | undefined): string {
  const d = parseMilDate(dateStr);
  if (!d) return "—";
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) !== 1 ? "s" : ""} ago`;
  return dateStr ?? "—";
}
import { QUAL_IMAGES } from "@/app/lib/qual-images";
import { AWARD_IMAGES } from "@/app/lib/award-images";
import ProfileTabs from "../components/ProfileTabs";
import ImageUpload from "../components/ImageUpload";
import ServiceRecordTab from "./tabs/ServiceRecordTab";
import AwardRecordTab from "./tabs/AwardRecordTab";
import CombatRecordTab from "./tabs/CombatRecordTab";
import RankRecordTab from "./tabs/RankRecordTab";
import AssignmentRecordTab from "./tabs/AssignmentRecordTab";
import QualificationRecordTab from "./tabs/QualificationRecordTab";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "ACTIVE DUTY": "bg-green-500 text-white",
    RESERVE: "bg-blue-500 text-white",
    LOA: "bg-amber-500 text-white",
    DISCHARGED: "bg-red-500 text-white",
    VACANT: "bg-gray-600 text-gray-300",
  };
  return (
    <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded ${map[status] || map.VACANT}`}>
      {status}
    </span>
  );
}

export default async function SoldierProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: soldier } = await supabase
    .from("soldiers")
    .select("*")
    .eq("id", id)
    .single();

  if (!soldier) notFound();

  const admin = await checkAdmin();
  const isVacant = soldier.status === "VACANT";
  const rankImg = getRankImage(soldier.rank);

  const serviceRecord = Array.isArray(soldier.service_record) ? soldier.service_record : [];
  const awards = Array.isArray(soldier.awards) ? soldier.awards : [];
  const rankHistory = Array.isArray(soldier.rank_history) ? soldier.rank_history : [];
  const assignmentHistory = Array.isArray(soldier.assignment_history) ? soldier.assignment_history : [];
  const combatRecord = Array.isArray(soldier.combat_record) ? soldier.combat_record : [];
  const qualRecord = Array.isArray(soldier.qualification_record) ? soldier.qualification_record : [];
  const quals: string[] = Array.isArray(soldier.quals) ? soldier.quals : [];

  return (
    <div className="bg-[#1a1d23] text-[#e8e4d8] min-h-screen">

      {/* ─────────────────────────────────────── */}
      {/* TOP HEADER BAR — name, status, title    */}
      {/* ─────────────────────────────────────── */}
      <div style={{ backgroundColor: "#22262e", borderBottom: "1px solid #2d3139" }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Small rank icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0"
                style={{ backgroundColor: "rgba(201,161,40,0.1)", border: "2px solid #c9a128" }}>
                {rankImg ? (
                  <Image src={rankImg} alt={soldier.rank} width={24} height={24} className="object-contain" />
                ) : (
                  <span className="text-xs font-black text-[#c9a128]">{soldier.rank}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black" style={{ color: "#e8e4d8" }}>{soldier.name}</h1>
                  <StatusBadge status={soldier.status} />
                </div>
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  {soldier.rank_full}, {soldier.role}
                </p>
              </div>
            </div>
            <Link
              href="/roster"
              className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded transition-colors"
              style={{ color: "#9ca3af", border: "1px solid #2d3139" }}
            >
              <ArrowLeft className="w-3 h-3 inline mr-1.5" />
              Back to Roster
            </Link>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/* FULL-WIDTH SOLDIER PHOTO                */}
      {/* ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-center rounded-lg overflow-hidden" style={{ backgroundColor: "#22262e", border: "1px solid #2d3139" }}>
          {admin ? (
            <ImageUpload
              soldierId={soldier.id}
              imageType="photo"
              currentUrl={soldier.photo_url || null}
              width={960}
              height={500}
              label="Upload Soldier Photo"
            />
          ) : soldier.photo_url ? (
            <div className="relative w-full" style={{ height: 500 }}>
              <Image src={soldier.photo_url} alt={soldier.name} fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full" style={{ height: 500 }}>
              <p className="text-sm italic" style={{ color: "#6b7280" }}>No soldier photo uploaded.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────── */}
      {/* TWO-COLUMN: Left info + Right tabs      */}
      {/* ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ═══ LEFT COLUMN (≈25%) ═══ */}
          <div className="lg:w-[280px] shrink-0 space-y-0">

            {/* Rank Card */}
            <div className="rounded-t-lg p-6 text-center" style={{ backgroundColor: "#22262e", border: "1px solid #2d3139" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#9ca3af", borderBottom: "1px solid #2d3139", paddingBottom: "8px" }}>
                Rank
              </p>
              <div className="flex justify-center mb-4">
                {rankImg ? (
                  <Image src={rankImg} alt={soldier.rank} width={72} height={72} className="object-contain" />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ backgroundColor: "#c9a128" }}>
                    <span className="text-2xl font-black" style={{ color: "#1a1d23" }}>{soldier.rank}</span>
                  </div>
                )}
              </div>
              <p className="text-base font-bold" style={{ color: "#e8e4d8" }}>{soldier.rank_full}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{soldier.rank === soldier.rank_full ? soldier.rank : `${soldier.rank}`}</p>
            </div>

            {/* Assignment Card */}
            <div className="p-5" style={{ backgroundColor: "#22262e", borderLeft: "1px solid #2d3139", borderRight: "1px solid #2d3139", borderBottom: "1px solid #2d3139" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#9ca3af", borderBottom: "1px solid #2d3139", paddingBottom: "8px" }}>
                Assignment
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Specialty</p>
                  <p className="text-sm" style={{ color: "#e8e4d8" }}>{soldier.mos}</p>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Unit</p>
                  <p className="text-sm" style={{ color: "#e8e4d8" }}>{soldier.unit}</p>
                  {soldier.team && (
                    <p className="text-xs" style={{ color: "#6b7280" }}>({soldier.team})</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Position</p>
                  <p className="text-sm" style={{ color: "#e8e4d8" }}>{soldier.role}</p>
                </div>
              </div>
            </div>

            {/* Service Info Card */}
            <div className="p-5" style={{ backgroundColor: "#22262e", borderLeft: "1px solid #2d3139", borderRight: "1px solid #2d3139", borderBottom: "1px solid #2d3139" }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#9ca3af", borderBottom: "1px solid #2d3139", paddingBottom: "8px" }}>
                Service
              </p>
              <div className="space-y-4">
                {soldier.enlist_date && (
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Enlisted</p>
                    <p className="text-sm" style={{ color: "#e8e4d8" }}>{soldier.enlist_date}</p>
                  </div>
                )}
                {soldier.enlist_date && (
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Time in Service</p>
                    <p className="text-sm" style={{ color: "#e8e4d8" }}>{calcDuration(soldier.enlist_date)}</p>
                  </div>
                )}
                {soldier.last_promotion && (
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Time in Grade</p>
                    <p className="text-sm" style={{ color: "#e8e4d8" }}>{calcDuration(soldier.last_promotion)}</p>
                  </div>
                )}
                {soldier.last_active && (
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Last Active</p>
                    <p className="text-sm" style={{ color: "#e8e4d8" }}>{formatLastActive(soldier.last_active)}</p>
                    <p className="text-[10px]" style={{ color: "#6b7280" }}>{soldier.last_active}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Card */}
            {(soldier.discord_id || soldier.timezone || soldier.callsign) && (
              <div className="p-5" style={{ backgroundColor: "#22262e", borderLeft: "1px solid #2d3139", borderRight: "1px solid #2d3139", borderBottom: "1px solid #2d3139" }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#9ca3af", borderBottom: "1px solid #2d3139", paddingBottom: "8px" }}>
                  Contact
                </p>
                <div className="space-y-4">
                  {soldier.callsign && (
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Callsign</p>
                      <p className="text-sm font-bold" style={{ color: "#c9a128" }}>{soldier.callsign}</p>
                    </div>
                  )}
                  {soldier.discord_id && (
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Discord</p>
                      <p className="text-sm" style={{ color: "#e8e4d8" }}>{soldier.discord_id}</p>
                    </div>
                  )}
                  {soldier.timezone && (
                    <div>
                      <p className="text-xs font-bold" style={{ color: "#9ca3af" }}>Timezone</p>
                      <p className="text-sm" style={{ color: "#e8e4d8" }}>{soldier.timezone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bottom cap for left column cards */}
            <div className="rounded-b-lg h-1" style={{ backgroundColor: "#22262e", borderLeft: "1px solid #2d3139", borderRight: "1px solid #2d3139", borderBottom: "1px solid #2d3139" }} />
          </div>

          {/* ═══ RIGHT COLUMN (≈75%) — Tabs ═══ */}
          <div className="flex-1 min-w-0">
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: "#22262e", border: "1px solid #2d3139" }}>
              <ProfileTabs>
                {{
                  Profile: (
                    <div className="space-y-6">
                      {/* Qualifications */}
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Qualifications</p>
                        {quals.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {quals.map((q) => {
                              const img = QUAL_IMAGES[q];
                              return img ? (
                                <div key={q} title={q} className="flex flex-col items-center gap-1">
                                  <div className="w-20 h-12 rounded-lg flex items-center justify-center p-1.5" style={{ backgroundColor: "rgba(77,182,224,0.07)", border: "1px solid rgba(77,182,224,0.18)" }}>
                                    <Image src={img} alt={q} width={72} height={40} className="object-contain w-full h-full" />
                                  </div>
                                  <span className="text-[8px] font-black tracking-wider uppercase text-center leading-tight" style={{ color: "#8892a4", maxWidth: 56 }}>{q}</span>
                                </div>
                              ) : (
                                <span key={q} className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded self-center" style={{
                                  color: "#4db6e0",
                                  backgroundColor: "rgba(77,182,224,0.08)",
                                  border: "1px solid rgba(77,182,224,0.18)",
                                }}>
                                  {q}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs italic" style={{ color: "#6b7280" }}>No qualifications recorded.</p>
                        )}
                      </div>

                      {/* Awards */}
                      {awards.length > 0 && (
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Awards &amp; Decorations</p>
                          <div className="flex flex-wrap gap-3">
                            {awards.map((a: { name: string }, i: number) => {
                              const img = AWARD_IMAGES[a.name];
                              return img ? (
                                <div key={i} title={a.name} className="flex flex-col items-center gap-1">
                                  <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(201,161,40,0.06)", border: "1px solid rgba(201,161,40,0.15)" }}>
                                    <Image src={img} alt={a.name} width={44} height={44} className="object-contain" />
                                  </div>
                                  <span className="text-[8px] font-black tracking-wider uppercase text-center leading-tight" style={{ color: "#8892a4", maxWidth: 56 }}>{a.name}</span>
                                </div>
                              ) : (
                                <span key={i} className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded self-center" style={{
                                  color: "#c9a128",
                                  backgroundColor: "rgba(201,161,40,0.08)",
                                  border: "1px solid rgba(201,161,40,0.18)",
                                }}>
                                  {a.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Summary stats */}
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Summary</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { n: serviceRecord.length, l: "Service Entries" },
                            { n: awards.length, l: "Awards" },
                            { n: combatRecord.length, l: "Combat Ops" },
                            { n: rankHistory.length, l: "Promotions" },
                          ].map(({ n, l }) => (
                            <div key={l} className="p-3 rounded" style={{ backgroundColor: "#1a1d23" }}>
                              <p className="text-2xl font-black" style={{ color: "#e8e4d8" }}>{n}</p>
                              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#6b7280" }}>{l}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Digital Signature */}
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#9ca3af" }}>Digital Signature</p>
                        {admin ? (
                          <ImageUpload
                            soldierId={soldier.id}
                            imageType="signature"
                            currentUrl={soldier.signature_url || null}
                            width={950}
                            height={180}
                            label="Upload Signature"
                          />
                        ) : soldier.signature_url ? (
                          <div className="relative w-full" style={{ maxWidth: 950, height: 180 }}>
                            <Image src={soldier.signature_url} alt="Signature" fill className="object-contain" unoptimized />
                          </div>
                        ) : (
                          <p className="text-xs italic" style={{ color: "#6b7280" }}>No signature on file.</p>
                        )}
                      </div>
                    </div>
                  ),

                  "Service Record": (
                    <ServiceRecordTab soldierId={soldier.id} entries={serviceRecord} admin={admin} isVacant={isVacant} />
                  ),

                  "Award Record": (
                    <AwardRecordTab soldierId={soldier.id} entries={awards} admin={admin} isVacant={isVacant} />
                  ),

                  "Combat Record": (
                    <CombatRecordTab soldierId={soldier.id} entries={combatRecord} admin={admin} isVacant={isVacant} />
                  ),

                  "Rank Record": (
                    <RankRecordTab soldierId={soldier.id} entries={rankHistory} admin={admin} isVacant={isVacant} />
                  ),

                  "Assignment Record": (
                    <AssignmentRecordTab soldierId={soldier.id} entries={assignmentHistory} admin={admin} isVacant={isVacant} />
                  ),

                  "Qualification Record": (
                    <QualificationRecordTab soldierId={soldier.id} entries={qualRecord} quals={quals} admin={admin} isVacant={isVacant} />
                  ),
                }}
              </ProfileTabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
