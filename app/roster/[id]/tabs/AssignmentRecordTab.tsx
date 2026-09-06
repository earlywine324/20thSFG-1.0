"use client";

import AddRecordForm from "../../components/AddRecordForm";
import { addAssignmentRecord, removeAssignmentRecord } from "@/app/lib/actions/records";

type Entry = { position: string; unit: string; dateFrom: string; dateTo?: string };

export default function AssignmentRecordTab({
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
          {isVacant ? "This billet is currently vacant." : "No assignment history recorded."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {admin && (
        <AddRecordForm
          soldierId={soldierId}
          label="Assignment"
          fields={[
            { name: "position", label: "Position", required: true, placeholder: "e.g. ODA-201 Commander" },
            { name: "unit", label: "Unit", required: true, placeholder: "e.g. 1st Battalion, 20th SFG" },
            { name: "dateFrom", label: "From Date", required: true, placeholder: "e.g. 13 APR 2026" },
            { name: "dateTo", label: "To Date (blank = current)", placeholder: "Leave empty if current" },
          ]}
          onSubmit={addAssignmentRecord}
          onRemove={removeAssignmentRecord}
          entries={entries}
          renderEntry={(entry) => (
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{entry.position}</p>
                <p className="text-xs" style={{ color: "#8a8870" }}>{entry.unit}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#6b6a58" }}>
                  {entry.dateFrom} — {entry.dateTo || "Present"}
                </p>
                {!entry.dateTo && (
                  <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">Current</span>
                )}
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
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Unit</th>
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Position</th>
                <th className="text-left px-4 py-3 text-[10px] font-black tracking-widest uppercase" style={{ color: "#8a8870" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #1c2014", backgroundColor: i % 2 === 0 ? "#0f120a" : "#0c0f08" }}>
                  <td className="px-4 py-3" style={{ color: "#8a8870" }}>{entry.dateFrom}</td>
                  <td className="px-4 py-3" style={{ color: "#e8e4d8" }}>{entry.unit}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#e8e4d8" }}>{entry.position}</td>
                  <td className="px-4 py-3">
                    {!entry.dateTo ? (
                      <span className="text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">Current</span>
                    ) : (
                      <span className="text-[10px]" style={{ color: "#6b6a58" }}>Until {entry.dateTo}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
