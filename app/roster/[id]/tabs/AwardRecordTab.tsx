"use client";

import { Award } from "lucide-react";
import AddRecordForm from "../../components/AddRecordForm";
import { addAwardRecord, removeAwardRecord } from "@/app/lib/actions/records";
import { AWARD_NAMES } from "@/app/lib/award-list";

type Entry = { name: string; dateAwarded?: string; citation?: string };

export default function AwardRecordTab({
  soldierId,
  entries,
  admin,
  isVacant,
}: {
  soldierId: string;
  entries: Entry[];
  admin: boolean;
  isVacant: boolean;
}) {
  if (!admin && entries.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg" style={{ backgroundColor: "#0c0f08", border: "1px solid #1c2014" }}>
        <p className="text-sm italic" style={{ color: "#6b6a58" }}>
          {isVacant ? "This billet is currently vacant." : "No awards recorded."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {admin && (
        <AddRecordForm
          soldierId={soldierId}
          label="Award"
          fields={[
            { name: "name", label: "Award Name", type: "select", required: true, placeholder: "Select an award...", options: AWARD_NAMES },
            { name: "dateAwarded", label: "Date Awarded", required: true, placeholder: "e.g. 13 APR 2026" },
            { name: "citation", label: "Citation", type: "textarea", placeholder: "Citation or reason for award..." },
          ]}
          onSubmit={addAwardRecord}
          onRemove={removeAwardRecord}
          entries={entries}
          renderEntry={(entry) => (
            <div className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(201,161,40,0.1)", border: "1px solid rgba(201,161,40,0.2)" }}>
                <Award className="w-6 h-6" style={{ color: "#c9a128" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{entry.name}</p>
                  {entry.dateAwarded && <span className="text-[10px] font-bold tracking-widest uppercase shrink-0" style={{ color: "#8a8870" }}>{entry.dateAwarded}</span>}
                </div>
                {entry.citation && <p className="text-xs mt-2 leading-relaxed italic" style={{ color: "#6b6a58" }}>{entry.citation}</p>}
              </div>
            </div>
          )}
        />
      )}

      {!admin && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((award, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(201,161,40,0.1)", border: "1px solid rgba(201,161,40,0.2)" }}>
                <Award className="w-6 h-6" style={{ color: "#c9a128" }} />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{award.name}</p>
                  {award.dateAwarded && <span className="text-[10px] font-bold tracking-widest uppercase shrink-0" style={{ color: "#8a8870" }}>{award.dateAwarded}</span>}
                </div>
                {award.citation && <p className="text-xs mt-2 leading-relaxed italic" style={{ color: "#6b6a58" }}>{award.citation}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
