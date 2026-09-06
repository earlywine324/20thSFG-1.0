/* ─── MILITARY INSIGNIA SVG COMPONENTS ─── */

// ═══════════════════════════════
//  RANK INSIGNIA
// ═══════════════════════════════

export function RankInsignia({ rank, size = 48 }: { rank: string; size?: number }) {
  const s = size;
  const mid = s / 2;

  switch (rank) {
    // ── Enlisted ──
    case "PVT":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* No insignia - blank disc */}
          <circle cx="24" cy="24" r="18" stroke="#c9a128" strokeWidth="1.5" fill="none" opacity="0.3" />
          <text x="24" y="28" textAnchor="middle" fill="#c9a128" fontSize="10" fontWeight="900" opacity="0.5">PVT</text>
        </svg>
      );
    case "PV2":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Single chevron */}
          <path d="M12 18 L24 30 L36 18" stroke="#c9a128" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "PFC":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Chevron with rocker */}
          <path d="M12 16 L24 28 L36 16" stroke="#c9a128" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 24 L24 36 L36 24" stroke="#c9a128" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "SPC":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Specialist eagle-like shield */}
          <path d="M24 6 L34 14 L34 28 L24 38 L14 28 L14 14 Z" stroke="#c9a128" strokeWidth="2" fill="rgba(201,161,40,0.1)" />
          <path d="M18 20 L24 14 L30 20" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="24" y1="14" x2="24" y2="30" stroke="#c9a128" strokeWidth="2" />
        </svg>
      );
    case "CPL":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Two chevrons */}
          <path d="M12 14 L24 26 L36 14" stroke="#c9a128" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 22 L24 34 L36 22" stroke="#c9a128" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // ── NCO ──
    case "SGT":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three chevrons */}
          <path d="M10 12 L24 24 L38 12" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20 L24 32 L38 20" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 28 L24 40 L38 28" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "SSG":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three chevrons + one rocker */}
          <path d="M10 10 L24 22 L38 10" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 17 L24 29 L38 17" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 24 L24 36 L38 24" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 40 L24 34 L34 40" stroke="#c9a128" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "SFC":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three chevrons + two rockers */}
          <path d="M10 8 L24 18 L38 8" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 14 L24 24 L38 14" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 20 L24 30 L38 20" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 36 L24 30 L34 36" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 42 L24 36 L34 42" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "MSG":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three chevrons + three rockers */}
          <path d="M10 6 L24 16 L38 6" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 12 L24 22 L38 12" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18 L24 28 L38 18" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 34 L24 28 L34 34" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 39 L24 33 L34 39" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 44 L24 38 L34 44" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "SGM":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three chevrons + three rockers + star */}
          <path d="M10 8 L24 16 L38 8" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 13 L24 21 L38 13" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18 L24 26 L38 18" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 32 L24 26 L34 32" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 37 L24 31 L34 37" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 42 L24 36 L34 42" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <polygon points="24,22 25.5,25 29,25.5 26.5,27.5 27,31 24,29.5 21,31 21.5,27.5 19,25.5 22.5,25" fill="#c9a128" />
        </svg>
      );
    case "CSM":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three chevrons + three rockers + star + wreath */}
          <path d="M10 8 L24 16 L38 8" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 13 L24 21 L38 13" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 18 L24 26 L38 18" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 32 L24 26 L34 32" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 37 L24 31 L34 37" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 42 L24 36 L34 42" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {/* Wreath around star */}
          <ellipse cx="24" cy="26" rx="7" ry="6" stroke="#c9a128" strokeWidth="1" fill="none" opacity="0.5" />
          <polygon points="24,22 25.5,25 29,25.5 26.5,27.5 27,31 24,29.5 21,31 21.5,27.5 19,25.5 22.5,25" fill="#c9a128" />
        </svg>
      );

    // ── Warrant Officers ──
    case "WO1":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Single black square */}
          <rect x="16" y="16" width="16" height="16" fill="#c9a128" rx="1" />
          <rect x="19" y="19" width="10" height="10" fill="#090b07" rx="1" />
        </svg>
      );
    case "CW2":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Two black squares */}
          <rect x="10" y="18" width="12" height="12" fill="#c9a128" rx="1" />
          <rect x="12.5" y="20.5" width="7" height="7" fill="#090b07" rx="1" />
          <rect x="26" y="18" width="12" height="12" fill="#c9a128" rx="1" />
          <rect x="28.5" y="20.5" width="7" height="7" fill="#090b07" rx="1" />
        </svg>
      );
    case "CW3":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Three squares */}
          <rect x="4" y="18" width="11" height="11" fill="#c9a128" rx="1" />
          <rect x="6" y="20" width="7" height="7" fill="#090b07" rx="1" />
          <rect x="18.5" y="18" width="11" height="11" fill="#c9a128" rx="1" />
          <rect x="20.5" y="20" width="7" height="7" fill="#090b07" rx="1" />
          <rect x="33" y="18" width="11" height="11" fill="#c9a128" rx="1" />
          <rect x="35" y="20" width="7" height="7" fill="#090b07" rx="1" />
        </svg>
      );

    // ── Officers ──
    case "2LT":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Single gold bar */}
          <rect x="14" y="18" width="20" height="12" rx="2" fill="#c9a128" />
          <rect x="16" y="20" width="16" height="8" rx="1" fill="#e0b730" opacity="0.3" />
        </svg>
      );
    case "1LT":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Single silver bar */}
          <rect x="14" y="18" width="20" height="12" rx="2" fill="#c0c0c0" />
          <rect x="16" y="20" width="16" height="8" rx="1" fill="#ffffff" opacity="0.2" />
        </svg>
      );
    case "CPT":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Double silver bars (railroad tracks) */}
          <rect x="14" y="14" width="20" height="8" rx="2" fill="#c0c0c0" />
          <rect x="14" y="26" width="20" height="8" rx="2" fill="#c0c0c0" />
          <rect x="16" y="15.5" width="16" height="5" rx="1" fill="#ffffff" opacity="0.2" />
          <rect x="16" y="27.5" width="16" height="5" rx="1" fill="#ffffff" opacity="0.2" />
        </svg>
      );
    case "MAJ":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Gold oak leaf */}
          <ellipse cx="24" cy="24" rx="12" ry="14" fill="#c9a128" />
          <path d="M24 10 L24 38" stroke="#090b07" strokeWidth="2" />
          <path d="M18 16 L24 22 L30 16" stroke="#090b07" strokeWidth="1.5" fill="none" />
          <path d="M18 24 L24 30 L30 24" stroke="#090b07" strokeWidth="1.5" fill="none" />
          <path d="M16 20 L24 26 L32 20" stroke="#090b07" strokeWidth="1" fill="none" opacity="0.4" />
        </svg>
      );
    case "LTC":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Silver oak leaf */}
          <ellipse cx="24" cy="24" rx="12" ry="14" fill="#c0c0c0" />
          <path d="M24 10 L24 38" stroke="#090b07" strokeWidth="2" />
          <path d="M18 16 L24 22 L30 16" stroke="#090b07" strokeWidth="1.5" fill="none" />
          <path d="M18 24 L24 30 L30 24" stroke="#090b07" strokeWidth="1.5" fill="none" />
          <path d="M16 20 L24 26 L32 20" stroke="#090b07" strokeWidth="1" fill="none" opacity="0.4" />
        </svg>
      );
    case "COL":
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          {/* Eagle */}
          <circle cx="24" cy="20" r="4" fill="#c9a128" />
          <path d="M8 18 L24 24 L40 18" stroke="#c9a128" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M12 22 L24 28 L36 22" stroke="#c9a128" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M8 16 L12 20" stroke="#c9a128" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 16 L36 20" stroke="#c9a128" strokeWidth="2" strokeLinecap="round" />
          <line x1="24" y1="28" x2="24" y2="38" stroke="#c9a128" strokeWidth="2" />
          <path d="M18 34 L24 38 L30 34" stroke="#c9a128" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Shield */}
          <rect x="20" y="30" width="8" height="6" rx="1" stroke="#c9a128" strokeWidth="1" fill="rgba(201,161,40,0.2)" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="#c9a128" strokeWidth="1.5" fill="none" opacity="0.3" />
          <text x="24" y="28" textAnchor="middle" fill="#c9a128" fontSize="9" fontWeight="900">{rank}</text>
        </svg>
      );
  }
}

