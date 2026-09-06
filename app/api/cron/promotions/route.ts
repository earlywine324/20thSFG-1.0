import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { AUTO_PROMOTION_CHAIN, parseMilDate, toMilDate } from "@/app/lib/promotions";

export const dynamic = "force-dynamic";

/**
 * Vercel Cron: runs daily at 00:00 UTC.
 * Automatically promotes E-1 → E-4 based on Time in Grade requirements.
 * Secured with CRON_SECRET header.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const autoRanks = AUTO_PROMOTION_CHAIN
    .filter((r) => r.weeksRequired !== null)
    .map((r) => r.abbr);

  // Fetch all active soldiers in the auto-promotion ranks
  const { data: soldiers, error } = await supabase
    .from("soldiers")
    .select("id, name, rank, rank_full, rank_history, service_record, last_promotion, enlist_date")
    .in("rank", autoRanks)
    .eq("status", "ACTIVE DUTY");

  if (error) {
    console.error("[promotions cron] fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const promoted: string[] = [];
  const skipped: string[] = [];
  const now = new Date();
  const dateStr = toMilDate(now);

  for (const soldier of soldiers ?? []) {
    const rankInfo = AUTO_PROMOTION_CHAIN.find((r) => r.abbr === soldier.rank);
    if (!rankInfo || rankInfo.weeksRequired === null || !rankInfo.nextRank) {
      skipped.push(soldier.id);
      continue;
    }

    // Use last_promotion if available, fall back to enlist_date
    const referenceDate = parseMilDate(soldier.last_promotion) ?? parseMilDate(soldier.enlist_date);
    if (!referenceDate) {
      skipped.push(soldier.id);
      continue;
    }

    const requiredMs = rankInfo.weeksRequired * 7 * 24 * 60 * 60 * 1000;
    const elapsedMs = now.getTime() - referenceDate.getTime();

    if (elapsedMs < requiredMs) {
      skipped.push(soldier.id);
      continue;
    }

    // Find next rank info
    const nextRankInfo = AUTO_PROMOTION_CHAIN.find((r) => r.abbr === rankInfo.nextRank);
    if (!nextRankInfo) {
      skipped.push(soldier.id);
      continue;
    }

    // Build history entries
    const rankHistoryEntry = {
      rank: nextRankInfo.abbr,
      rankFull: nextRankInfo.full,
      date: dateStr,
      authority: "Automatic (Time in Grade)",
    };
    const serviceEntry = {
      date: dateStr,
      event: "Promoted",
      details: `Automatically promoted to ${nextRankInfo.full} (${nextRankInfo.abbr}) based on Time in Grade.`,
    };

    const existingRankHistory = Array.isArray(soldier.rank_history) ? soldier.rank_history : [];
    const existingService = Array.isArray(soldier.service_record) ? soldier.service_record : [];

    const { error: updateErr } = await supabase
      .from("soldiers")
      .update({
        rank: nextRankInfo.abbr,
        rank_full: nextRankInfo.full,
        last_promotion: dateStr,
        time_in_grade: "0 days",
        rank_history: [rankHistoryEntry, ...existingRankHistory],
        service_record: [serviceEntry, ...existingService],
      })
      .eq("id", soldier.id);

    if (updateErr) {
      console.error(`[promotions cron] failed to promote ${soldier.id}:`, updateErr.message);
      skipped.push(soldier.id);
    } else {
      console.log(`[promotions cron] promoted ${soldier.name} ${soldier.rank} → ${nextRankInfo.abbr}`);
      promoted.push(soldier.id);
    }
  }

  return NextResponse.json({
    ok: true,
    promoted: promoted.length,
    skipped: skipped.length,
    promotedIds: promoted,
  });
}
