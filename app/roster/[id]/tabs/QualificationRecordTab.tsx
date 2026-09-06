"use client";

import AddRecordForm from "../../components/AddRecordForm";
import { addQualificationRecord, removeQualificationRecord } from "@/app/lib/actions/records";
import { QUALIFICATION_NAMES } from "@/app/lib/qualification-list";

type Entry = { date: string; qualification: string; badge?: string };

export default function QualificationRecordTab({
  soldierId,
  entries,
  quals,
  admin,
  isVacant,
}: {
  soldierId: string;
  entries: Entry[];
  quals: string[];
  admin: boolean;
  isVacant: boolean;
}) {
  const hasContent = entries.length > 0 || quals.length > 0;

  if (!admin && !hasContent) {
    return (
      <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "#0c0f08", border: "1px solid #1c2014" }}>
        <p className="text-sm italic" style={{ color: "#6b6a58" }}>
          {isVacant ? "This billet is currently vacant." : "No qualifications recorded."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {admin && (
        <AddRecordForm
          soldierId={soldierId}
          label="Qualification"
          fields={[
            { name: "date", label: "Date Qualified", required: true, placeholder: "e.g. 13 APR 2026" },
            { name: "qualification", label: "Qualification", type: "select", required: true, placeholder: "Select a qualification...", options: QUALIFICATION_NAMES },
          ]}
          onSubmit={addQualificationRecord}
          onRemove={removeQualificationRecord}
          entries={entries}
          renderEntry={(entry) => (
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(26,122,112,0.1)", border: "1px solid rgba(26,122,112,0.2)" }}>
                <span className="text-[10px] font-black" style={{ color: "#1a7a70" }}>Q</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{entry.qualification}</p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: "#6b6a58" }}>{entry.date}</p>
              </div>
            </div>
          )}
        />
      )}

      {!admin && entries.length > 0 && (
        <div className="overflow-x-auto rounded-lg" style={{ border: "1px solid #1c2014" }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ backgroundColor: "#0c0f08", borderBottom: "1px solid #1c2014" }}>
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Date</th>
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Qualification</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1c2014", backgroundColor: i % 2 === 0 ? "#0f120a" : "#0c0f08" }}>
                  <td className="px-4 py-3" style={{ color: "#8a8870" }}>{entry.date}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#e8e4d8" }}>{entry.qualification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show badge-style quals if no detailed records exist (non-admin) */}
      {!admin && entries.length === 0 && quals.length > 0 && (
        <div className="rounded-lg p-5" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
          <div className="flex flex-wrap gap-2">
            {quals.map((q) => (
              <span key={q} className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded" style={{
                color: "#1a7a70",
                backgroundColor: "rgba(26,122,112,0.1)",
                border: "1px solid rgba(26,122,112,0.2)",
              }}>
                {q}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