// ═══════════════════════════════
//  AWARD RIBBONS
// ═══════════════════════════════

const AWARD_RIBBON_COLORS: Record<string, string[][]> = {
  "Distinguished Service Cross":     [["#4169E1","8"],["#FFFFFF","4"],["#DC143C","8"],["#FFFFFF","4"],["#4169E1","8"]],
  "Silver Star":                     [["#DC143C","3"],["#FFFFFF","3"],["#4169E1","6"],["#FFFFFF","6"],["#DC143C","3"],["#FFFFFF","3"],["#4169E1","6"],["#FFFFFF","3"],["#DC143C","3"]],
  "Bronze Star with V Device":       [["#DC143C","4"],["#FFFFFF","4"],["#4169E1","8"],["#FFFFFF","4"],["#DC143C","4"],["#FFFFFF","4"],["#4169E1","8"]],
  "Distinguished Service Medal":     [["#DC143C","4"],["#FFFFFF","4"],["#4169E1","16"],["#FFFFFF","4"],["#DC143C","4"]],
  "Legion of Merit":                 [["#8B0000","6"],["#FFFFFF","3"],["#8B0000","14"],["#FFFFFF","3"],["#8B0000","6"]],
  "Bronze Star Medal":               [["#DC143C","4"],["#FFFFFF","4"],["#4169E1","8"],["#FFFFFF","4"],["#DC143C","4"],["#FFFFFF","4"],["#4169E1","4"]],
  "Meritorious Service Medal":       [["#8B0000","8"],["#FFFFFF","4"],["#8B0000","8"],["#FFFFFF","4"],["#8B0000","8"]],
  "Army Good Conduct Medal":         [["#DC143C","8"],["#FFFFFF","6"],["#DC143C","4"],["#FFFFFF","6"],["#DC143C","8"]],
  "Army Service Ribbon":             [["#FF8C00","4"],["#FFD700","4"],["#006400","4"],["#FFFFFF","4"],["#DC143C","4"],["#FFFFFF","4"],["#006400","4"],["#FFD700","4"],["#FF8C00","4"]],
  "Army Achievement Medal":          [["#006400","6"],["#FFFFFF","4"],["#FF8C00","4"],["#FFFFFF","4"],["#006400","6"],["#FFFFFF","4"],["#FF8C00","4"]],
  "National Defense Service Medal":  [["#DC143C","4"],["#FFD700","4"],["#DC143C","4"],["#FFD700","4"],["#DC143C","4"],["#4169E1","4"],["#DC143C","4"],["#FFD700","4"],["#DC143C","4"]],
  "Combat Infantryman Badge (CIB)":  [["#4169E1","6"],["#C0C0C0","4"],["#4169E1","12"],["#C0C0C0","4"],["#4169E1","6"]],
  "Combat Action Badge (CAB)":       [["#4169E1","4"],["#C0C0C0","4"],["#4169E1","4"],["#FFD700","4"],["#4169E1","4"],["#C0C0C0","4"],["#4169E1","4"]],
  "Purple Heart":                    [["#FFFFFF","4"],["#6A0DAD","24"],["#FFFFFF","4"]],
};

