"use client";

import { useTransition } from "react";
import { markRead } from "@/app/lib/actions/notifications";

export default function MarkReadButtons({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => markRead(id))}
      disabled={pending}
      className="text-[10px] font-bold tracking-widest uppercase transition-colors disabled:opacity-40"
      style={{ color: "#4db6e0" }}
    >
      {pending ? "..." : "Mark read"}
    </button>
  );
}
