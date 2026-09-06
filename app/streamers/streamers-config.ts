/**
 * Unit streamer roster.
 * Add/remove entries here to update the /streamers page.
 *
 * Fields:
 *   rank   — displayed military rank abbreviation (e.g. "SGT", "SPC")
 *   name   — in-game name (e.g. "R.Gvear")
 *   twitch — exact Twitch username/handle (case-insensitive on lookup)
 */

export type StreamerEntry = {
  rank: string;
  name: string;
  twitch: string;
};

export const STREAMERS: StreamerEntry[] = [
  { rank: "SSG", name: "Badreckee", twitch: "badreckee" },
  // { rank: "SPC", name: "J.Smith",   twitch: "anotherchannel"   },
];