export function AwardRibbon({ name, size = 48 }: { name: string; size?: number }) {
  const colors = AWARD_RIBBON_COLORS[name];
  if (!colors) {
    return (
      <svg width={size} height={size * 0.6} viewBox="0 0 48 28" fill="none">
        <rect x="2" y="4" width="44" height="20" rx="2" fill="#c9a128" opacity="0.3" />
      </svg>
    );
  }

  const totalWeight = colors.reduce((sum, [, w]) => sum + parseInt(w), 0);

  let x = 2;
  const ribbonWidth = 44;
  const stripes = colors.map(([color, weight], i) => {
    const w = (parseInt(weight) / totalWeight) * ribbonWidth;
    const stripe = <rect key={i} x={x} y="2" width={w} height="20" fill={color} />;
    x += w;
    return stripe;
  });

  return (
    <svg width={size} height={size * 0.55} viewBox="0 0 48 24" fill="none">
      <rect x="2" y="2" width="44" height="20" rx="2" fill="#333" />
      <clipPath id={`ribbon-${name.replace(/\s/g, "")}`}>
        <rect x="2" y="2" width="44" height="20" rx="2" />
      </clipPath>
      <g clipPath={`url(#ribbon-${name.replace(/\s/g, "")})`}>
        {stripes}
      </g>
      {/* Sheen */}
      <rect x="2" y="2" width="44" height="8" rx="2" fill="white" opacity="0.08" />
    </svg>
  );
}

