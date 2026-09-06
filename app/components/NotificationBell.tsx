"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function fetchCount() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCount(0); return; }

      const { count: c } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("recipient_user_id", user.id)
        .eq("read", false);

      setCount(c ?? 0);
    }

    fetchCount();

    // Re-fetch on auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => fetchCount());
    return () => subscription.unsubscribe();
  }, []);

  if (count === 0) {
    return (
      <Link
        href="/notifications"
        className="relative flex items-center justify-center p-2 rounded transition-colors hover:bg-[#161b27]"
        style={{ color: "#505870" }}
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <Link
      href="/notifications"
      className="relative flex items-center justify-center p-2 rounded transition-colors hover:bg-[#161b27]"
      style={{ color: "#e8edf5" }}
      title={`${count} unread notification${count !== 1 ? "s" : ""}`}
    >
      <Bell className="w-4 h-4" />
      <span
        className="absolute top-0.5 right-0.5 flex items-center justify-center text-[8px] font-black rounded-full"
        style={{
          minWidth: 14,
          height: 14,
          backgroundColor: "#ef4444",
          color: "#fff",
          padding: "0 3px",
          lineHeight: 1,
        }}
      >
        {count > 9 ? "9+" : count}
      </span>
    </Link>
  );
}
