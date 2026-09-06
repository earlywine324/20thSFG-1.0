/** Rank seniority — lower number = more senior */
const RANK_SENIORITY: Record<string, number> = {
  // Officers (most senior first)
  COL: 1,
  LTC: 2,
  MAJ: 3,
  CPT: 4,
  "1LT": 5,
  "2LT": 6,
  // Warrant Officers
  CW3: 10,
  CW2: 11,
  WO1: 12,
  // Senior NCOs
  CSM: 20,
  SGM: 21,
  "1SG": 22,
  MSG: 23,
  SFC: 24,
  // NCOs
  SSG: 30,
  SGT: 31,
  CPL: 32,
  // Junior Enlisted
  SPC: 40,
  PFC: 41,
  PV2: 42,
  PVT: 43,
  // Recruit
  RCT: 50,
};

/** Get the seniority number for a rank (lower = more senior) */
export function rankOrder(rank: string): number {
  return RANK_SENIORITY[rank] ?? 99;
}
