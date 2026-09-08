"use client";

import { useState, useTransition } from "react";
import { TrendingUp, Check, ChevronDown } from "lucide-react";
import { promoteSoldier } from "@/app/lib/actions/soldiers";
import { AUTO_PROMOTION_CHAIN, checkEligibility, ALL_RANKS } from "@/app/lib/promotions";
import { useRouter } from "next/navigation";

const RANK_LIST = Object.entries(ALL_RANKS).map(([abbr, full]) => ({ abbr, full }));

export default function PromoteButton({
  soldierId,
  currentRank,
  lastPromotion,
}: {
  soldierId: string;
  currentRank: string;
  lastPromotion?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const eligibility = checkEligibility(currentRank, lastPromotion ?? null);
  const isInAutoChain = AUTO_PROMOTION_CHAIN.some((r) => r.abbr === currentRank && r.nextRank !== null);

  function handlePromote(rank: string) {
    if (!rank) return;
    setOpen(false);
    setError("");
    setDone(false);
    startTransition(async () => {
      const result = await promoteSoldier(soldierId, rank, "Admin");
      if (result.error) {
        setError(result.error);
      } else {
        setDone(true);
        router.refresh();
        setTimeout(() => setDone(false), 3000);
      }
    });
  }

  // Quick-promote button for soldiers in auto chain
  const nextRankAbbr = AUTO_PROMOTION_CHAIN.find((r) => r.abbr === currentRank)?.nextRank;

  return (
    <div className="space-y-3">
      {/* Auto-chain quick promote */}
      {isInAutoChain && nextRankAbbr && (
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => handlePromote(nextRankAbbr)}
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-3 rounded text-xs font-black tracking-widest uppercase disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: "#c9a128", color: "#090b07" }}
            >
              {done ? (
                <><Check className="w-4 h-4" /> Promoted!</>
              ) : isPending ? (
                <>Promoting…</>
              ) : (
                <><TrendingUp className="w-4 h-4" /> Promote to {nextRankAbbr}</>
              )}
            </button>
            {eligibility && eligibility.daysUntilEligible > 0 && (
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#8a8870" }}>
                TIG: {eligibility.daysUntilEligible}d until auto-eligible
              </span>
            )}
            {eligibility && eligibility.daysUntilEligible === 0 && (
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#4caf50" }}>
                Eligible for auto-promotion
              </span>
            )}
          </div>
        </div>
      )}

      {/* Manual rank selector for any rank */}
      <div className="relative inline-block">
        <button
          onClick={() => setOpen((o) => !o)}
          disabled={isPending}
          className="flex items-center gap-2 px-5 py-3 rounded text-xs font-black tracking-widest uppercase disabled:opacity-50"
          style={{ backgroundColor: "#1c2014", color: "#8a8870", border: "1px solid #2a3020" }}
        >
          Promote to Custom Rank <ChevronDown className="w-3 h-3" />
        </button>

        {open && (
          <div
            className="absolute top-full left-0 mt-1 rounded shadow-xl z-50 min-w-[240px] max-h-64 overflow-y-auto"
            style={{ backgroundColor: "#0f120a", border: "1px solid #2a3020" }}
          >
            {RANK_LIST.filter((r) => r.abbr !== currentRank).map((r) => (
              <button
                key={r.abbr}
                onClick={() => handlePromote(r.abbr)}
                className="w-full text-left px-4 py-2.5 text-xs hover:opacity-80 transition-opacity"
                style={{ color: "#e8e4d8", borderBottom: "1px solid #1c2014" }}
              >
                <span className="font-black" style={{ color: "#c9a128" }}>{r.abbr}</span>
                &nbsp;— {r.full}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs font-bold" style={{ color: "#ef4444" }}>Error: {error}</p>
      )}
    </div>
  );
}
