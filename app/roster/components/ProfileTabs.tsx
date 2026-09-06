"use client";

import { useState } from "react";

const TABS = [
  "Profile",
  "Service Record",
  "Award Record",
  "Combat Record",
  "Rank Record",
  "Assignment Record",
  "Qualification Record",
] as const;

type Tab = (typeof TABS)[number];

export default function ProfileTabs({
  children,
}: {
  children: Record<Tab, React.ReactNode>;
}) {
  const [active, setActive] = useState<Tab>("Profile");

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex overflow-x-auto"
        style={{ borderBottom: "1px solid #2d3139", backgroundColor: "#272b33" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className="shrink-0 px-4 py-3 text-[11px] font-bold tracking-wide transition-colors relative whitespace-nowrap"
            style={{
              color: active === tab ? "#e8e4d8" : "#6b7280",
              backgroundColor: active === tab ? "#22262e" : "transparent",
              borderBottom: active === tab ? "2px solid #c9a128" : "2px solid transparent",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">{children[active]}</div>
    </div>
  );
}
