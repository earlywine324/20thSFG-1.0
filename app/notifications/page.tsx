import { redirect } from "next/navigation";
import { Bell, Star, Shield, Award, CheckCheck, MessageSquare } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { getMyNotifications, markAllRead } from "@/app/lib/actions/notifications";
import MarkReadButtons from "./MarkReadButtons";

function typeIcon(type: string) {
  switch (type) {
    case "promotion":    return <Star   className="w-4 h-4" style={{ color: "#c9a128" }} />;
    case "award":        return <Award  className="w-4 h-4" style={{ color: "#f59e0b" }} />;
    case "qualification":return <Shield className="w-4 h-4" style={{ color: "#4db6e0" }} />;
    case "assignment":   return <Shield className="w-4 h-4" style={{ color: "#8892a4" }} />;
    default:             return <MessageSquare className="w-4 h-4" style={{ color: "#4db6e0" }} />;
  }
}

function typeColor(type: string): string {
  switch (type) {
    case "promotion":     return "rgba(201,161,40,0.12)";
    case "award":         return "rgba(245,158,11,0.1)";
    case "qualification": return "rgba(77,182,224,0.08)";
    default:              return "rgba(77,182,224,0.06)";
  }
}

function typeBorder(type: string): string {
  switch (type) {
    case "promotion":     return "rgba(201,161,40,0.3)";
    case "award":         return "rgba(245,158,11,0.25)";
    case "qualification": return "rgba(77,182,224,0.2)";
    default:              return "rgba(77,182,224,0.15)";
  }
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/notifications");

  const notifications = await getMyNotifications();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#07090e", color: "#e8edf5" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #161b27", backgroundColor: "#0c0f17" }}>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5" style={{ color: "#4db6e0" }} />
                <h1 className="text-2xl font-black" style={{ color: "#e8edf5" }}>Notifications</h1>
                {unread > 0 && (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    {unread} unread
                  </span>
                )}
              </div>
              <p className="text-xs" style={{ color: "#505870" }}>
                Messages, promotions, awards, and unit updates
              </p>
            </div>
            {unread > 0 && (
              <form action={markAllRead}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded transition-colors"
                  style={{ color: "#4db6e0", border: "1px solid rgba(77,182,224,0.2)", backgroundColor: "rgba(77,182,224,0.05)" }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark All Read
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bell className="w-10 h-10 mb-4" style={{ color: "#2e3650" }} />
            <p className="text-sm font-black tracking-widest uppercase" style={{ color: "#505870" }}>
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="rounded-lg p-5 relative"
                style={{
                  backgroundColor: n.read ? "#0c0f17" : typeColor(n.type),
                  border: `1px solid ${n.read ? "#161b27" : typeBorder(n.type)}`,
                }}
              >
                {/* Unread indicator */}
                {!n.read && (
                  <span
                    className="absolute top-4 right-4 inline-block rounded-full"
                    style={{ width: 7, height: 7, backgroundColor: "#ef4444" }}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center shrink-0 rounded"
                    style={{
                      width: 36, height: 36,
                      backgroundColor: n.read ? "#161b27" : "rgba(0,0,0,0.2)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {typeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p
                        className="text-sm font-black"
                        style={{ color: n.read ? "#8892a4" : "#e8edf5" }}
                      >
                        {n.title}
                      </p>
                      <span
                        className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded"
                        style={{ color: "#505870", backgroundColor: "#161b27" }}
                      >
                        {n.type}
                      </span>
                    </div>
                    <p
                      className="text-xs leading-relaxed mb-2"
                      style={{ color: n.read ? "#505870" : "#8892a4" }}
                    >
                      {n.body}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px]" style={{ color: "#2e3650" }}>
                        {formatDate(n.created_at)}
                      </p>
                      {!n.read && <MarkReadButtons id={n.id} />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
