"use client";

import AddRecordForm from "../../components/AddRecordForm";
import { addRankRecord, removeRankRecord } from "@/app/lib/actions/records";

type Entry = { rank: string; rankFull: string; date: string; authority?: string };

export default function RankRecordTab({
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
          {isVacant ? "This billet is currently vacant." : "No rank history recorded."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {admin && (
        <AddRecordForm
          soldierId={soldierId}
          label="Promotion"
          fields={[
            { name: "rank", label: "Rank Abbreviation", required: true, placeholder: "e.g. SGT" },
            { name: "rankFull", label: "Full Rank Title", required: true, placeholder: "e.g. Sergeant" },
            { name: "date", label: "Date", required: true, placeholder: "e.g. 13 APR 2026" },
            { name: "authority", label: "Authority", placeholder: "e.g. Commander, 20th SFG" },
          ]}
          onSubmit={addRankRecord}
          onRemove={removeRankRecord}
          entries={entries}
          renderEntry={(entry) => (
            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0" style={{
                backgroundColor: "#c9a128",
                color: "#090b07",
              }}>
                <span className="text-lg font-black">{entry.rank}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{entry.rankFull}</p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: "#6b6a58" }}>{entry.date}</p>
              </div>
              {entry.authority && (
                <span className="text-[10px] italic" style={{ color: "#6b6a58" }}>{entry.authority}</span>
              )}
            </div>
          )}
        />
      )}

      {!admin && entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: "#0f120a", border: "1px solid #1c2014" }}>
              <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0" style={{
                backgroundColor: i === 0 ? "#c9a128" : "#1c2014",
                color: i === 0 ? "#090b07" : "#8a8870",
              }}>
                <span className="text-lg font-black">{entry.rank}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: "#e8e4d8" }}>{entry.rankFull}</p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: "#6b6a58" }}>{entry.date}</p>
              </div>
              {entry.authority && (
                <span className="text-[10px] italic" style={{ color: "#6b6a58" }}>{entry.authority}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
