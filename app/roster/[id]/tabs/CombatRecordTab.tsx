"use client";

import AddRecordForm from "../../components/AddRecordForm";
import { addCombatRecord, removeCombatRecord } from "@/app/lib/actions/records";

type Entry = { date: string; operation: string; details?: string };

export default function CombatRecordTab({
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
          {isVacant ? "This billet is currently vacant." : "No combat records."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {admin && (
        <AddRecordForm
          soldierId={soldierId}
          label="Combat Record"
          fields={[
            { name: "date", label: "Date", required: true, placeholder: "e.g. 13 APR 2026" },
            { name: "operation", label: "Operation", required: true, placeholder: "e.g. Operation Iron Resolve" },
            { name: "details", label: "Details", type: "textarea", placeholder: "Mission details..." },
          ]}
          onSubmit={addCombatRecord}
          onRemove={removeCombatRecord}
          entries={entries}
          renderEntry={(entry) => (
            <div className="flex gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "#ef4444" }} />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{entry.operation}</p>
                  <span className="text-[10px] font-bold tracking-widest uppercase shrink-0" style={{ color: "#8a8870" }}>{entry.date}</span>
                </div>
                {entry.details && <p className="text-xs mt-1" style={{ color: "#6b6a58" }}>{entry.details}</p>}
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
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Operation</th>
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1c2014", backgroundColor: i % 2 === 0 ? "#0f120a" : "#0c0f08" }}>
                  <td className="px-4 py-3" style={{ color: "#8a8870" }}>{entry.date}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#e8e4d8" }}>{entry.operation}</td>
                  <td className="px-4 py-3" style={{ color: "#6b6a58" }}>{entry.details || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