// ═══════════════════════════════
//  QUALIFICATION BADGES
// ═══════════════════════════════

export function QualBadge({ abbr, size = 48 }: { abbr: string; size?: number }) {
  switch (abbr) {
    case "SF Tab":
      return (
        <svg width={size * 1.4} height={size * 0.6} viewBox="0 0 68 28" fill="none">
          <rect x="1" y="2" width="66" height="24" rx="4" fill="#006400" stroke="#c9a128" strokeWidth="1.5" />
          <text x="34" y="19" textAnchor="middle" fill="#c9a128" fontSize="11" fontWeight="900" letterSpacing="2">SPECIAL FORCES</text>
        </svg>
      );
    case "Sapper Tab":
      return (
        <svg width={size * 1.2} height={size * 0.6} viewBox="0 0 58 28" fill="none">
          <rect x="1" y="2" width="56" height="24" rx="4" fill="#000" stroke="#c9a128" strokeWidth="1.5" />
          <text x="29" y="19" textAnchor="middle" fill="#c9a128" fontSize="12" fontWeight="900" letterSpacing="2">SAPPER</text>
        </svg>
      );
    case "Airborne":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Parachute canopy */}
          <path d="M14 18 Q24 4 34 18" stroke="#c0c0c0" strokeWidth="2" fill="rgba(192,192,192,0.1)" />
          <path d="M14 18 Q19 8 24 18" stroke="#c0c0c0" strokeWidth="1" fill="none" />
          <path d="M24 18 Q29 8 34 18" stroke="#c0c0c0" strokeWidth="1" fill="none" />
          {/* Risers */}
          <line x1="14" y1="18" x2="22" y2="34" stroke="#c0c0c0" strokeWidth="1" />
          <line x1="34" y1="18" x2="26" y2="34" stroke="#c0c0c0" strokeWidth="1" />
          {/* Wings */}
          <path d="M6 28 Q14 24 22 30" stroke="#c9a128" strokeWidth="1.5" fill="none" />
          <path d="M42 28 Q34 24 26 30" stroke="#c9a128" strokeWidth="1.5" fill="none" />
          <path d="M4 30 Q12 26 22 32" stroke="#c9a128" strokeWidth="1" fill="none" opacity="0.5" />
          <path d="M44 30 Q36 26 26 32" stroke="#c9a128" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      );
    case "HALO":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Freefall wings - more angular */}
          <path d="M14 20 Q24 8 34 20" stroke="#c9a128" strokeWidth="2" fill="rgba(201,161,40,0.1)" />
          <path d="M14 20 Q19 10 24 20" stroke="#c9a128" strokeWidth="1" fill="none" />
          <path d="M24 20 Q29 10 34 20" stroke="#c9a128" strokeWidth="1" fill="none" />
          <line x1="14" y1="20" x2="20" y2="34" stroke="#c9a128" strokeWidth="1.5" />
          <line x1="34" y1="20" x2="28" y2="34" stroke="#c9a128" strokeWidth="1.5" />
          {/* Star */}
          <polygon points="24,28 25.5,31 29,31.5 26.5,33.5 27,37 24,35.5 21,37 21.5,33.5 19,31.5 22.5,31" fill="#c9a128" />
          {/* Extended wings */}
          <path d="M4 26 Q12 22 20 28" stroke="#c9a128" strokeWidth="2" fill="none" />
          <path d="M44 26 Q36 22 28 28" stroke="#c9a128" strokeWidth="2" fill="none" />
        </svg>
      );
    case "CIB":
      return (
        <svg width={size * 1.3} height={size * 0.7} viewBox="0 0 62 34" fill="none">
          {/* Wreath */}
          <path d="M8 26 Q8 8 31 6 Q54 8 54 26" stroke="#c9a128" strokeWidth="2" fill="none" />
          <path d="M10 24 Q10 10 31 8 Q52 10 52 24" stroke="#c9a128" strokeWidth="1" fill="none" opacity="0.4" />
          {/* Musket */}
          <line x1="16" y1="18" x2="46" y2="18" stroke="#c0c0c0" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="40" y="15" width="8" height="6" rx="1" fill="#c0c0c0" opacity="0.5" />
        </svg>
      );
    case "EIB":
      return (
        <svg width={size * 1.3} height={size * 0.7} viewBox="0 0 62 34" fill="none">
          {/* Wreath */}
          <path d="M8 26 Q8 8 31 6 Q54 8 54 26" stroke="#c0c0c0" strokeWidth="2" fill="none" />
          {/* Musket */}
          <line x1="16" y1="18" x2="46" y2="18" stroke="#c0c0c0" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="40" y="15" width="8" height="6" rx="1" fill="#c0c0c0" opacity="0.5" />
        </svg>
      );
    case "Air Assault":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Helicopter */}
          <ellipse cx="24" cy="20" rx="8" ry="5" fill="rgba(192,192,192,0.2)" stroke="#c0c0c0" strokeWidth="1.5" />
          <line x1="12" y1="14" x2="36" y2="14" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="24" y1="14" x2="24" y2="16" stroke="#c0c0c0" strokeWidth="1.5" />
          <path d="M32 20 L38 24" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" />
          {/* Wings */}
          <path d="M4 30 Q14 24 22 30" stroke="#c9a128" strokeWidth="1.5" fill="none" />
          <path d="M44 30 Q34 24 26 30" stroke="#c9a128" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "SOCM":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Medical cross */}
          <rect x="20" y="10" width="8" height="28" rx="2" fill="#DC143C" />
          <rect x="10" y="20" width="28" height="8" rx="2" fill="#DC143C" />
          {/* SF border */}
          <rect x="6" y="6" width="36" height="36" rx="4" stroke="#c9a128" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "Demo":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Explosion burst */}
          <polygon points="24,6 27,16 38,12 30,20 40,24 30,28 38,36 27,32 24,42 21,32 10,36 18,28 8,24 18,20 10,12 21,16" fill="rgba(201,161,40,0.15)" stroke="#c9a128" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="6" fill="#c9a128" opacity="0.3" />
          <text x="24" y="27" textAnchor="middle" fill="#c9a128" fontSize="8" fontWeight="900">DEM</text>
        </svg>
      );
    case "Combat Diver":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Diver mask */}
          <ellipse cx="24" cy="22" rx="10" ry="8" stroke="#c0c0c0" strokeWidth="2" fill="rgba(192,192,192,0.1)" />
          <circle cx="20" cy="20" r="3" stroke="#c0c0c0" strokeWidth="1.5" fill="none" />
          <circle cx="28" cy="20" r="3" stroke="#c0c0c0" strokeWidth="1.5" fill="none" />
          {/* Bubbles */}
          <circle cx="30" cy="12" r="1.5" fill="#c0c0c0" opacity="0.4" />
          <circle cx="34" cy="8" r="1" fill="#c0c0c0" opacity="0.3" />
          {/* Waves */}
          <path d="M6 34 Q12 30 18 34 Q24 38 30 34 Q36 30 42 34" stroke="#1a9a8a" strokeWidth="1.5" fill="none" />
          <path d="M6 38 Q12 34 18 38 Q24 42 30 38 Q36 34 42 38" stroke="#1a9a8a" strokeWidth="1" fill="none" opacity="0.5" />
        </svg>
      );
    case "JTAC":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Crosshairs */}
          <circle cx="24" cy="24" r="12" stroke="#c9a128" strokeWidth="1.5" fill="none" />
          <circle cx="24" cy="24" r="4" stroke="#c9a128" strokeWidth="1" fill="rgba(201,161,40,0.1)" />
          <line x1="24" y1="8" x2="24" y2="18" stroke="#c9a128" strokeWidth="1.5" />
          <line x1="24" y1="30" x2="24" y2="40" stroke="#c9a128" strokeWidth="1.5" />
          <line x1="8" y1="24" x2="18" y2="24" stroke="#c9a128" strokeWidth="1.5" />
          <line x1="30" y1="24" x2="40" y2="24" stroke="#c9a128" strokeWidth="1.5" />
          {/* Plane */}
          <path d="M32 10 L36 8 L34 12 Z" fill="#c9a128" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="#c9a128" strokeWidth="1.5" fill="none" opacity="0.3" />
          <text x="24" y="28" textAnchor="middle" fill="#c9a128" fontSize="8" fontWeight="900">{abbr}</text>
        </svg>
      );
  }
}
