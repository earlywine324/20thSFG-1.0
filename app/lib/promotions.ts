/**
 * Automatic Promotion Logic
 *
 * Enlisted auto-promotion chain (Time in Grade requirements):
 *   E-1  PVT  Private                → E-2 after 2 weeks
 *   E-2  PV2  Private Second Class   → E-3 after 2 weeks
 *   E-3  PFC  Private First Class    → E-4 after 4 weeks
 *   E-4+ Manual only
 */

export type RankInfo = {
  abbr: string;
  full: string;
  /** Weeks TIG required before auto-promotion. null = manual only */
  weeksRequired: number | null;
  /** Rank to promote to. null = cap */
  nextRank: string | null;
};

export const AUTO_PROMOTION_CHAIN: RankInfo[] = [
  { abbr: "PVT", full: "Private",              weeksRequired: 2,    nextRank: "PV2" },
  { abbr: "PV2", full: "Private Second Class", weeksRequired: 2,    nextRank: "PFC" },
  { abbr: "PFC", full: "Private First Class",  weeksRequired: 4,    nextRank: "SPC" },
  { abbr: "SPC", full: "Specialist",           weeksRequired: null, nextRank: null  },
];

export const ALL_RANKS: Record<string, string> = {
  PVT: "Private",
  PV2: "Private Second Class",
  PFC: "Private First Class",
  SPC: "Specialist",
  CPL: "Corporal",
  SGT: "Sergeant",
  SSG: "Staff Sergeant",
  SFC: "Sergeant First Class",
  MSG: "Master Sergeant",
  "1SG": "First Sergeant",
  SGM: "Sergeant Major",
  CSM: "Command Sergeant Major",
  WO1: "Warrant Officer 1",
  CW2: "Chief Warrant Officer 2",
  CW3: "Chief Warrant Officer 3",
  CW4: "Chief Warrant Officer 4",
  CW5: "Chief Warrant Officer 5",
  "2LT": "Second Lieutenant",
  "1LT": "First Lieutenant",
  CPT: "Captain",
  MAJ: "Major",
  LTC: "Lieutenant Colonel",
  COL: "Colonel",
};

const MONTHS: Record<string, number> = {
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

/**
 * Parse a military-style date string like "15 MAR 2026" into a Date.
 * Also handles ISO strings like "2026-03-15".
 */
export function parseMilDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;

  // ISO format
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }

  // Military format: "15 MAR 2026"
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = MONTHS[parts[1].toUpperCase()];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }

  return null;
}

/**
 * Format a Date as a military date string "DD MON YYYY".
 */
export function toMilDate(date: Date): string {
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Calculate a human-readable duration from a date string to now.
 * e.g. "3 days", "2 weeks 4 days", "1 month 12 days"
 */
export function calcDuration(dateStr: string | null | undefined): string {
  const from = parseMilDate(dateStr);
  if (!from) return "—";

  const totalDays = Math.max(0, Math.floor((Date.now() - from.getTime()) / 86_400_000));

  if (totalDays === 0) return "< 1 day";
  if (totalDays < 7)  return `${totalDays} day${totalDays !== 1 ? "s" : ""}`;

  const months = Math.floor(totalDays / 30);
  const weeks  = Math.floor(totalDays / 7);
  const remDaysFromWeeks  = totalDays % 7;
  const remDaysFromMonths = totalDays - months * 30;

  if (months >= 1) {
    const d = remDaysFromMonths;
    return d > 0
      ? `${months} month${months !== 1 ? "s" : ""} ${d} day${d !== 1 ? "s" : ""}`
      : `${months} month${months !== 1 ? "s" : ""}`;
  }

  return remDaysFromWeeks > 0
    ? `${weeks} week${weeks !== 1 ? "s" : ""} ${remDaysFromWeeks} day${remDaysFromWeeks !== 1 ? "s" : ""}`
    : `${weeks} week${weeks !== 1 ? "s" : ""}`;
}

/**
 * Given a soldier's current rank and last_promotion date, determine if
 * they are eligible for automatic promotion. Returns null if not eligible.
 */
export function checkEligibility(rank: string, lastPromotion: string | null): {
  nextRank: RankInfo;
  daysUntilEligible: number;
} | null {
  const rankInfo = AUTO_PROMOTION_CHAIN.find((r) => r.abbr === rank);
  if (!rankInfo || rankInfo.weeksRequired === null || rankInfo.nextRank === null) {
    return null; // Not in auto-promotion chain
  }

  const promotionDate = parseMilDate(lastPromotion);
  if (!promotionDate) return null;

  const requiredMs = rankInfo.weeksRequired * 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  const elapsedMs = now.getTime() - promotionDate.getTime();
  const daysUntilEligible = Math.ceil((requiredMs - elapsedMs) / (24 * 60 * 60 * 1000));

  if (elapsedMs < requiredMs) {
    return { nextRank: rankInfo, daysUntilEligible };
  }

  return { nextRank: rankInfo, daysUntilEligible: 0 };
}
