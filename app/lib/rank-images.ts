/** Maps rank abbreviations to their insignia image paths */
export const RANK_IMAGES: Record<string, string> = {
  PVT: "/insignia/ranks/E1-PVT-69a12d80c6a4e.png",
  PV2: "/insignia/ranks/E2-PV2-6999ba19e286b.png",
  PFC: "/insignia/ranks/E3-PFC-69b67ad12756e.png",
  SPC: "/insignia/ranks/E4-SPC-69b67ad8ccce6.png",
  CPL: "/insignia/ranks/E4X-CPL-69b67ae206ef4.png",
  SGT: "/insignia/ranks/E5-SGT-6999b9cc6474e.png",
  SSG: "/insignia/ranks/E6-SSG-6999b9b952f93.png",
  SFC: "/insignia/ranks/E7-SFC-6999b9a7c5144.png",
  MSG: "/insignia/ranks/E8-MSG-6999b983e4705.png",
  "1SG": "/insignia/ranks/E8X-1SG-6999b918e1887.png",
  SGM: "/insignia/ranks/E9-SGM-6999b8ff8e0f4.png",
  CSM: "/insignia/ranks/E9X-CSM-6999b8e3d9ec0.png",
  WO1: "/insignia/ranks/W1-WO1-6999b6dd8874c.png",
  CW2: "/insignia/ranks/W2-CW2-6999b6c4122ad.png",
  CW3: "/insignia/ranks/W3-CW3-6999b6af38e4a.png",
  "2LT": "/insignia/ranks/O1-2LT-6999b57050da7.png",
  "1LT": "/insignia/ranks/O2-1LT-6999b55b25615.png",
  CPT: "/insignia/ranks/O3-CPT-6999b54675e25.png",
  MAJ: "/insignia/ranks/O4-MAJ-6999b5341b384.png",
  LTC: "/insignia/ranks/O5-LTC-6999b470e637c.png",
  COL: "/insignia/ranks/O6-COL-6999b3e5dc0ae.png",
};

export function getRankImage(rank: string): string | null {
  return RANK_IMAGES[rank] || null;
}
